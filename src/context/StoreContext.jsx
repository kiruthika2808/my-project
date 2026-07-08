import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { storeService } from "../services/storeService";

const StoreContext = createContext(null);

const DEFAULT_WISHLIST = ["aster-boucle-lounge-chair", "lumi-arc-floor-lamp"];
const DEFAULT_CART = [
  { id: "aster-boucle-lounge-chair", qty: 1 },
  { id: "ciel-ceramic-vase-set", qty: 2 },
];

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Store data states
  const [products, setProducts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [collections, setCollections] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [brands, setBrands] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [settings, setSettings] = useState(null);

  // Cart & Wishlist states
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Fetch global storefront data
  useEffect(() => {
    async function loadData() {
      try {
        console.log("StoreContext: Loading storefront data from Supabase...");
        console.log("StoreContext: Supabase Config URL:", import.meta.env.VITE_SUPABASE_URL ? "Defined" : "UNDEFINED");
        const [
          dbProducts,
          dbRooms,
          dbCollections,
          dbDesigners,
          dbBrands,
          dbReviews,
          dbPosts,
          dbFaqs,
          dbSettings,
        ] = await Promise.all([
          storeService.getProducts(),
          storeService.getRooms(),
          storeService.getCollections(),
          storeService.getDesigners(),
          storeService.getBrands(),
          storeService.getReviews(),
          storeService.getPosts(),
          storeService.getFaqs(),
          storeService.getSettings(),
        ]);

        console.log("StoreContext: Data fetched successfully!", {
          products: dbProducts?.length,
          rooms: dbRooms?.length,
          collections: dbCollections?.length,
          brands: dbBrands?.length,
          reviews: dbReviews?.length
        });

        setProducts(dbProducts);
        setRooms(dbRooms);
        setCollections(dbCollections);
        setDesigners(dbDesigners);
        setBrands(dbBrands);
        setReviews(dbReviews);
        setPosts(dbPosts);
        setFaqs(dbFaqs);
        setSettings(dbSettings);
      } catch (err) {
        console.error("Failed to load storefront data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Listen to Auth State changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        // Logged in! Merge guest cart/wishlist with Supabase
        const guestWishlist = JSON.parse(localStorage.getItem("spacesic_wishlist") || "[]");
        const guestCart = JSON.parse(localStorage.getItem("spacesic_cart") || "[]");

        // Fetch user's cart and wishlist from DB
        const dbWishlist = await storeService.getWishlistItems(currentUser.id);
        const dbCart = await storeService.getCartItems(currentUser.id);

        let finalWishlist = dbWishlist || [];
        guestWishlist.forEach((id) => {
          if (!finalWishlist.includes(id)) {
            finalWishlist.push(id);
          }
        });

        let finalCart = dbCart || [];
        guestCart.forEach((guestItem) => {
          const existing = finalCart.find((c) => c.id === guestItem.id);
          if (existing) {
            existing.qty = Math.max(existing.qty, guestItem.qty);
          } else {
            finalCart.push(guestItem);
          }
        });

        setWishlist(finalWishlist);
        setCart(finalCart);

        // Sync back to DB
        await storeService.syncWishlistItems(currentUser.id, finalWishlist);
        await storeService.syncCartItems(currentUser.id, finalCart);

        // Clear local storage for guests
        localStorage.removeItem("spacesic_wishlist");
        localStorage.removeItem("spacesic_cart");
      } else {
        // Logged out! Load from localStorage or defaults
        const localWishlist = localStorage.getItem("spacesic_wishlist");
        const localCart = localStorage.getItem("spacesic_cart");

        if (localWishlist) {
          setWishlist(JSON.parse(localWishlist));
        } else {
          setWishlist(DEFAULT_WISHLIST);
          localStorage.setItem("spacesic_wishlist", JSON.stringify(DEFAULT_WISHLIST));
        }

        if (localCart) {
          setCart(JSON.parse(localCart));
        } else {
          setCart(DEFAULT_CART);
          localStorage.setItem("spacesic_cart", JSON.stringify(DEFAULT_CART));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync state to local storage or DB on modification
  const persistWishlist = async (updatedWishlist) => {
    if (user) {
      await storeService.syncWishlistItems(user.id, updatedWishlist);
    } else {
      localStorage.setItem("spacesic_wishlist", JSON.stringify(updatedWishlist));
    }
  };

  const persistCart = async (updatedCart) => {
    if (user) {
      await storeService.syncCartItems(user.id, updatedCart);
    } else {
      localStorage.setItem("spacesic_cart", JSON.stringify(updatedCart));
    }
  };

  // Actions
  const addToCart = (productOrId, qty = 1) => {
    const id = typeof productOrId === "string" ? productOrId : productOrId.id;
    if (!id) return;
    const product = typeof productOrId === "string" ? products.find((item) => item.id === id) : productOrId;
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === id);
      const updated = existing
        ? currentCart.map((item) => (item.id === id ? { ...item, product: item.product || product, qty: item.qty + qty } : item))
        : [...currentCart, { id, qty, product }];
      persistCart(updated);
      return updated;
    });
    setCartDrawerOpen(true);
  };

  const updateQty = (id, qty) => {
    setCart((currentCart) => {
      const updated = qty < 1
        ? currentCart.filter((item) => item.id !== id)
        : currentCart.map((item) => (item.id === id ? { ...item, qty } : item));
      persistCart(updated);
      return updated;
    });
  };

  const toggleWishlist = (id) => {
    setWishlist((currentWishlist) => {
      const updated = currentWishlist.includes(id)
        ? currentWishlist.filter((item) => item !== id)
        : [...currentWishlist, id];
      persistWishlist(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    persistCart([]);
  };

  // User auth actions
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, fullName) => {
    // 1. Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;

    // 2. Add customer profile in database
    if (data?.user) {
      try {
        await storeService.getOrCreateCustomer({
          name: fullName,
          email: email,
          phone: "",
          address: "",
          city: "",
        });
      } catch (custErr) {
        console.warn("Failed to create customer profile in DB during register:", custErr);
      }
    }
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Contact form action
  const submitContact = async (enquiry) => {
    return await storeService.submitContactEnquiry(enquiry);
  };

  // Checkout order placement action
  const placeOrder = async (customerDetails) => {
    try {
      // 1. Find or create customer
      const customer = await storeService.getOrCreateCustomer(customerDetails);

      // 2. Format order data
      const orderId = "SPC-" + Math.floor(1000 + Math.random() * 9000);
      const amount = cart.reduce((sum, line) => {
        const product = products.find((p) => p.id === line.id) || line.product;
        return sum + (product ? product.price * line.qty : 0);
      }, 0) + 180; // include delivery

      // Extract item names
      const itemNames = cart
        .map((line) => {
          const product = products.find((p) => p.id === line.id) || line.product;
          return product ? product.name : null;
        })
        .filter(Boolean);

      const orderData = {
        id: orderId,
        customerId: customer.id,
        customer: customer.name,
        email: customer.email,
        phone: customerDetails.phone,
        amount: amount,
        status: "Pending",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        items: itemNames,
      };

      // 3. Insert order
      await storeService.createOrder(orderData);

      // 4. Clear cart
      clearCart();

      return { success: true, orderId };
    } catch (err) {
      console.error("Order placement failed:", err);
      throw err;
    }
  };

  const shop = {
    wishlist,
    cart,
    addToCart,
    updateQty,
    toggleWishlist,
    clearCart,
    cartDrawerOpen,
    setCartDrawerOpen,
  };

  const storeState = {
    user,
    loading,
    products,
    rooms,
    collections,
    designers,
    brands,
    reviews,
    posts,
    faqs,
    settings,
    shop,
    login,
    register,
    logout,
    submitContact,
    placeOrder,
  };

  return <StoreContext.Provider value={storeState}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}

import { createContext, useContext, useMemo, useReducer, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { initialSettings } from "../services/adminData";
import { productsService } from "../services/productsService";
import { categoriesService } from "../services/categoriesService";
import { customersService } from "../services/customersService";
import { ordersService } from "../services/ordersService";
import { reviewsService } from "../services/reviewsService";
import { contentService } from "../services/contentService";

const AdminContext = createContext(null);

const initialState = {
  isAuthenticated: false,
  darkMode: false,
  loading: false,
  toast: null,
  products: [],
  categories: [],
  orders: [],
  customers: [],
  reviews: [],
  rooms: [],
  collections: [],
  designers: [],
  brands: [],
  posts: [],
  faqs: [],
  enquiries: [],
  settings: initialSettings,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_AUTH":
      return { ...state, isAuthenticated: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_INITIAL_DATA":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_DATA":
      return { ...state, [action.payload.key]: action.payload.data };
    case "ADD_ITEM":
      return {
        ...state,
        [action.payload.key]: [action.payload.item, ...state[action.payload.key]],
        toast: { type: "success", message: `${action.payload.label} created successfully.` },
      };
    case "UPDATE_ITEM": {
      const idField = action.payload.idField || "id";
      return {
        ...state,
        [action.payload.key]: state[action.payload.key].map((item) =>
          item[idField] === action.payload.item[idField] ? { ...item, ...action.payload.item } : item
        ),
        toast: { type: "success", message: `${action.payload.label} updated successfully.` },
      };
    }
    case "DELETE_ITEM": {
      const idField = action.payload.idField || "id";
      return {
        ...state,
        [action.payload.key]: state[action.payload.key].filter((item) => item[idField] !== action.payload.id),
        toast: { type: "success", message: `${action.payload.label} deleted successfully.` },
      };
    }
    case "TOGGLE_THEME":
      return { ...state, darkMode: !state.darkMode };
    case "TOAST":
      return { ...state, toast: action.payload };
    case "CLEAR_TOAST":
      return { ...state, toast: null };
    default:
      return state;
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const [
        dbProducts,
        dbCategories,
        dbOrders,
        dbCustomers,
        dbReviews,
        dbSettings,
        dbRooms,
        dbCollections,
        dbDesigners,
        dbBrands,
        dbPosts,
        dbFaqs,
        dbEnquiries,
      ] = await Promise.all([
        productsService.fetchAll().catch((e) => { console.error(e); return []; }),
        categoriesService.fetchAll().catch((e) => { console.error(e); return []; }),
        ordersService.fetchAll().catch((e) => { console.error(e); return []; }),
        customersService.fetchAll().catch((e) => { console.error(e); return []; }),
        reviewsService.fetchAll().catch((e) => { console.error(e); return []; }),
        supabase.from("settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => data || initialSettings).catch((e) => { console.error(e); return initialSettings; }),
        contentService.fetchRooms().catch((e) => { console.error(e); return []; }),
        contentService.fetchCollections().catch((e) => { console.error(e); return []; }),
        contentService.fetchDesigners().catch((e) => { console.error(e); return []; }),
        contentService.fetchBrands().catch((e) => { console.error(e); return []; }),
        contentService.fetchPosts().catch((e) => { console.error(e); return []; }),
        contentService.fetchFaqs().catch((e) => { console.error(e); return []; }),
        contentService.fetchEnquiries().catch((e) => { console.error(e); return []; }),
      ]);

      dispatch({
        type: "SET_INITIAL_DATA",
        payload: {
          products: dbProducts,
          categories: dbCategories,
          orders: dbOrders,
          customers: dbCustomers,
          reviews: dbReviews,
          settings: dbSettings,
          rooms: dbRooms,
          collections: dbCollections,
          designers: dbDesigners,
          brands: dbBrands,
          posts: dbPosts,
          faqs: dbFaqs,
          enquiries: dbEnquiries,
        },
      });
    } catch (err) {
      console.error("Fetch initial data failed:", err);
      dispatch({ type: "TOAST", payload: { type: "error", message: "Failed to load database data." } });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: "SET_AUTH", payload: !!session });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: "SET_AUTH", payload: !!session });
    });

    fetchData();

    return () => subscription.unsubscribe();
  }, []);

  const actions = useMemo(() => ({
    refreshData: fetchData,
    login: async ({ email, password }) => {
      dispatch({ type: "SET_LOADING", payload: true });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      dispatch({ type: "SET_LOADING", payload: false });
      if (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      } else {
        dispatch({ type: "TOAST", payload: { type: "success", message: "Welcome back to Spacesic admin." } });
      }
    },
    logout: async () => {
      await supabase.auth.signOut();
      dispatch({ type: "TOAST", payload: { type: "success", message: "Logged out successfully." } });
    },
    toggleTheme: () => dispatch({ type: "TOGGLE_THEME" }),
    clearToast: () => dispatch({ type: "CLEAR_TOAST" }),
    showToast: (toast) => dispatch({ type: "TOAST", payload: toast }),

    // Products actions
    addProduct: async (product) => {
      try {
        const data = await productsService.create(product);
        dispatch({ type: "ADD_ITEM", payload: { key: "products", item: data, label: "Product" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    updateProduct: async (id, product) => {
      try {
        const data = await productsService.update(id, product);
        dispatch({ type: "UPDATE_ITEM", payload: { key: "products", item: data, label: "Product" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    deleteProduct: async (id) => {
      try {
        await productsService.delete(id);
        dispatch({ type: "DELETE_ITEM", payload: { key: "products", id, label: "Product" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // Categories actions
    addCategory: async (category) => {
      try {
        const data = await categoriesService.create(category);
        dispatch({ type: "ADD_ITEM", payload: { key: "categories", item: data, label: "Category" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    updateCategory: async (id, category) => {
      try {
        const data = await categoriesService.update(id, category);
        dispatch({ type: "UPDATE_ITEM", payload: { key: "categories", item: data, label: "Category" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    deleteCategory: async (id) => {
      try {
        await categoriesService.delete(id);
        dispatch({ type: "DELETE_ITEM", payload: { key: "categories", id, label: "Category" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // Customers actions
    addCustomer: async (customer) => {
      try {
        const data = await customersService.create(customer);
        dispatch({ type: "ADD_ITEM", payload: { key: "customers", item: data, label: "Customer" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    updateCustomer: async (id, customer) => {
      try {
        const data = await customersService.update(id, customer);
        dispatch({ type: "UPDATE_ITEM", payload: { key: "customers", item: data, label: "Customer" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    deleteCustomer: async (id) => {
      try {
        await customersService.delete(id);
        dispatch({ type: "DELETE_ITEM", payload: { key: "customers", id, label: "Customer" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // Orders actions
    addOrder: async (order) => {
      try {
        const data = await ordersService.create(order);
        dispatch({ type: "ADD_ITEM", payload: { key: "orders", item: data, label: "Order" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    updateOrder: async (id, order) => {
      try {
        const data = await ordersService.update(id, order);
        dispatch({ type: "UPDATE_ITEM", payload: { key: "orders", item: data, label: "Order" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    deleteOrder: async (id) => {
      try {
        await ordersService.delete(id);
        dispatch({ type: "DELETE_ITEM", payload: { key: "orders", id, label: "Order" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // Reviews actions
    addReview: async (review) => {
      try {
        const data = await reviewsService.create(review);
        dispatch({ type: "ADD_ITEM", payload: { key: "reviews", item: data, label: "Review" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    updateReview: async (id, review) => {
      try {
        const data = await reviewsService.update(id, review);
        dispatch({ type: "UPDATE_ITEM", payload: { key: "reviews", item: data, label: "Review" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    deleteReview: async (id) => {
      try {
        await reviewsService.delete(id);
        dispatch({ type: "DELETE_ITEM", payload: { key: "reviews", id, label: "Review" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // Rooms actions
    addRoom: async (room) => {
      try {
        const data = await contentService.createRoom(room);
        dispatch({ type: "ADD_ITEM", payload: { key: "rooms", item: data, label: "Room" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    updateRoom: async (name, room) => {
      try {
        const data = await contentService.updateRoom(name, room);
        dispatch({ type: "UPDATE_ITEM", payload: { key: "rooms", item: data, idField: "name", label: "Room" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    deleteRoom: async (name) => {
      try {
        await contentService.deleteRoom(name);
        dispatch({ type: "DELETE_ITEM", payload: { key: "rooms", id: name, idField: "name", label: "Room" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // Collections actions
    addCollection: async (collection) => {
      try {
        const data = await contentService.createCollection(collection);
        dispatch({ type: "ADD_ITEM", payload: { key: "collections", item: data, label: "Collection" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    updateCollection: async (name, collection) => {
      try {
        const data = await contentService.updateCollection(name, collection);
        dispatch({ type: "UPDATE_ITEM", payload: { key: "collections", item: data, idField: "name", label: "Collection" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    deleteCollection: async (name) => {
      try {
        await contentService.deleteCollection(name);
        dispatch({ type: "DELETE_ITEM", payload: { key: "collections", id: name, idField: "name", label: "Collection" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // Designers actions
    addDesigner: async (designer) => {
      try {
        const data = await contentService.createDesigner(designer);
        dispatch({ type: "ADD_ITEM", payload: { key: "designers", item: data, label: "Designer" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    updateDesigner: async (name, designer) => {
      try {
        const data = await contentService.updateDesigner(name, designer);
        dispatch({ type: "UPDATE_ITEM", payload: { key: "designers", item: data, idField: "name", label: "Designer" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    deleteDesigner: async (name) => {
      try {
        await contentService.deleteDesigner(name);
        dispatch({ type: "DELETE_ITEM", payload: { key: "designers", id: name, idField: "name", label: "Designer" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // Brands actions
    addBrand: async (brand) => {
      try {
        const data = await contentService.createBrand(brand);
        dispatch({ type: "ADD_ITEM", payload: { key: "brands", item: data, label: "Brand" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    updateBrand: async (name, brand) => {
      try {
        const data = await contentService.updateBrand(name, brand);
        dispatch({ type: "UPDATE_ITEM", payload: { key: "brands", item: data, idField: "name", label: "Brand" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    deleteBrand: async (name) => {
      try {
        await contentService.deleteBrand(name);
        dispatch({ type: "DELETE_ITEM", payload: { key: "brands", id: name, idField: "name", label: "Brand" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // Posts actions
    addPost: async (post) => {
      try {
        const data = await contentService.createPost(post);
        dispatch({ type: "ADD_ITEM", payload: { key: "posts", item: data, label: "Blog Post" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    updatePost: async (id, post) => {
      try {
        const data = await contentService.updatePost(id, post);
        dispatch({ type: "UPDATE_ITEM", payload: { key: "posts", item: data, label: "Blog Post" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    deletePost: async (id) => {
      try {
        await contentService.deletePost(id);
        dispatch({ type: "DELETE_ITEM", payload: { key: "posts", id, label: "Blog Post" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // FAQs actions
    addFaq: async (faq) => {
      try {
        const data = await contentService.createFaq(faq);
        dispatch({ type: "ADD_ITEM", payload: { key: "faqs", item: data, label: "FAQ" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    updateFaq: async (id, faq) => {
      try {
        const data = await contentService.updateFaq(id, faq);
        dispatch({ type: "UPDATE_ITEM", payload: { key: "faqs", item: data, label: "FAQ" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },
    deleteFaq: async (id) => {
      try {
        await contentService.deleteFaq(id);
        dispatch({ type: "DELETE_ITEM", payload: { key: "faqs", id, label: "FAQ" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // Enquiries actions
    deleteEnquiry: async (id) => {
      try {
        await contentService.deleteEnquiry(id);
        dispatch({ type: "DELETE_ITEM", payload: { key: "enquiries", id, label: "Contact Enquiry" } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
        throw error;
      }
    },

    // Store settings
    updateSettings: async (settingsData) => {
      try {
        const { error } = await supabase.from("settings").update(settingsData).eq("id", 1);
        if (error) throw error;
        dispatch({ type: "SET_INITIAL_DATA", payload: { settings: { ...state.settings, ...settingsData } } });
        dispatch({ type: "TOAST", payload: { type: "success", message: "Settings saved successfully." } });
      } catch (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      }
    }
  }), [state.settings]);

  return <AdminContext.Provider value={{ ...state, ...actions }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
}

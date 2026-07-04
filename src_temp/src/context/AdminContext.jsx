import { createContext, useContext, useMemo, useReducer, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { initialSettings } from "../services/adminData";

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
  settings: initialSettings,
};

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_AUTH":
      return { ...state, isAuthenticated: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_INITIAL_DATA":
      return {
        ...state,
        products: action.payload.products,
        categories: action.payload.categories,
        orders: action.payload.orders,
        customers: action.payload.customers,
        reviews: action.payload.reviews,
        settings: action.payload.settings,
      };
    case "TOGGLE_THEME":
      return { ...state, darkMode: !state.darkMode };
    case "TOAST":
      return { ...state, toast: action.payload };
    case "CLEAR_TOAST":
      return { ...state, toast: null };
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [action.payload, ...state.products],
        toast: { type: "success", message: "Product added." },
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) => (product.id === action.payload.id ? { ...product, ...action.payload } : product)),
        toast: { type: "success", message: "Product updated." },
      };
    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter((product) => product.id !== action.payload), toast: { type: "success", message: "Product deleted." } };
    case "ADD_CATEGORY":
      return { ...state, categories: [action.payload, ...state.categories], toast: { type: "success", message: "Category created." } };
    case "UPDATE_CATEGORY":
      return { ...state, categories: state.categories.map((category) => (category.id === action.payload.id ? { ...category, ...action.payload } : category)), toast: { type: "success", message: "Category updated." } };
    case "DELETE_CATEGORY":
      return { ...state, categories: state.categories.filter((category) => category.id !== action.payload), toast: { type: "success", message: "Category deleted." } };
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((order) => (order.id === action.payload.id ? { ...order, status: action.payload.status } : order)),
        toast: { type: "success", message: "Order status updated." },
      };
    case "APPROVE_REVIEW":
      return { ...state, reviews: state.reviews.map((review) => (review.id === action.payload ? { ...review, status: "Approved" } : review)), toast: { type: "success", message: "Review approved." } };
    case "DELETE_REVIEW":
      return { ...state, reviews: state.reviews.filter((review) => review.id !== action.payload), toast: { type: "success", message: "Review deleted." } };
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload }, toast: { type: "success", message: "Settings saved." } };
    default:
      return state;
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Check current auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: "SET_AUTH", payload: !!session });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: "SET_AUTH", payload: !!session });
    });

    // Fetch initial data from Supabase
    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const [
          { data: dbProducts, error: pError },
          { data: dbCategories, error: cError },
          { data: dbOrders, error: oError },
          { data: dbCustomers, error: custError },
          { data: dbReviews, error: rError },
          { data: dbSettings, error: sError }
        ] = await Promise.all([
          supabase.from("products").select("*"),
          supabase.from("categories").select("*"),
          supabase.from("orders").select("*"),
          supabase.from("customers").select("*"),
          supabase.from("reviews").select("*"),
          supabase.from("settings").select("*").eq("id", 1).maybeSingle()
        ]);

        if (pError || cError || oError || custError || rError || sError) {
          console.error("Error fetching Supabase data:", { pError, cError, oError, custError, rError, sError });
        }

        dispatch({
          type: "SET_INITIAL_DATA",
          payload: {
            products: dbProducts || [],
            categories: dbCategories || [],
            orders: dbOrders || [],
            customers: dbCustomers || [],
            reviews: dbReviews || [],
            settings: dbSettings || initialSettings
          }
        });
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchData();

    return () => subscription.unsubscribe();
  }, []);

  const actions = useMemo(() => ({
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
    addProduct: async (product) => {
      const id = slugify(product.name);
      const newProduct = {
        ...product,
        id,
        badge: "New",
        rating: 4.8,
        reviews: 0
      };
      const { error } = await supabase.from("products").insert(newProduct);
      if (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      } else {
        dispatch({ type: "ADD_PRODUCT", payload: newProduct });
      }
    },
    updateProduct: async (product) => {
      const { error } = await supabase.from("products").update(product).eq("id", product.id);
      if (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      } else {
        dispatch({ type: "UPDATE_PRODUCT", payload: product });
      }
    },
    deleteProduct: async (id) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      } else {
        dispatch({ type: "DELETE_PRODUCT", payload: id });
      }
    },
    addCategory: async (category) => {
      const id = slugify(category.name);
      const newCategory = { id, productCount: 0, ...category };
      const { error } = await supabase.from("categories").insert(newCategory);
      if (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      } else {
        dispatch({ type: "ADD_CATEGORY", payload: newCategory });
      }
    },
    updateCategory: async (category) => {
      const { error } = await supabase.from("categories").update(category).eq("id", category.id);
      if (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      } else {
        dispatch({ type: "UPDATE_CATEGORY", payload: category });
      }
    },
    deleteCategory: async (id) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      } else {
        dispatch({ type: "DELETE_CATEGORY", payload: id });
      }
    },
    updateOrderStatus: async (id, status) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      } else {
        dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id, status } });
      }
    },
    approveReview: async (id) => {
      const { error } = await supabase.from("reviews").update({ status: "Approved" }).eq("id", id);
      if (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      } else {
        dispatch({ type: "APPROVE_REVIEW", payload: id });
      }
    },
    deleteReview: async (id) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      } else {
        dispatch({ type: "DELETE_REVIEW", payload: id });
      }
    },
    updateSettings: async (settingsData) => {
      const { error } = await supabase.from("settings").update(settingsData).eq("id", 1);
      if (error) {
        dispatch({ type: "TOAST", payload: { type: "error", message: error.message } });
      } else {
        dispatch({ type: "UPDATE_SETTINGS", payload: settingsData });
      }
    }
  }), []);

  return <AdminContext.Provider value={{ ...state, ...actions }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
}

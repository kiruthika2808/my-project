import { createContext, useContext, useMemo, useReducer } from "react";
import {
  initialCategories,
  initialCustomers,
  initialOrders,
  initialProducts,
  initialReviews,
  initialSettings,
} from "../services/adminData";

const AdminContext = createContext(null);

const initialState = {
  isAuthenticated: false,
  darkMode: false,
  loading: false,
  toast: null,
  products: initialProducts,
  categories: initialCategories,
  orders: initialOrders,
  customers: initialCustomers,
  reviews: initialReviews,
  settings: initialSettings,
};

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true, toast: { type: "success", message: "Welcome back to Spacesic admin." } };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, toast: { type: "success", message: "Logged out successfully." } };
    case "TOGGLE_THEME":
      return { ...state, darkMode: !state.darkMode };
    case "TOAST":
      return { ...state, toast: action.payload };
    case "CLEAR_TOAST":
      return { ...state, toast: null };
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [{ ...action.payload, id: slugify(action.payload.name), badge: "New", rating: 4.8, reviews: 0 }, ...state.products],
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
      return { ...state, categories: [{ id: slugify(action.payload.name), productCount: 0, ...action.payload }, ...state.categories], toast: { type: "success", message: "Category created." } };
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

  // Demo authentication keeps the app self-contained until a backend is attached.
  const actions = useMemo(() => ({
    login: ({ email, password }) => {
      if (email && password) dispatch({ type: "LOGIN" });
      else dispatch({ type: "TOAST", payload: { type: "error", message: "Enter email and password." } });
    },
    logout: () => dispatch({ type: "LOGOUT" }),
    toggleTheme: () => dispatch({ type: "TOGGLE_THEME" }),
    clearToast: () => dispatch({ type: "CLEAR_TOAST" }),
    addProduct: (product) => dispatch({ type: "ADD_PRODUCT", payload: product }),
    updateProduct: (product) => dispatch({ type: "UPDATE_PRODUCT", payload: product }),
    deleteProduct: (id) => dispatch({ type: "DELETE_PRODUCT", payload: id }),
    addCategory: (category) => dispatch({ type: "ADD_CATEGORY", payload: category }),
    updateCategory: (category) => dispatch({ type: "UPDATE_CATEGORY", payload: category }),
    deleteCategory: (id) => dispatch({ type: "DELETE_CATEGORY", payload: id }),
    updateOrderStatus: (id, status) => dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id, status } }),
    approveReview: (id) => dispatch({ type: "APPROVE_REVIEW", payload: id }),
    deleteReview: (id) => dispatch({ type: "DELETE_REVIEW", payload: id }),
    updateSettings: (settings) => dispatch({ type: "UPDATE_SETTINGS", payload: settings }),
  }), []);

  return <AdminContext.Provider value={{ ...state, ...actions }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
}

import { supabase } from "../supabaseClient";
import * as staticData from "../data";
import { initialSettings } from "./adminData";

// Helper to handle fetches with fallbacks
async function safeFetch(tableName, staticFallback, transformFn = (x) => x) {
  try {
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) {
      console.warn(`Supabase fetch failed for ${tableName}, falling back to static data:`, error.message);
      return staticFallback;
    }
    if (!data || data.length === 0) {
      return staticFallback;
    }
    return data.map(transformFn);
  } catch (err) {
    console.warn(`Error fetching ${tableName}, falling back to static data:`, err);
    return staticFallback;
  }
}

export const storeService = {
  // Fetch products
  async getProducts() {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error || !data || data.length === 0) {
        if (error) console.warn("Supabase products fetch failed, using fallback:", error.message);
        return staticData.products;
      }
      return data.map((p) => ({
        ...p,
        price: Number(p.price),
        oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
        rating: Number(p.rating),
        reviews: Number(p.reviews),
      }));
    } catch (err) {
      console.warn("Products fetch error, using fallback:", err);
      return staticData.products;
    }
  },

  // Fetch rooms
  async getRooms() {
    return safeFetch(
      "rooms",
      staticData.rooms,
      (row) => [row.name, row.count, row.image]
    );
  },

  // Fetch collections
  async getCollections() {
    return safeFetch(
      "collections",
      staticData.collections,
      (row) => [row.name, row.text, row.image]
    );
  },

  // Fetch designers
  async getDesigners() {
    return safeFetch(
      "designers",
      staticData.designers,
      (row) => [row.name, row.text, row.city, row.image]
    );
  },

  // Fetch brands
  async getBrands() {
    return safeFetch(
      "brands",
      staticData.brands,
      (row) => row.name
    );
  },

  // Fetch reviews
  async getReviews() {
    try {
      // Fetch only approved reviews for general customer display
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "Approved");
      if (error || !data || data.length === 0) {
        if (error) console.warn("Supabase reviews fetch failed, using fallback:", error.message);
        return staticData.reviews;
      }
      return data.map((row) => [row.customer, row.role || "Homeowner", row.text]);
    } catch (err) {
      console.warn("Reviews fetch error, using fallback:", err);
      return staticData.reviews;
    }
  },

  // Fetch blog posts
  async getPosts() {
    return safeFetch(
      "posts",
      staticData.posts,
      (row) => [row.title, row.text]
    );
  },

  // Fetch FAQs
  async getFaqs() {
    return safeFetch(
      "faqs",
      staticData.faqs,
      (row) => [row.question, row.answer]
    );
  },

  // Fetch settings
  async getSettings() {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error || !data) {
        return initialSettings;
      }
      return data;
    } catch (err) {
      console.warn("Settings fetch error, using fallback:", err);
      return initialSettings;
    }
  },

  // Submit contact message
  async submitContactEnquiry(enquiry) {
    try {
      const { error } = await supabase.from("contact_enquiries").insert({
        name: enquiry.name,
        email: enquiry.email,
        project_type: enquiry.projectType,
        message: enquiry.message,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Failed to submit contact enquiry to Supabase:", err);
      throw err;
    }
  },

  // Create or find customer by email
  async getOrCreateCustomer(customerDetails) {
    try {
      const email = customerDetails.email.toLowerCase().trim();
      const { data: existing, error: fetchError } = await supabase
        .from("customers")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (existing) return existing;

      // Create new customer
      const id = customerDetails.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
      const newCustomer = {
        id,
        name: customerDetails.name,
        email,
        phone: customerDetails.phone,
        location: `${customerDetails.address}, ${customerDetails.city}`,
      };

      const { error: insertError } = await supabase.from("customers").insert(newCustomer);
      if (insertError) throw insertError;

      return newCustomer;
    } catch (err) {
      console.error("Error getting or creating customer:", err);
      throw err;
    }
  },

  // Create order
  async createOrder(orderData) {
    try {
      const { error } = await supabase.from("orders").insert({
        id: orderData.id,
        customerId: orderData.customerId,
        customer: orderData.customer,
        email: orderData.email,
        phone: orderData.phone,
        amount: orderData.amount,
        status: orderData.status || "Pending",
        date: orderData.date,
        items: orderData.items,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Failed to insert order in Supabase:", err);
      throw err;
    }
  },

  // Fetch cart items for a user
  async getCartItems(userId) {
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("product_id, qty")
        .eq("user_id", userId);
      if (error) throw error;
      return data.map((item) => ({ id: item.product_id, qty: item.qty }));
    } catch (err) {
      console.warn("Failed to fetch cart items from Supabase:", err.message);
      return null;
    }
  },

  // Save/sync cart items for a user
  async syncCartItems(userId, cartItems) {
    try {
      // Clear existing cart items for this user
      await supabase.from("cart_items").delete().eq("user_id", userId);
      if (cartItems.length === 0) return;

      const rows = cartItems.map((item) => ({
        user_id: userId,
        product_id: item.id,
        qty: item.qty,
      }));

      const { error } = await supabase.from("cart_items").insert(rows);
      if (error) throw error;
    } catch (err) {
      console.warn("Failed to sync cart items to Supabase:", err.message);
    }
  },

  // Fetch wishlist items for a user
  async getWishlistItems(userId) {
    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", userId);
      if (error) throw error;
      return data.map((item) => item.product_id);
    } catch (err) {
      console.warn("Failed to fetch wishlist items from Supabase:", err.message);
      return null;
    }
  },

  // Save/sync wishlist items for a user
  async syncWishlistItems(userId, wishlistItems) {
    try {
      // Clear existing wishlist items for this user
      await supabase.from("wishlists").delete().eq("user_id", userId);
      if (wishlistItems.length === 0) return;

      const rows = wishlistItems.map((productId) => ({
        user_id: userId,
        product_id: productId,
      }));

      const { error } = await supabase.from("wishlists").insert(rows);
      if (error) throw error;
    } catch (err) {
      console.warn("Failed to sync wishlist items to Supabase:", err.message);
    }
  },
};

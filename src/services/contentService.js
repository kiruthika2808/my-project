import { supabase } from "../supabaseClient";

export const contentService = {
  // Image Upload Helper
  async uploadImage(file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `content/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return publicUrl;
  },

  // Rooms CRUD
  async fetchRooms() {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async createRoom(room) {
    const { data, error } = await supabase
      .from("rooms")
      .insert(room)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async updateRoom(name, room) {
    const { data, error } = await supabase
      .from("rooms")
      .update(room)
      .eq("name", name)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteRoom(name) {
    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("name", name);
    if (error) throw error;
    return name;
  },

  // Collections CRUD
  async fetchCollections() {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async createCollection(collection) {
    const { data, error } = await supabase
      .from("collections")
      .insert(collection)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async updateCollection(name, collection) {
    const { data, error } = await supabase
      .from("collections")
      .update(collection)
      .eq("name", name)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteCollection(name) {
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("name", name);
    if (error) throw error;
    return name;
  },

  // Designers CRUD
  async fetchDesigners() {
    const { data, error } = await supabase
      .from("designers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async createDesigner(designer) {
    const { data, error } = await supabase
      .from("designers")
      .insert(designer)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async updateDesigner(name, designer) {
    const { data, error } = await supabase
      .from("designers")
      .update(designer)
      .eq("name", name)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteDesigner(name) {
    const { error } = await supabase
      .from("designers")
      .delete()
      .eq("name", name);
    if (error) throw error;
    return name;
  },

  // Brands CRUD
  async fetchBrands() {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async createBrand(brand) {
    const { data, error } = await supabase
      .from("brands")
      .insert(brand)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async updateBrand(name, brand) {
    const { data, error } = await supabase
      .from("brands")
      .update(brand)
      .eq("name", name)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteBrand(name) {
    const { error } = await supabase
      .from("brands")
      .delete()
      .eq("name", name);
    if (error) throw error;
    return name;
  },

  // Blog Posts CRUD
  async fetchPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async createPost(post) {
    const { data, error } = await supabase
      .from("posts")
      .insert(post)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async updatePost(id, post) {
    const { data, error } = await supabase
      .from("posts")
      .update(post)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deletePost(id) {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return id;
  },

  // FAQs CRUD
  async fetchFaqs() {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async createFaq(faq) {
    const { data, error } = await supabase
      .from("faqs")
      .insert(faq)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async updateFaq(id, faq) {
    const { data, error } = await supabase
      .from("faqs")
      .update(faq)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteFaq(id) {
    const { error } = await supabase
      .from("faqs")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return id;
  },

  // Contact Enquiries CRUD
  async fetchEnquiries() {
    const { data, error } = await supabase
      .from("contact_enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async deleteEnquiry(id) {
    const { error } = await supabase
      .from("contact_enquiries")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return id;
  }
};

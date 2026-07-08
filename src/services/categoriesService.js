import { supabase } from "../supabaseClient";

export const categoriesService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(category) {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, category) {
    const { data, error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return id;
  }
};

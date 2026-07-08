import { supabase } from "../supabaseClient";

export const reviewsService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((r) => ({
      ...r,
      rating: Number(r.rating)
    }));
  },

  async create(review) {
    const { data, error } = await supabase
      .from("reviews")
      .insert(review)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, review) {
    const { data, error } = await supabase
      .from("reviews")
      .update(review)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return id;
  }
};

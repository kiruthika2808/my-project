import { supabase } from "../supabaseClient";

export const ordersService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((o) => ({
      ...o,
      amount: Number(o.amount)
    }));
  },

  async create(order) {
    const { data, error } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, order) {
    const { data, error } = await supabase
      .from("orders")
      .update(order)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return id;
  }
};

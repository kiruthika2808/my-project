import { supabase } from "../supabaseClient";

export const productsService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((p) => ({
      ...p,
      price: Number(p.price),
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      rating: Number(p.rating),
      reviews: Number(p.reviews),
      stock: Number(p.stock)
    }));
  },

  async create(product) {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, product) {
    const { data, error } = await supabase
      .from("products")
      .update(product)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return id;
  },

  async uploadImage(file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return publicUrl;
  }
};

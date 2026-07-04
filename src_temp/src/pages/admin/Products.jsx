import { useState } from "react";
import Card from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import Pagination from "../../components/admin/Pagination";
import { useAdmin } from "../../context/AdminContext";
import { useFilteredList } from "../../hooks/useFilteredList";
import { formatCurrency } from "../../utils/format";
import { supabase } from "../../supabaseClient";

const blankProduct = {
  name: "",
  brand: "Spacesic Atelier",
  category: "Seating",
  room: "Living Room",
  price: 0,
  stock: 0,
  description: "",
  images: [],
};

export default function Products() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const filtered = useFilteredList(products, query, ["name", "brand", "category"], category, "category");
  const form = editing || blankProduct;

  const setField = (key, value) => setEditing({ ...form, [key]: value });

  const handleFiles = async (files) => {
    setUploading(true);
    const uploadedUrls = [];
    
    try {
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setField("images", [...(form.images || []), ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      alert(`Failed to upload images: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const saveProduct = (event) => {
    event.preventDefault();
    const mainImage = form.images?.[0] || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1100&q=85";
    const productData = {
      ...form,
      image: mainImage,
      images: form.images || [mainImage]
    };
    if (form.id) updateProduct(productData);
    else addProduct(productData);
    setEditing(null);
  };

  return (
    <>
      <PageHeader eyebrow="Catalog" title="Products management" description="Add, edit, delete, search, filter, and manage inventory for Spacesic products." action={<button className="admin-btn-primary" onClick={() => setEditing(blankProduct)}>Add product</button>} />
      {editing && (
        <Card className="mb-6">
          <form className="grid gap-4 lg:grid-cols-2" onSubmit={saveProduct}>
            <input className="admin-input" placeholder="Product name" value={form.name} onChange={(event) => setField("name", event.target.value)} required />
            <input className="admin-input" placeholder="Brand" value={form.brand} onChange={(event) => setField("brand", event.target.value)} />
            <select className="admin-input" value={form.category} onChange={(event) => setField("category", event.target.value)}>
              {categories.map((item) => <option key={item.id}>{item.name}</option>)}
            </select>
            <input className="admin-input" placeholder="Room" value={form.room} onChange={(event) => setField("room", event.target.value)} />
            <input className="admin-input" type="number" placeholder="Price" value={form.price} onChange={(event) => setField("price", Number(event.target.value))} />
            <input className="admin-input" type="number" placeholder="Stock" value={form.stock} onChange={(event) => setField("stock", Number(event.target.value))} />
            <textarea className="admin-input min-h-28 lg:col-span-2" placeholder="Description" value={form.description} onChange={(event) => setField("description", event.target.value)} />
            <label className="admin-input cursor-pointer lg:col-span-2 flex items-center justify-between">
              <span>{uploading ? "Uploading images to Supabase..." : "Upload multiple images"}</span>
              <input className="hidden" type="file" multiple accept="image/*" disabled={uploading} onChange={(event) => handleFiles(event.target.files)} />
            </label>
            {form.images?.length > 0 && <div className="flex flex-wrap gap-3 lg:col-span-2">{form.images.map((image) => <img key={image} className="h-20 w-20 rounded-xl object-cover" src={image} alt="" />)}</div>}
            <div className="flex gap-3 lg:col-span-2">
              <button className="admin-btn-primary">Save product</button>
              <button type="button" className="admin-btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        </Card>
      )}
      <Card className="mb-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <input className="admin-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, brands, categories" />
          <select className="admin-input" value={category} onChange={(event) => setCategory(event.target.value)}>
            {["All", ...categories.map((item) => item.name)].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <DataTable
          rows={filtered}
          columns={[
            { key: "name", label: "Product", render: (row) => <div className="flex items-center gap-3"><img className="h-12 w-12 rounded-xl object-cover" src={row.image || row.images?.[0]} alt={row.name} /><div><p className="font-bold">{row.name}</p><p className="text-xs text-stone-500">{row.brand}</p></div></div> },
            { key: "category", label: "Category" },
            { key: "stock", label: "Stock", render: (row) => <span className={row.stock < 25 ? "text-amber-600 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"}>{row.stock < 25 ? "Low stock" : `${row.stock} units`}</span> },
            { key: "price", label: "Price", render: (row) => formatCurrency(row.price) },
            { key: "actions", label: "Actions", render: (row) => <div className="flex gap-2"><button className="table-action" onClick={() => setEditing(row)}>Edit</button><button className="table-action-danger" onClick={() => deleteProduct(row.id)}>Delete</button></div> },
          ]}
        />
        <Pagination total={filtered.length} />
      </Card>
    </>
  );
}

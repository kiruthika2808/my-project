import { useState } from "react";
import Card from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useAdmin } from "../../context/AdminContext";
import { productsService } from "../../services/productsService";
import { formatCurrency } from "../../utils/format";

const blankProduct = {
  name: "",
  brand: "Spacesic Atelier",
  category: "Seating",
  room: "Living Room",
  price: 0,
  stock: 0,
  description: "",
  images: [],
  badge: "New",
};

export default function Products() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [badge, setBadge] = useState("All");
  
  // Form and Modal states
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Pagination states
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Delete Confirmation States
  const [deletingId, setDeletingId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const form = editing || blankProduct;
  const setField = (key, value) => setEditing({ ...form, [key]: value });

  // Upload images via productsService
  const handleFiles = async (files) => {
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await productsService.uploadImage(file);
        uploadedUrls.push(url);
      }
      setField("images", [...(form.images || []), ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      alert(`Failed to upload images: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    const mainImage = form.images?.[0] || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1100&q=85";
    const productData = {
      ...form,
      image: mainImage,
      images: form.images || [mainImage]
    };
    
    try {
      if (form.id) {
        await updateProduct(form.id, productData);
      } else {
        // Generate a slug-like id
        const id = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
        await addProduct({ ...productData, id });
      }
      setEditing(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const triggerDelete = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteProduct(deletingId);
      setDeletingId(null);
    }
  };

  // Extract unique brands and badges for filters
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
  const uniqueBadges = Array.from(new Set(products.map((p) => p.badge).filter(Boolean)));

  // Instant filtering
  const getFiltered = () => {
    let filtered = products;
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }
    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }
    if (badge !== "All") {
      filtered = filtered.filter((p) => p.badge === badge);
    }
    return filtered;
  };

  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Products management"
        description="Add, edit, delete, search, filter, and manage inventory for Spacesic products."
        action={
          <button className="admin-btn-primary animate-pulse" onClick={() => setEditing(blankProduct)}>
            Add product
          </button>
        }
      />

      {editing && (
        <Card className="mb-6 animate-in slide-in-from-top-4 duration-200">
          <form className="grid gap-4 lg:grid-cols-2" onSubmit={saveProduct}>
            <input
              className="admin-input"
              placeholder="Product name"
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              required
            />
            <input
              className="admin-input"
              placeholder="Brand"
              value={form.brand}
              onChange={(event) => setField("brand", event.target.value)}
            />
            <select
              className="admin-input"
              value={form.category}
              onChange={(event) => setField("category", event.target.value)}
            >
              {categories.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              className="admin-input"
              placeholder="Room"
              value={form.room}
              onChange={(event) => setField("room", event.target.value)}
            />
            <input
              className="admin-input"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(event) => setField("price", Number(event.target.value))}
              required
            />
            <input
              className="admin-input"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(event) => setField("stock", Number(event.target.value))}
              required
            />
            <input
              className="admin-input lg:col-span-2"
              placeholder="Badge (e.g. Best seller, New, 20% off)"
              value={form.badge || ""}
              onChange={(event) => setField("badge", event.target.value)}
            />
            <textarea
              className="admin-input min-h-28 lg:col-span-2"
              placeholder="Description"
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
            />
            <label className="admin-input cursor-pointer lg:col-span-2 flex items-center justify-between">
              <span>{uploading ? "Uploading images to Supabase..." : "Upload multiple images"}</span>
              <input
                className="hidden"
                type="file"
                multiple
                accept="image/*"
                disabled={uploading}
                onChange={(event) => handleFiles(event.target.files)}
              />
            </label>
            {form.images?.length > 0 && (
              <div className="flex flex-wrap gap-3 lg:col-span-2 border border-stone-200 p-3 rounded-xl dark:border-white/10">
                {form.images.map((image, idx) => (
                  <div key={idx} className="relative group">
                    <img className="h-20 w-20 rounded-xl object-cover shadow-sm" src={image} alt="" />
                    <button
                      type="button"
                      onClick={() => setField("images", form.images.filter((img) => img !== image))}
                      className="absolute -right-2 -top-2 bg-red-600 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center font-bold hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3 lg:col-span-2 mt-2">
              <button className="admin-btn-primary" disabled={uploading}>
                Save product
              </button>
              <button type="button" className="admin-btn-secondary" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter and search panel */}
      <Card className="mb-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className="admin-input sm:col-span-2 lg:col-span-1"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products, brands, categories"
          />
          <select
            className="admin-input"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            className="admin-input"
            value={brand}
            onChange={(event) => {
              setBrand(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Brands</option>
            {uniqueBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            className="admin-input"
            value={badge}
            onChange={(event) => {
              setBadge(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Badges</option>
            {uniqueBadges.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          <select
            className="admin-input"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <DataTable
          rows={paginated}
          columns={[
            {
              key: "name",
              label: "Product",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <img
                    className="h-12 w-12 rounded-xl object-cover shadow-xs"
                    src={row.image || row.images?.[0] || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=100&q=85"}
                    alt={row.name}
                  />
                  <div>
                    <p className="font-bold">{row.name}</p>
                    <p className="text-xs text-stone-500">{row.brand}</p>
                  </div>
                </div>
              ),
            },
            { key: "category", label: "Category" },
            {
              key: "stock",
              label: "Stock",
              render: (row) => (
                <span
                  className={row.stock < 25 ? "text-amber-600 dark:text-amber-300 font-semibold" : "text-emerald-700 dark:text-emerald-300"}
                >
                  {row.stock < 25 ? `Low stock (${row.stock})` : `${row.stock} units`}
                </span>
              ),
            },
            { key: "price", label: "Price", render: (row) => formatCurrency(row.price) },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex gap-2">
                  <button className="table-action" onClick={() => setEditing(row)}>
                    Edit
                  </button>
                  <button className="table-action-danger" onClick={() => triggerDelete(row.id)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
        />

        {/* Functional Pagination Component */}
        <div className="flex flex-col gap-3 border-t border-stone-200 p-4 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-stone-500 dark:text-stone-400">
            Showing page {currentPage} of {totalPages} ({filtered.length} products total)
          </p>
          <div className="flex gap-2">
            <button
              className="table-action"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="admin-btn-primary px-4 py-2 pointer-events-none rounded-xl">
              {currentPage}
            </span>
            <button
              className="table-action"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action will permanently remove it from Supabase storefront."
      />
    </>
  );
}

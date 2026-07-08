import { useState } from "react";
import Card from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useAdmin } from "../../context/AdminContext";
import { contentService } from "../../services/contentService";

export default function Content() {
  const {
    rooms,
    collections,
    designers,
    brands,
    posts,
    faqs,
    enquiries,
    addRoom,
    updateRoom,
    deleteRoom,
    addCollection,
    updateCollection,
    deleteCollection,
    addDesigner,
    updateDesigner,
    deleteDesigner,
    addBrand,
    updateBrand,
    deleteBrand,
    addPost,
    updatePost,
    deletePost,
    addFaq,
    updateFaq,
    deleteFaq,
    deleteEnquiry,
  } = useAdmin();

  // Tabs management
  const tabs = [
    { id: "rooms", name: "Rooms" },
    { id: "collections", name: "Collections" },
    { id: "designers", name: "Designers" },
    { id: "brands", name: "Brands" },
    { id: "posts", name: "Blog Posts" },
    { id: "faqs", name: "FAQs" },
    { id: "enquiries", name: "Contact Enquiries" },
  ];
  const [activeTab, setActiveTab] = useState("rooms");

  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Edit / Form / Modal States
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Delete Confirmation States
  const [deletingId, setDeletingId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Forms initial structures
  const initialFormStates = {
    rooms: { name: "", count: "0 pieces", image: "" },
    collections: { name: "", text: "", image: "" },
    designers: { name: "", text: "", city: "", image: "" },
    brands: { name: "", description: "" },
    posts: { title: "", text: "" },
    faqs: { question: "", answer: "" },
  };

  const [formData, setFormData] = useState(initialFormStates.rooms);

  // Reset pagination on tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery("");
    setCurrentPage(1);
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData(initialFormStates[tabId] || {});
  };

  // Helper to handle image uploads for Content
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await contentService.uploadImage(file);
      setFormData((prev) => ({ ...prev, image: publicUrl }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Filter and paginate data based on search and tab
  const getFilteredData = () => {
    let list = [];
    let searchFields = [];

    switch (activeTab) {
      case "rooms":
        list = rooms;
        searchFields = ["name", "count"];
        break;
      case "collections":
        list = collections;
        searchFields = ["name", "text"];
        break;
      case "designers":
        list = designers;
        searchFields = ["name", "text", "city"];
        break;
      case "brands":
        list = brands;
        searchFields = ["name", "description"];
        break;
      case "posts":
        list = posts;
        searchFields = ["title", "text"];
        break;
      case "faqs":
        list = faqs;
        searchFields = ["question", "answer"];
        break;
      case "enquiries":
        list = enquiries;
        searchFields = ["name", "email", "project_type", "message"];
        break;
      default:
        break;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) =>
        searchFields.some((field) => String(item[field] || "").toLowerCase().includes(q))
      );
    }

    return list;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "rooms") {
        if (editingItem) {
          await updateRoom(editingItem.name, formData);
        } else {
          await addRoom(formData);
        }
      } else if (activeTab === "collections") {
        if (editingItem) {
          await updateCollection(editingItem.name, formData);
        } else {
          await addCollection(formData);
        }
      } else if (activeTab === "designers") {
        if (editingItem) {
          await updateDesigner(editingItem.name, formData);
        } else {
          await addDesigner(formData);
        }
      } else if (activeTab === "brands") {
        if (editingItem) {
          await updateBrand(editingItem.name, formData);
        } else {
          await addBrand(formData);
        }
      } else if (activeTab === "posts") {
        if (editingItem) {
          await updatePost(editingItem.id, formData);
        } else {
          await addPost(formData);
        }
      } else if (activeTab === "faqs") {
        if (editingItem) {
          await updateFaq(editingItem.id, formData);
        } else {
          await addFaq(formData);
        }
      }

      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save content item:", error);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const startCreate = () => {
    setEditingItem(null);
    setFormData(initialFormStates[activeTab]);
    setIsFormOpen(true);
  };

  const startDelete = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      if (activeTab === "rooms") await deleteRoom(deletingId);
      else if (activeTab === "collections") await deleteCollection(deletingId);
      else if (activeTab === "designers") await deleteDesigner(deletingId);
      else if (activeTab === "brands") await deleteBrand(deletingId);
      else if (activeTab === "posts") await deletePost(deletingId);
      else if (activeTab === "faqs") await deleteFaq(deletingId);
      else if (activeTab === "enquiries") await deleteEnquiry(deletingId);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // DataTable column definitions based on active tab
  const getColumns = () => {
    switch (activeTab) {
      case "rooms":
        return [
          {
            key: "name",
            label: "Room Name",
            render: (row) => (
              <div className="flex items-center gap-3">
                <img
                  className="h-10 w-10 rounded-xl object-cover"
                  src={row.image || "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=100&q=85"}
                  alt={row.name}
                />
                <span className="font-bold">{row.name}</span>
              </div>
            ),
          },
          { key: "count", label: "Inventory Count" },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button className="table-action" onClick={() => startEdit(row)}>
                  Edit
                </button>
                <button className="table-action-danger" onClick={() => startDelete(row.name)}>
                  Delete
                </button>
              </div>
            ),
          },
        ];
      case "collections":
        return [
          {
            key: "name",
            label: "Collection",
            render: (row) => (
              <div className="flex items-center gap-3">
                <img
                  className="h-10 w-10 rounded-xl object-cover"
                  src={row.image || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=100&q=85"}
                  alt={row.name}
                />
                <span className="font-bold">{row.name}</span>
              </div>
            ),
          },
          { key: "text", label: "Description" },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button className="table-action" onClick={() => startEdit(row)}>
                  Edit
                </button>
                <button className="table-action-danger" onClick={() => startDelete(row.name)}>
                  Delete
                </button>
              </div>
            ),
          },
        ];
      case "designers":
        return [
          {
            key: "name",
            label: "Designer",
            render: (row) => (
              <div className="flex items-center gap-3">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={row.image || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=85"}
                  alt={row.name}
                />
                <div>
                  <p className="font-bold">{row.name}</p>
                  <p className="text-xs text-stone-500">{row.city}</p>
                </div>
              </div>
            ),
          },
          { key: "text", label: "Biography" },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button className="table-action" onClick={() => startEdit(row)}>
                  Edit
                </button>
                <button className="table-action-danger" onClick={() => startDelete(row.name)}>
                  Delete
                </button>
              </div>
            ),
          },
        ];
      case "brands":
        return [
          { key: "name", label: "Brand Name", render: (row) => <span className="font-bold">{row.name}</span> },
          { key: "description", label: "Description" },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button className="table-action" onClick={() => startEdit(row)}>
                  Edit
                </button>
                <button className="table-action-danger" onClick={() => startDelete(row.name)}>
                  Delete
                </button>
              </div>
            ),
          },
        ];
      case "posts":
        return [
          { key: "title", label: "Blog Title", render: (row) => <span className="font-bold">{row.title}</span> },
          { key: "text", label: "Content Summary", render: (row) => <p className="line-clamp-2 max-w-md text-stone-500">{row.text}</p> },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button className="table-action" onClick={() => startEdit(row)}>
                  Edit
                </button>
                <button className="table-action-danger" onClick={() => startDelete(row.id)}>
                  Delete
                </button>
              </div>
            ),
          },
        ];
      case "faqs":
        return [
          { key: "question", label: "Question", render: (row) => <span className="font-bold">{row.question}</span> },
          { key: "answer", label: "Answer", render: (row) => <p className="max-w-md text-stone-500">{row.answer}</p> },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button className="table-action" onClick={() => startEdit(row)}>
                  Edit
                </button>
                <button className="table-action-danger" onClick={() => startDelete(row.id)}>
                  Delete
                </button>
              </div>
            ),
          },
        ];
      case "enquiries":
        return [
          {
            key: "name",
            label: "From",
            render: (row) => (
              <div>
                <p className="font-bold">{row.name}</p>
                <p className="text-xs text-stone-500">{row.email}</p>
              </div>
            ),
          },
          { key: "project_type", label: "Project/Subject" },
          { key: "message", label: "Enquiry Message", render: (row) => <p className="max-w-md leading-relaxed">{row.message}</p> },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button className="table-action-danger" onClick={() => startDelete(row.id)}>
                  Archive/Delete
                </button>
              </div>
            ),
          },
        ];
      default:
        return [];
    }
  };

  // Convert keys so that row.id is present for each item to satisfy DataTable mapping key
  const getMappedRows = () => {
    return paginatedData.map((row, idx) => ({
      ...row,
      id: row.id || row.name || `item-${idx}`,
    }));
  };

  return (
    <>
      <PageHeader
        eyebrow="CMS"
        title="Storefront Content"
        description="Manage landing page settings, room links, FAQ documentation, designer cards, and client enquiries."
      />

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-stone-200 dark:border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === tab.id
                ? "bg-[#1c1917] text-white dark:bg-white dark:text-stone-950"
                : "bg-white text-stone-500 border border-stone-200 hover:bg-stone-50 hover:text-stone-950 dark:bg-stone-900 dark:border-white/10 dark:text-stone-400 dark:hover:bg-stone-850 dark:hover:text-white"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Form Drawer / Box */}
      {isFormOpen && (
        <Card className="mb-6 animate-in slide-in-from-top-4 duration-200">
          <PageHeader
            eyebrow={editingItem ? "Update" : "Create"}
            title={editingItem ? `Edit ${editingItem.name || editingItem.title || "Record"}` : `Add New ${activeTab.slice(0, -1)}`}
          />
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {activeTab === "rooms" && (
              <>
                <input
                  className="admin-input"
                  placeholder="Room Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={!!editingItem}
                />
                <input
                  className="admin-input"
                  placeholder="Inventory Count (e.g. 42 pieces)"
                  value={formData.count}
                  onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                  required
                />
                <div className="sm:col-span-2">
                  <label className="admin-input cursor-pointer flex items-center justify-between">
                    <span>{uploading ? "Uploading banner image..." : "Upload Room Image"}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {formData.image && (
                    <img className="mt-3 h-32 w-52 rounded-xl object-cover shadow-md" src={formData.image} alt="Preview" />
                  )}
                </div>
              </>
            )}

            {activeTab === "collections" && (
              <>
                <input
                  className="admin-input"
                  placeholder="Collection Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={!!editingItem}
                />
                <input
                  className="admin-input"
                  placeholder="Description / Text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                />
                <div className="sm:col-span-2">
                  <label className="admin-input cursor-pointer flex items-center justify-between">
                    <span>{uploading ? "Uploading banner image..." : "Upload Banner Image"}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {formData.image && (
                    <img className="mt-3 h-32 w-72 rounded-xl object-cover shadow-md" src={formData.image} alt="Preview" />
                  )}
                </div>
              </>
            )}

            {activeTab === "designers" && (
              <>
                <input
                  className="admin-input"
                  placeholder="Designer Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={!!editingItem}
                />
                <input
                  className="admin-input"
                  placeholder="Role / City Location"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
                <textarea
                  className="admin-input min-h-24 sm:col-span-2"
                  placeholder="Biography / Story"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                />
                <div className="sm:col-span-2">
                  <label className="admin-input cursor-pointer flex items-center justify-between">
                    <span>{uploading ? "Uploading designer photo..." : "Upload Photo"}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {formData.image && (
                    <img className="mt-3 h-24 w-24 rounded-full object-cover shadow-md border-2 border-stone-200" src={formData.image} alt="Preview" />
                  )}
                </div>
              </>
            )}

            {activeTab === "brands" && (
              <>
                <input
                  className="admin-input"
                  placeholder="Brand Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={!!editingItem}
                />
                <input
                  className="admin-input"
                  placeholder="Brand Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </>
            )}

            {activeTab === "posts" && (
              <>
                <input
                  className="admin-input sm:col-span-2"
                  placeholder="Blog Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <textarea
                  className="admin-input min-h-36 sm:col-span-2"
                  placeholder="Post content..."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                />
              </>
            )}

            {activeTab === "faqs" && (
              <>
                <input
                  className="admin-input sm:col-span-2"
                  placeholder="FAQ Question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                />
                <textarea
                  className="admin-input min-h-24 sm:col-span-2"
                  placeholder="FAQ Answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                />
              </>
            )}

            <div className="flex gap-3 sm:col-span-2 mt-2">
              <button className="admin-btn-primary px-6" disabled={uploading}>
                Save Changes
              </button>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingItem(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* List Controller */}
      <Card className="mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-lg">
            <input
              className="admin-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={`Search ${tabs.find((t) => t.id === activeTab)?.name || "records"}...`}
            />
          </div>
          <div className="flex items-center gap-3">
            {activeTab !== "enquiries" && (
              <button className="admin-btn-primary" onClick={startCreate}>
                Add {tabs.find((t) => t.id === activeTab)?.name.slice(0, -1) || "Record"}
              </button>
            )}
            <select
              className="admin-input max-w-36 py-2"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>
          </div>
        </div>
      </Card>

      {/* DataTable */}
      <Card className="overflow-hidden p-0">
        <DataTable
          columns={getColumns()}
          rows={getMappedRows()}
          empty={`No ${tabs.find((t) => t.id === activeTab)?.name.toLowerCase() || "records"} found.`}
        />

        {/* Functional Pagination */}
        <div className="flex flex-col gap-3 border-t border-stone-200 p-4 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-stone-500 dark:text-stone-400">
            Showing page {currentPage} of {totalPages} ({filteredData.length} records total)
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

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${activeTab.slice(0, -1)}`}
        message={`Are you sure you want to delete this ${activeTab.slice(0, -1)}? This action will permanently remove it from Supabase.`}
      />
    </>
  );
}

import { useState } from "react";
import Card from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import { useAdmin } from "../../context/AdminContext";

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [form, setForm] = useState({ name: "", enabled: true });

  const saveCategory = (event) => {
    event.preventDefault();
    if (form.id) updateCategory(form);
    else addCategory(form);
    setForm({ name: "", enabled: true });
  };

  return (
    <>
      <PageHeader eyebrow="Catalog" title="Categories" description="Create, edit, delete, and enable or disable storefront categories." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <PageHeader eyebrow={form.id ? "Edit" : "Create"} title={form.id ? "Edit category" : "New category"} />
          <form className="grid gap-4" onSubmit={saveCategory}>
            <input className="admin-input" placeholder="Category name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={form.enabled} onChange={(event) => setForm({ ...form, enabled: event.target.checked })} /> Enable category</label>
            <button className="admin-btn-primary">{form.id ? "Update category" : "Create category"}</button>
          </form>
        </Card>
        <Card className="overflow-hidden p-0">
          <DataTable
            rows={categories}
            columns={[
              { key: "name", label: "Category", render: (row) => <span className="font-bold">{row.name}</span> },
              { key: "productCount", label: "Products" },
              { key: "enabled", label: "Enabled", render: (row) => <label className="admin-switch"><input type="checkbox" checked={row.enabled} onChange={(event) => updateCategory({ ...row, enabled: event.target.checked })} /><span /></label> },
              { key: "actions", label: "Actions", render: (row) => <div className="flex gap-2"><button className="table-action" onClick={() => setForm(row)}>Edit</button><button className="table-action-danger" onClick={() => deleteCategory(row.id)}>Delete</button></div> },
            ]}
          />
        </Card>
      </div>
    </>
  );
}

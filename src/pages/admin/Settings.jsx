import { useState } from "react";
import Card from "../../components/admin/Card";
import PageHeader from "../../components/admin/PageHeader";
import { useAdmin } from "../../context/AdminContext";

export default function Settings() {
  const { settings, updateSettings, darkMode, toggleTheme } = useAdmin();
  const [form, setForm] = useState(settings);
  const [password, setPassword] = useState({ current: "", next: "" });

  const saveSettings = (event) => {
    event.preventDefault();
    updateSettings(form);
  };

  const savePassword = (event) => {
    event.preventDefault();
    updateSettings({ adminName: form.adminName });
    setPassword({ current: "", next: "" });
  };

  return (
    <>
      <PageHeader eyebrow="Configuration" title="Settings" description="Manage store information, password, theme, payment, and shipping settings." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <PageHeader eyebrow="Store" title="Store information" />
          <form className="grid gap-3" onSubmit={saveSettings}>
            <input className="admin-input" value={form.storeName} onChange={(event) => setForm({ ...form, storeName: event.target.value })} placeholder="Store name" />
            <input className="admin-input" value={form.supportEmail} onChange={(event) => setForm({ ...form, supportEmail: event.target.value })} placeholder="Support email" />
            <input className="admin-input" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })} placeholder="Currency" />
            <button className="admin-btn-primary">Save store info</button>
          </form>
        </Card>
        <Card>
          <PageHeader eyebrow="Security" title="Admin profile and password" />
          <form className="grid gap-3" onSubmit={savePassword}>
            <input className="admin-input" value={form.adminName} onChange={(event) => setForm({ ...form, adminName: event.target.value })} placeholder="Admin name" />
            <input className="admin-input" type="password" value={password.current} onChange={(event) => setPassword({ ...password, current: event.target.value })} placeholder="Current password" />
            <input className="admin-input" type="password" value={password.next} onChange={(event) => setPassword({ ...password, next: event.target.value })} placeholder="New password" />
            <button className="admin-btn-primary">Update profile</button>
          </form>
        </Card>
        <Card>
          <PageHeader eyebrow="Theme" title="Theme settings" />
          <div className="flex items-center justify-between rounded-xl border border-stone-200 p-4 dark:border-white/10">
            <div><p className="font-bold">Dark mode</p><p className="text-sm text-stone-500 dark:text-stone-400">Switch the admin workspace theme.</p></div>
            <label className="admin-switch"><input type="checkbox" checked={darkMode} onChange={toggleTheme} /><span /></label>
          </div>
        </Card>
        <Card>
          <PageHeader eyebrow="Commerce" title="Payment and shipping" />
          <form className="grid gap-3" onSubmit={saveSettings}>
            <input className="admin-input" value={form.paymentProvider} onChange={(event) => setForm({ ...form, paymentProvider: event.target.value })} placeholder="Payment provider" />
            <input className="admin-input" value={form.shippingZone} onChange={(event) => setForm({ ...form, shippingZone: event.target.value })} placeholder="Shipping zone" />
            <button className="admin-btn-primary">Save commerce settings</button>
          </form>
        </Card>
      </div>
    </>
  );
}

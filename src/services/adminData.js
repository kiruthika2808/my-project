import { products as storefrontProducts } from "../data";

export const orderStatuses = ["Pending", "Processing", "Shipped", "Delivered"];

export const revenueSeries = [
  { month: "Jan", revenue: 18000, sales: 128 },
  { month: "Feb", revenue: 24000, sales: 146 },
  { month: "Mar", revenue: 21000, sales: 139 },
  { month: "Apr", revenue: 32000, sales: 178 },
  { month: "May", revenue: 38000, sales: 196 },
  { month: "Jun", revenue: 45000, sales: 221 },
  { month: "Jul", revenue: 42000, sales: 210 },
  { month: "Aug", revenue: 56000, sales: 248 },
  { month: "Sep", revenue: 61000, sales: 271 },
  { month: "Oct", revenue: 58000, sales: 266 },
  { month: "Nov", revenue: 69000, sales: 306 },
  { month: "Dec", revenue: 78000, sales: 340 },
];

export const initialProducts = storefrontProducts.map((product, index) => ({
  ...product,
  stock: 18 + index * 7,
  images: [product.image],
  description: product.description,
}));

export const initialCategories = [
  { id: "seating", name: "Seating", enabled: true, productCount: 42 },
  { id: "tables", name: "Tables", enabled: true, productCount: 35 },
  { id: "lighting", name: "Lighting", enabled: true, productCount: 28 },
  { id: "decor", name: "Decor", enabled: false, productCount: 57 },
  { id: "textiles", name: "Textiles", enabled: true, productCount: 31 },
];

export const initialOrders = [
  {
    id: "SPC-1048",
    customerId: "anaya-kapoor",
    customer: "Anaya Kapoor",
    email: "anaya@example.com",
    phone: "+1 212 555 0131",
    amount: 2960,
    status: "Processing",
    date: "Jun 24, 2026",
    items: ["Aster Boucle Lounge Chair", "Ciel Ceramic Vase Set"],
  },
  {
    id: "SPC-1047",
    customerId: "marcus-reed",
    customer: "Marcus Reed",
    email: "marcus@example.com",
    phone: "+1 646 555 0188",
    amount: 620,
    status: "Shipped",
    date: "Jun 23, 2026",
    items: ["Lumi Arc Floor Lamp"],
  },
  {
    id: "SPC-1046",
    customerId: "nina-shah",
    customer: "Nina Shah",
    email: "nina@example.com",
    phone: "+1 917 555 0155",
    amount: 4250,
    status: "Pending",
    date: "Jun 22, 2026",
    items: ["Solene Travertine Dining Table", "Serra Walnut Sideboard"],
  },
  {
    id: "SPC-1045",
    customerId: "clara-wen",
    customer: "Clara Wen",
    email: "clara@example.com",
    phone: "+1 718 555 0164",
    amount: 1890,
    status: "Delivered",
    date: "Jun 21, 2026",
    items: ["Marlow Linen Platform Bed"],
  },
];

export const initialCustomers = [
  { id: "anaya-kapoor", name: "Anaya Kapoor", email: "anaya@example.com", phone: "+1 212 555 0131", location: "New York, NY" },
  { id: "marcus-reed", name: "Marcus Reed", email: "marcus@example.com", phone: "+1 646 555 0188", location: "Brooklyn, NY" },
  { id: "nina-shah", name: "Nina Shah", email: "nina@example.com", phone: "+1 917 555 0155", location: "Jersey City, NJ" },
  { id: "clara-wen", name: "Clara Wen", email: "clara@example.com", phone: "+1 718 555 0164", location: "Queens, NY" },
];

export const initialReviews = [
  { id: "rev-1", customer: "Anaya Kapoor", product: "Aster Boucle Lounge Chair", rating: 5, status: "Approved", text: "Beautiful finish and careful white-glove delivery." },
  { id: "rev-2", customer: "Theo Vale", product: "Solene Travertine Dining Table", rating: 4, status: "Pending", text: "Great proportions. Waiting on one extra detail photo." },
  { id: "rev-3", customer: "Nina Shah", product: "Lumi Arc Floor Lamp", rating: 5, status: "Approved", text: "Elegant and sturdy for our boutique suites." },
];

export const initialSettings = {
  storeName: "Spacesic Home",
  supportEmail: "hello@spacesichome.com",
  currency: "USD",
  paymentProvider: "Stripe",
  shippingZone: "United States",
  adminName: "Spacesic Admin",
};

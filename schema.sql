DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS designers CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS contact_enquiries CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS customers (
    id text PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    location text,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS customers_email_idx ON customers (email);

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS categories (
    id text PRIMARY KEY,
    name text NOT NULL,
    enabled boolean DEFAULT true,
    "productCount" integer DEFAULT 0,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS products (
    id text PRIMARY KEY,
    name text NOT NULL,
    brand text,
    designer text,
    collection text,
    category text,
    price numeric NOT NULL CHECK (price >= 0),
    "oldPrice" numeric CHECK ("oldPrice" >= 0),
    rating numeric DEFAULT 4.8,
    reviews integer DEFAULT 0,
    badge text,
    image text,
    images text[] DEFAULT '{}',
    description text,
    stock integer DEFAULT 0 CHECK (stock >= 0),
    room text,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_room_idx ON products (room);
CREATE INDEX IF NOT EXISTS products_brand_idx ON products (brand);

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS orders (
    id text PRIMARY KEY,
    "customerId" text REFERENCES customers(id) ON DELETE SET NULL,
    customer text NOT NULL,
    email text NOT NULL,
    phone text,
    amount numeric NOT NULL CHECK (amount >= 0),
    status text NOT NULL DEFAULT 'Pending',
    date text NOT NULL,
    items text[] DEFAULT '{}',
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_customerId_idx ON orders ("customerId");
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS reviews (
    id text PRIMARY KEY,
    customer text NOT NULL,
    product text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    status text NOT NULL DEFAULT 'Pending',
    text text NOT NULL,
    role text,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews (status);
CREATE INDEX IF NOT EXISTS reviews_product_idx ON reviews (product);

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS settings (
    id integer PRIMARY KEY DEFAULT 1,
    "storeName" text DEFAULT 'Spacesic Home',
    "supportEmail" text DEFAULT 'hello@spacesichome.com',
    currency text DEFAULT 'USD',
    "paymentProvider" text DEFAULT 'Stripe',
    "shippingZone" text DEFAULT 'United States',
    "adminName" text DEFAULT 'Spacesic Admin',
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW(),
    CONSTRAINT one_row CHECK (id = 1)
);

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS rooms (
    name text PRIMARY KEY,
    count text NOT NULL,
    image text NOT NULL,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS collections (
    name text PRIMARY KEY,
    text text,
    image text NOT NULL,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_collections_updated_at ON collections;
CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS designers (
    name text PRIMARY KEY,
    text text,
    city text,
    image text NOT NULL,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_designers_updated_at ON designers;
CREATE TRIGGER update_designers_updated_at
    BEFORE UPDATE ON designers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS posts (
    id serial PRIMARY KEY,
    title text NOT NULL,
    text text NOT NULL,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS faqs (
    id serial PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS brands (
    name text PRIMARY KEY,
    description text DEFAULT 'Signature finishes, thoughtful sourcing, and heirloom-minded silhouettes selected for layered interiors.',
    created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_enquiries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text NOT NULL,
    project_type text,
    message text NOT NULL,
    created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlists (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id text REFERENCES products(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id text REFERENCES products(id) ON DELETE CASCADE,
    qty integer NOT NULL CHECK (qty > 0),
    created_at timestamptz DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

INSERT INTO categories (id, name, enabled, "productCount") VALUES
('seating', 'Seating', true, 42),
('tables', 'Tables', true, 35),
('lighting', 'Lighting', true, 28),
('decor', 'Decor', false, 57),
('textiles', 'Textiles', true, 31)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, brand, designer, collection, category, price, "oldPrice", rating, reviews, badge, image, images, description, stock, room) VALUES
('aster-boucle-lounge-chair', 'Aster Boucle Lounge Chair', 'Spacesic Atelier', 'Mira Solen', 'Quiet Luxe', 'Seating', 1480, 1780, 4.9, 124, 'Best seller', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1100&q=85', '{"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1100&q=85"}', 'A sculptural lounge chair wrapped in tactile boucle with a kiln-dried frame and deep, relaxed proportions.', 18, 'Living Room'),
('solene-travertine-table', 'Solene Travertine Dining Table', 'Linea Forma', 'Theo Vale', 'Stone Garden', 'Tables', 2360, NULL, 4.8, 88, 'New arrival', 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1100&q=85', '{"https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1100&q=85"}', 'A warm travertine top meets a softened pedestal base for dining rooms that feel composed and grounded.', 25, 'Dining'),
('lumi-arc-floor-lamp', 'Lumi Arc Floor Lamp', 'Nord House', 'Alina Greve', 'Moonlit', 'Lighting', 620, 790, 4.7, 69, '20% off', 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1100&q=85', '{"https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1100&q=85"}', 'A sweeping brass floor lamp with a linen shade, designed to cast generous ambient light over seating areas.', 32, 'Lighting'),
('marlow-linen-platform-bed', 'Marlow Linen Platform Bed', 'Maison Ori', 'Clara Wen', 'Hotel Calm', 'Beds', 1890, NULL, 5.0, 101, 'Designer pick', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1100&q=85', '{"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1100&q=85"}', 'A low upholstered bed with tailored linen panels, quiet storage options, and a floating visual profile.', 39, 'Bedroom'),
('serra-walnut-sideboard', 'Serra Walnut Sideboard', 'Vestra Studio', 'Nolan Reyes', 'Archive Modern', 'Storage', 1720, NULL, 4.9, 57, 'Limited', 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=1100&q=85', '{"https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=1100&q=85"}', 'Fluted walnut doors, shadow-line handles, and a marble inset top make this sideboard quietly dramatic.', 46, 'Dining'),
('eden-handloom-rug', 'Eden Handloom Wool Rug', 'Tactile Loom', 'Sana Iyer', 'Soft Geometry', 'Textiles', 840, 990, 4.6, 43, 'Crafted', 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1100&q=85', '{"https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1100&q=85"}', 'A handloomed wool rug with tonal geometry, plush pile, and a soft edge for relaxed bedrooms and lounges.', 53, 'Bedroom'),
('oriel-marble-console', 'Oriel Marble Console', 'Linea Forma', 'Theo Vale', 'Stone Garden', 'Tables', 1290, NULL, 4.8, 35, 'New arrival', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85', '{"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85"}', 'A slim marble console that brings gallery-like polish to entryways, halls, and compact living rooms.', 60, 'Entryway'),
('ciel-ceramic-vase-set', 'Ciel Ceramic Vase Set', 'Spacesic Atelier', 'Mira Solen', 'Quiet Luxe', 'Decor', 260, NULL, 4.7, 76, 'Giftable', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1100&q=85', '{"https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1100&q=85"}', 'Three hand-finished ceramic forms in mineral glazes for shelves, dining tables, and bedside styling.', 67, 'Decor')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, name, email, phone, location) VALUES
('anaya-kapoor', 'Anaya Kapoor', 'anaya@example.com', '+1 212 555 0131', 'New York, NY'),
('marcus-reed', 'Marcus Reed', 'marcus@example.com', '+1 646 555 0188', 'Brooklyn, NY'),
('nina-shah', 'Nina Shah', 'nina@example.com', '+1 917 555 0155', 'Jersey City, NJ'),
('clara-wen', 'Clara Wen', 'clara@example.com', '+1 718 555 0164', 'Queens, NY')
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, "customerId", customer, email, phone, amount, status, date, items) VALUES
('SPC-1048', 'anaya-kapoor', 'Anaya Kapoor', 'anaya@example.com', '+1 212 555 0131', 2960, 'Processing', 'Jun 24, 2026', '{"Aster Boucle Lounge Chair", "Ciel Ceramic Vase Set"}'),
('SPC-1047', 'marcus-reed', 'Marcus Reed', 'marcus@example.com', '+1 646 555 0188', 620, 'Shipped', 'Jun 23, 2026', '{"Lumi Arc Floor Lamp"}'),
('SPC-1046', 'nina-shah', 'Nina Shah', 'nina@example.com', '+1 917 555 0155', 4250, 'Pending', 'Jun 22, 2026', '{"Solene Travertine Dining Table", "Serra Walnut Sideboard"}'),
('SPC-1045', 'clara-wen', 'Clara Wen', 'clara@example.com', '+1 718 555 0164', 1890, 'Delivered', 'Jun 21, 2026', '{"Marlow Linen Platform Bed"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, customer, product, rating, status, text, role) VALUES
('rev-1', 'Anaya Kapoor', 'Aster Boucle Lounge Chair', 5, 'Approved', 'Beautiful finish and careful white-glove delivery.', 'Homeowner'),
('rev-2', 'Theo Vale', 'Solene Travertine Dining Table', 4, 'Pending', 'Great proportions. Waiting on one extra detail photo.', 'Interior Architect'),
('rev-3', 'Nina Shah', 'Lumi Arc Floor Lamp', 5, 'Approved', 'Elegant and sturdy for our boutique suites.', 'Boutique Hotel Owner'),
('rev-4', 'Marcus Reed', 'Lumi Arc Floor Lamp', 5, 'Approved', 'Spacesic is where I source when clients want calm luxury with materials that photograph exactly as promised.', 'Interior Architect')
ON CONFLICT (id) DO NOTHING;

INSERT INTO settings (id, "storeName", "supportEmail", currency, "paymentProvider", "shippingZone", "adminName") VALUES
(1, 'Spacesic Home', 'hello@spacesichome.com', 'USD', 'Stripe', 'United States', 'Spacesic Admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO rooms (name, count, image) VALUES
('Living Room', '128 pieces', 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1000&q=85'),
('Bedroom', '96 pieces', 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=85'),
('Dining', '74 pieces', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=85'),
('Entryway', '38 pieces', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85')
ON CONFLICT (name) DO NOTHING;

INSERT INTO collections (name, text, image) VALUES
('Quiet Luxe', 'Warm neutrals, boucle seating, and sculptural accents.', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'),
('Stone Garden', 'Travertine, marble, oak, and softened silhouettes.', 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=85'),
('Hotel Calm', 'Layered bedrooms with tailored textiles and lighting.', 'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&w=1200&q=85')
ON CONFLICT (name) DO NOTHING;

INSERT INTO designers (name, text, city, image) VALUES
('Mira Solen', 'Minimal residential interiors', 'Copenhagen', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=85'),
('Theo Vale', 'Stone, timber, and hospitality spaces', 'Milan', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85'),
('Sana Iyer', 'Textiles and artisan sourcing', 'Mumbai', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85')
ON CONFLICT (name) DO NOTHING;

INSERT INTO posts (title, text) VALUES
('How to Layer a Neutral Room', 'Material contrast, scale, and warm lighting keep pale rooms from feeling flat.'),
('The Return of Stone Furniture', 'Travertine and marble are becoming softer, warmer, and easier to live with.'),
('What Designers Buy First', 'Our studio partners share the anchor pieces they choose before anything else.')
ON CONFLICT DO NOTHING;

INSERT INTO faqs (question, answer) VALUES
('Do you offer design support?', 'Yes. Complimentary styling notes are included with every order, and full room consultations are available from the Designers page.'),
('How long does delivery take?', 'In-stock decor ships in 3 to 5 business days. Furniture delivery typically takes 2 to 5 weeks depending on location and white-glove availability.'),
('Can I return furniture?', 'Most in-stock items can be returned within 30 days. Made-to-order and final sale pieces are noted clearly on the product page.'),
('Do you work with trade clients?', 'Yes. Designers, architects, and hospitality teams can request trade pricing from the Contact page.')
ON CONFLICT DO NOTHING;

INSERT INTO brands (name) VALUES
('Spacesic Atelier'),
('Linea Forma'),
('Nord House'),
('Maison Ori'),
('Vestra Studio'),
('Tactile Loom')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE collections DISABLE ROW LEVEL SECURITY;
ALTER TABLE designers DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_enquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;


-- Reservations
CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  date date NOT NULL,
  time text NOT NULL,
  party_size text NOT NULL,
  occasion text,
  seating_preference text,
  special_requests text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create reservations"
  ON public.reservations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  event_date date NOT NULL,
  start_time text NOT NULL,
  end_time text,
  ticket_price numeric NOT NULL DEFAULT 0,
  is_free boolean NOT NULL DEFAULT false,
  image_url text,
  max_tickets integer,
  tickets_sold integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active events"
  ON public.events FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Gift Cards
CREATE TABLE public.gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  amount numeric NOT NULL,
  recipient_name text,
  recipient_email text NOT NULL,
  sender_name text,
  message text,
  delivery_date date,
  is_redeemed boolean NOT NULL DEFAULT false,
  redeemed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can purchase gift cards"
  ON public.gift_cards FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Private Dining Enquiries
CREATE TABLE public.private_dining_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  event_date date,
  guest_count integer,
  event_type text,
  budget_range text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.private_dining_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit private dining enquiries"
  ON public.private_dining_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Chat Sessions
CREATE TABLE public.chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
-- Chat sessions are managed server-side via edge function; no public policies needed

-- Seed a few placeholder events
INSERT INTO public.events (name, description, event_date, start_time, end_time, ticket_price, is_free, image_url) VALUES
  ('Jazz Night with Musa Mthombeni', 'Live jazz quartet — Durban''s smoothest Friday night soundtrack', (CURRENT_DATE + 7), '20:00', '23:00', 0, true, 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Afrobeat Saturdays', 'High-energy Afrobeat with live percussion and DJ sets', (CURRENT_DATE + 8), '20:00', '00:00', 150, false, 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Sunday Brunch Jazz', 'Live trio over our Sunday brunch service', (CURRENT_DATE + 9), '11:00', '15:00', 0, true, 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Taste of the Continent', 'A six-course African tasting menu paired with SA wines', (CURRENT_DATE + 21), '19:00', '23:00', 850, false, 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800');

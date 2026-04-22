-- 1. Admin notes on reservations and orders
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS admin_notes text;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz NOT NULL DEFAULT now();

-- 2. Trigger to auto-update status_updated_at when orders.status changes
CREATE OR REPLACE FUNCTION public.touch_order_status_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_touch_status ON public.orders;
CREATE TRIGGER trg_orders_touch_status
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.touch_order_status_updated_at();

-- 3. Restrict the 'admin' role to admin@dukkah.co.za only
CREATE OR REPLACE FUNCTION public.enforce_admin_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  IF NEW.role = 'admin' THEN
    SELECT email INTO v_email FROM auth.users WHERE id = NEW.user_id;
    IF v_email IS DISTINCT FROM 'admin@dukkah.co.za' THEN
      RAISE EXCEPTION 'Only admin@dukkah.co.za may hold the admin role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_roles_enforce_admin ON public.user_roles;
CREATE TRIGGER trg_user_roles_enforce_admin
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_admin_email();

-- 4. Clean up: remove any stray admin rows not belonging to admin@dukkah.co.za
DELETE FROM public.user_roles ur
WHERE ur.role = 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = ur.user_id AND u.email = 'admin@dukkah.co.za'
  );
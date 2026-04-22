import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ADMIN_EMAIL = "admin@dukkah.co.za";

export function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async (uid: string | null, mail: string | null) => {
      if (!uid || mail !== ADMIN_EMAIL) {
        if (!mounted) return;
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (!mounted) return;
      setIsAdmin(Boolean(data));
      setLoading(false);
    };

    supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id ?? null;
      const mail = session?.user?.email ?? null;
      setUserId(uid);
      setEmail(mail);
      setLoading(true);
      setTimeout(() => check(uid, mail), 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      const mail = data.session?.user?.email ?? null;
      setUserId(uid);
      setEmail(mail);
      check(uid, mail);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { loading, userId, email, isAdmin, signOut: () => supabase.auth.signOut() };
}

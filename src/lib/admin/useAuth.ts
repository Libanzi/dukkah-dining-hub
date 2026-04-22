import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async (uid: string | null) => {
      if (!uid) {
        if (!mounted) return;
        setIsAdmin(false);
        setUserId(null);
        setEmail(null);
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
      setUserId(uid);
      setEmail(session?.user?.email ?? null);
      setLoading(true);
      // defer to avoid deadlocks
      setTimeout(() => check(uid), 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      setEmail(data.session?.user?.email ?? null);
      check(uid);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { loading, userId, email, isAdmin, signOut: () => supabase.auth.signOut() };
}

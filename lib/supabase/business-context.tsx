"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface BusinessContextValue {
  user: User | null;
  businessId: string | null;
  role: "admin" | "empleado" | null;
  allowedModules: string[];
  loading: boolean;
}

const BusinessContext = createContext<BusinessContextValue>({
  user: null,
  businessId: null,
  role: null,
  allowedModules: [],
  loading: true,
});

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BusinessContextValue>({
    user: null,
    businessId: null,
    role: null,
    allowedModules: [],
    loading: true,
  });

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setState({ user: null, businessId: null, role: null, allowedModules: [], loading: false });
        return;
      }

      // Asume un negocio por usuario (el más reciente al que se unió).
      // Si más adelante soportas multi-negocio por usuario, aquí es
      // donde agregarías un selector de negocio.
      const { data: membership } = await supabase
        .from("business_members")
        .select("business_id, role, allowed_modules")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("joined_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setState({
        user,
        businessId: membership?.business_id ?? null,
        role: (membership?.role as "admin" | "empleado") ?? null,
        allowedModules: membership?.allowed_modules ?? [],
        loading: false,
      });
    }

    load();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => load());
    return () => authListener.subscription.unsubscribe();
  }, []);

  return <BusinessContext.Provider value={state}>{children}</BusinessContext.Provider>;
}

export function useBusiness() {
  return useContext(BusinessContext);
}

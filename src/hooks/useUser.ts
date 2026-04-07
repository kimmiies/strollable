"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/demo";

const DEMO_USER: UserProfile = {
  id: "demo-user-id",
  display_name: "Demo Parent",
  email: "demo@strollable.app",
  avatar_url: null,
  badge_flags: {
    founding_reporter: true,
    reporter: true,
    verifier: false,
    scout: false,
  },
  contribution_counts: { reports: 3, verifications: 1, scouts: 0 },
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      setProfile(DEMO_USER);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, loading, isLoggedIn: isDemoMode || !!user };
}

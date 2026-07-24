import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { fetchProfile, upsertProfile, type Profile } from './database';

export interface AuthState {
  userId: string | null;
  email: string | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    userId: null,
    email: null,
    profile: null,
    loading: true,
    error: null,
  });

  const applySession = useCallback(async (userId: string | null, email: string | null) => {
    if (!userId) {
      setState({ userId: null, email: null, profile: null, loading: false, error: null });
      return;
    }
    try {
      let profile = await fetchProfile(userId);
      if (!profile) {
        profile = await upsertProfile(userId, { name: 'User', age: 25 });
      }
      setState({ userId, email, profile, loading: false, error: null });
    } catch (err) {
      setState({
        userId,
        email,
        profile: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Errore profilo',
      });
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setState({ userId: null, email: null, profile: null, loading: false, error: 'Supabase non configurato' });
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      applySession(user?.id ?? null, user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      applySession(user?.id ?? null, user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, [applySession]);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase non configurato' };
    setState((s) => ({ ...s, loading: true, error: null }));
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setState((s) => ({ ...s, loading: false, error: error.message }));
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase non configurato' };
    setState((s) => ({ ...s, loading: true, error: null }));
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setState((s) => ({ ...s, loading: false, error: error.message }));
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setState({ userId: null, email: null, profile: null, loading: false, error: null });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.userId) return;
    try {
      const profile = await fetchProfile(state.userId);
      setState((s) => ({ ...s, profile }));
    } catch (err) {
      // keep current profile on error
    }
  }, [state.userId]);

  const updateProfile = useCallback(async (patch: Partial<Profile>) => {
    if (!state.userId) return;
    try {
      const updated = await upsertProfile(state.userId, patch);
      if (updated) {
        setState((s) => ({ ...s, profile: updated }));
      }
    } catch (err) {
      // keep current on error
    }
  }, [state.userId]);

  return { ...state, signUp, signIn, signOut, refreshProfile, updateProfile };
}

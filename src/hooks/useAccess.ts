import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const ACCESS_STORAGE_KEY = 'daemon_access_verified';
const ACCESS_EXPIRY_KEY = 'daemon_access_expiry';
const ACCESS_KEY_DATA = 'daemon_key_data';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export interface CurrentKeyData {
  id: string;
  key_value: string;
  is_active: boolean;
  is_admin: boolean;
  display_name: string;
  avatar_url: string;
  username: string;
  created_at: string;
  last_used_at: string | null;
}

export function useAccess() {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);
  const [currentKey, setCurrentKey] = useState<CurrentKeyData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ACCESS_STORAGE_KEY);
    const expiry = localStorage.getItem(ACCESS_EXPIRY_KEY);
    const keyData = localStorage.getItem(ACCESS_KEY_DATA);

    if (stored === 'true' && expiry) {
      const expiryTime = parseInt(expiry, 10);
      if (Date.now() < expiryTime) {
        setIsVerified(true);
        if (keyData) {
          try {
            setCurrentKey(JSON.parse(keyData));
          } catch {
            localStorage.removeItem(ACCESS_KEY_DATA);
          }
        }
      } else {
        localStorage.removeItem(ACCESS_STORAGE_KEY);
        localStorage.removeItem(ACCESS_EXPIRY_KEY);
        localStorage.removeItem(ACCESS_KEY_DATA);
      }
    }
  }, []);

  const refreshCurrentKey = useCallback(async () => {
    if (!currentKey?.id) return;

    const { data } = await supabase
      .from('access_keys')
      .select('*')
      .eq('id', currentKey.id)
      .maybeSingle();

    if (data) {
      const updatedKey: CurrentKeyData = {
        id: data.id,
        key_value: data.key_value,
        is_active: data.is_active,
        is_admin: data.is_admin ?? false,
        display_name: data.display_name ?? '',
        avatar_url: data.avatar_url ?? '',
        username: data.username ?? '',
        created_at: data.created_at,
        last_used_at: data.last_used_at,
      };
      setCurrentKey(updatedKey);
      localStorage.setItem(ACCESS_KEY_DATA, JSON.stringify(updatedKey));
    }
  }, [currentKey?.id]);

  const verifyKey = useCallback(async (key: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(false);

    const normalizedKey = key.trim().toUpperCase();

    if (normalizedKey.length < 24 || normalizedKey.length > 32) {
      setError(true);
      setIsVerifying(false);
      return false;
    }

    const { data, error: dbError } = await supabase
      .from('access_keys')
      .select('*')
      .eq('key_value', normalizedKey)
      .eq('is_active', true)
      .maybeSingle();

    if (dbError || !data) {
      setError(true);
      setIsVerifying(false);
      return false;
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setError(true);
      setIsVerifying(false);
      return false;
    }

    if (data.is_one_time) {
      await supabase
        .from('access_keys')
        .update({ is_active: false, used_at: new Date().toISOString() })
        .eq('id', data.id);
    } else {
      await supabase
        .from('access_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', data.id);
    }

    const keyData: CurrentKeyData = {
      id: data.id,
      key_value: data.key_value,
      is_active: data.is_active,
      is_admin: data.is_admin ?? false,
      display_name: data.display_name ?? '',
      avatar_url: data.avatar_url ?? '',
      username: data.username ?? '',
      created_at: data.created_at,
      last_used_at: data.last_used_at,
    };

    localStorage.setItem(ACCESS_STORAGE_KEY, 'true');
    localStorage.setItem(ACCESS_EXPIRY_KEY, (Date.now() + SESSION_DURATION).toString());
    localStorage.setItem(ACCESS_KEY_DATA, JSON.stringify(keyData));

    setCurrentKey(keyData);
    setIsVerified(true);
    setIsVerifying(false);
    return true;
  }, []);

  const revokeAccess = useCallback(() => {
    localStorage.removeItem(ACCESS_STORAGE_KEY);
    localStorage.removeItem(ACCESS_EXPIRY_KEY);
    localStorage.removeItem(ACCESS_KEY_DATA);
    setIsVerified(false);
    setCurrentKey(null);
  }, []);

  const isAdmin = currentKey?.is_admin ?? false;

  return {
    isVerified,
    isVerifying,
    error,
    verifyKey,
    revokeAccess,
    setError,
    currentKey,
    isAdmin,
    refreshCurrentKey,
  };
}

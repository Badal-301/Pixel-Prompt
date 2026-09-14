import type { TransmissionRegistration } from '../types';

const STORAGE_KEYS = {
  DECRYPTED_CLUES: 'pixel_decrypted_clues',
  REGISTRATION: 'pixel_registration',
  EASTER_EGG_FOUND: 'pixel_easter_egg_found',
  WARNING_TRIGGERED: 'pixel_warning_triggered',
};

export const getDecryptedClueIds = (): string[] => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DECRYPTED_CLUES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const saveDecryptedClueId = (clueId: string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const current = getDecryptedClueIds();
    if (!current.includes(clueId)) {
      const updated = [...current, clueId];
      localStorage.setItem(STORAGE_KEYS.DECRYPTED_CLUES, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('pixel_progress_updated', { detail: { decryptedCount: updated.length } }));
      return updated;
    }
    return current;
  } catch {
    return [];
  }
};

export const getRegistration = (): TransmissionRegistration | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveRegistration = (email: string): TransmissionRegistration => {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const transmission: TransmissionRegistration = {
    email,
    transmissionId: `SIG-${randomSuffix}-X`,
    registeredAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.REGISTRATION, JSON.stringify(transmission));
  }
  return transmission;
};

export const resetArgProgress = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.DECRYPTED_CLUES);
  localStorage.removeItem(STORAGE_KEYS.REGISTRATION);
  localStorage.removeItem(STORAGE_KEYS.EASTER_EGG_FOUND);
  window.dispatchEvent(new CustomEvent('pixel_progress_updated', { detail: { decryptedCount: 0 } }));
};

export type ToastType = 'info' | 'success' | 'warning' | 'alert';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  public subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener(this.toasts);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l([...this.toasts]));
  }

  public show(title: string, message: string, type: ToastType = 'info', duration: number = 3200): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastItem = { id, title, message, type, duration };
    
    // Max 4 visible toasts at once
    this.toasts = [newToast, ...this.toasts.slice(0, 3)];
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  public dismiss(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }
}

export const toast = new ToastManager();

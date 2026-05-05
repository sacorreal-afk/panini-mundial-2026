// ============================================
// STORAGE: Wrapper sobre localStorage que emula la API original de window.storage
// ============================================
// El artifact original usaba window.storage.get/set/delete (API asincrona compartida).
// En produccion (PWA) usamos localStorage del navegador del usuario, que es:
// - Sincrono pero envolvemos en async para no romper el codigo existente
// - Local al dispositivo (cada miembro de la familia tiene sus datos en su iPhone)
// - Persistente entre sesiones
// - Limite ~5-10 MB por dominio (mas que suficiente para el album)

const PREFIX = 'panini2026:';

export const storage = {
  async get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return null;
      return { key, value: raw, shared: false };
    } catch (e) {
      console.error('storage.get error:', e);
      return null;
    }
  },

  async set(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(PREFIX + key, stringValue);
      return { key, value: stringValue, shared: false };
    } catch (e) {
      console.error('storage.set error:', e);
      // localStorage puede fallar por cuota llena
      if (e.name === 'QuotaExceededError') {
        alert('No hay espacio suficiente en el navegador. Borra otras apps o exporta un backup primero.');
      }
      return null;
    }
  },

  async delete(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return { key, deleted: true, shared: false };
    } catch (e) {
      console.error('storage.delete error:', e);
      return null;
    }
  },

  async list(prefix) {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i);
        if (fullKey && fullKey.startsWith(PREFIX)) {
          const cleanKey = fullKey.slice(PREFIX.length);
          if (!prefix || cleanKey.startsWith(prefix)) {
            keys.push(cleanKey);
          }
        }
      }
      return { keys, prefix, shared: false };
    } catch (e) {
      console.error('storage.list error:', e);
      return { keys: [], prefix, shared: false };
    }
  }
};

// Exponemos la API global para que el resto del codigo (que usa window.storage) siga funcionando
if (typeof window !== 'undefined') {
  window.storage = storage;
}

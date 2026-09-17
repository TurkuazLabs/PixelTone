// # 📄 Dosya Yolu: pixeltone/frontend/repositories/local_repository.js
// # 📌 Amac: Frontend local storage islemlerini yonetmek
// # 📌 Repo - JavaScript
// # Version: 0.3.0
// # Aciklama: Renk gecmisi listelerini ve basit kullanici ayarlarini localStorage icinde saklar
//
// Bagimli Oldugu Katman: Repo

export const localRepository = Object.freeze({
  readList(storageKey) {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return [];
    }

    try {
      const parsedValue = JSON.parse(rawValue);
      return Array.isArray(parsedValue) ? parsedValue : [];
    } catch (_error) {
      return [];
    }
  },

  writeList(storageKey, items) {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  },

  readValue(storageKey, fallbackValue = "") {
    return window.localStorage.getItem(storageKey) || fallbackValue;
  },

  writeValue(storageKey, value) {
    window.localStorage.setItem(storageKey, String(value));
  },
});

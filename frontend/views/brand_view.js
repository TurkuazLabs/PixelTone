// # 📄 Dosya Yolu: pixeltone/frontend/views/brand_view.js
// # 📌 Amac: Ana arayuz TurkuazLabs marka footer DOM ciktilarini yonetmek
// # 📌 View - JavaScript
// # Version: 1.1.1
// # Aciklama: TurkuazLabs logosu, gelistirici mesaji ve site adresini ana arayuz footerina yazar
//
// Bagimli Oldugu Katman: View

const dom = Object.freeze({
  logo: document.getElementById("brand-footer-logo"),
  lead: document.getElementById("brand-footer-lead"),
  website: document.getElementById("brand-footer-website"),
});

export const brandView = Object.freeze({
  render(state) {
    dom.logo.src = state.logo;
    dom.logo.alt = state.name;
    dom.lead.textContent = state.lead;
    dom.website.textContent = state.website;
  },
});

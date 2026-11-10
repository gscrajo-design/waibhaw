# Tax Ki Jankari (taxkijankari.com) 🇮🇳

A modern, professional, and mobile-responsive website for **Tax Ki Jankari** — India's dedicated tax information portal and assisted filing consultancy.

---

## 🌟 Key Features

1. **Free Tax Information & Guides**:
   - **GST Hub**: Registration threshold rules (₹40L/₹20L), mandatory e-commerce triggers, Regular vs. Composition Scheme comparison table, and e-invoicing guides.
   - **ITR Hub**: Comprehensive Old vs. New Tax Regime comparison (budget tax slabs, standard deduction ₹75k, 87A rebate), ITR-1 to 4 form selector, and Chapter VI-A deductions checklist (80C, 80D, 24b, HRA).
   - **Due Dates Calendar**: Filterable compliance calendar for monthly/quarterly GST returns (GSTR-1, 3B, CMP-08), Annual GSTR-9, ITR filing deadlines, and TDS deposits.
   - **CBDT & GST Bulletins**: Latest notifications, circulars, and tax policy updates.
   - **Searchable FAQs**: Real-time filtering accordion answering common tax & filing queries.

2. **Interactive Tax Calculators**:
   - **Live Income Tax Calculator**: Real-time comparison between Old vs New Regime for FY 2024-25 / 2025-26 with automated savings recommendations.
   - **Live GST Calculator**: Instant calculation of Base Amount, GST Tax, CGST, SGST, and IGST for 5%, 12%, 18%, 28%, and custom rates in both Exclusive and Inclusive modes.

3. **5 Paid Assisted Filing Services**:
   - 🆕 **GST Registration** (New Regular / Composition / E-commerce)
   - 📊 **GST Return Filing** (GSTR-1, GSTR-3B, CMP-08, GSTR-9 with GSTR-2B reconciliation)
   - 📑 **ITR Filing** (Salaried, Freelancers, Presumptive 44AD/ADA, Capital Gains)
   - 🔄 **GST Amendment & Cancellation** (Core/Non-core changes, Surrender, Revocation)
   - 🛡️ **Tax Consultation & Notice Advisory** (Section 143(1), 148, ASMT-10, DRC-01)

4. **Lead Generation & Contact Integration**:
   - Validation-enabled Lead Capture Forms (Name, 10-digit Indian Mobile, Email, Service selection, City, Message).
   - **Lead Notification Destination**: Configured for `gscrajo@gmail.com`.
   - **Direct WhatsApp Chat**: Configured for `+91 7544065151` (`7544065151`) with pre-filled lead inquiry format.
   - **Direct Call Actions**: Click-to-call links (`tel:+917544065151`).
   - **Mobile Sticky Action Bar**: Instant access to Call, WhatsApp, and Inquiry on mobile devices.
   - **Local Storage Backup**: Leads safely stored in browser `localStorage` to prevent data loss.

5. **Statutory Legal Compliance & Trust**:
   - Prominent **Private Consultancy Disclaimer** on top bar, hero section, lead forms, footer, and dedicated `Disclaimer` page.
   - Comprehensive **Privacy Policy** (GDPR & Indian IT Act compliant) and **Terms of Service**.

---

## 📁 Project File Structure

```
tax-ki-jankari/
├── index.html               # Main SPA shell with semantic views & responsive layout
├── css/
│   └── styles.css           # Custom Indian financial theme (Deep Navy & Saffron)
├── js/
│   ├── data.js              # Centralized data store (Services, Due Dates, FAQs, Updates)
│   ├── tax-calculator.js    # Income Tax (Old vs New) & GST Calculator calculation engine
│   ├── lead-form.js         # Lead capture, validation, email dispatch, WhatsApp handoff
│   └── app.js               # SPA navigation, filtering, search, and dynamic UI controller
└── assets/                  # Icons, badges, and visual branding assets
```

---

## 🚀 How to Run & Deploy

### Quick Local Preview
Simply double-click or open `index.html` in any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Production Hosting
The application is 100% self-contained and zero-dependency. You can deploy it instantly to:
- **cPanel / Shared Hosting / Hostinger / GoDaddy**: Upload all files to `public_html`.
- **Vercel / Netlify**: Connect the repository or drag-and-drop the project folder.
- **GitHub Pages**: Push the repository and enable GitHub Pages in repository settings.

---

## ⚖️ Non-Government Disclaimer
*Tax Ki Jankari (`taxkijankari.com`) is a private tax assistance, consultancy, and information platform. It is not affiliated with, sponsored by, or endorsed by the Goods and Services Tax Network (GSTN), Central Board of Indirect Taxes & Customs (CBIC), Central Board of Direct Taxes (CBDT), or the Income Tax Department of India.*

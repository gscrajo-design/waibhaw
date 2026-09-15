/**
 * Tax Ki Jankari (taxkijankari.com) - Core Data Store
 * Contains services, compliance calendar, tax updates, FAQs, and testimonials.
 */

const TaxData = {
    businessInfo: {
        name: "Tax Ki Jankari",
        tagline: "Aapki Tax Jankari, Hamari Zimmedari",
        domain: "taxkijankari.com",
        phone: "+91 7544065151",
        phoneRaw: "7544065151",
        email: "gsc@taxkijankari.com",
        whatsapp: "917544065151",
        workingHours: "Mon - Sat: 9:30 AM - 7:30 PM (IST)",
        disclaimer: "Tax Ki Jankari (taxkijankari.com) is a private tax assistance, consultancy, and information portal. We are NOT affiliated with, sponsored by, or endorsed by the Goods and Services Tax Network (GSTN), Central Board of Indirect Taxes & Customs (CBIC), Central Board of Direct Taxes (CBDT), or the Income Tax Department of India."
    },

    services: [
        {
            id: "gst-registration",
            title: "GST Registration",
            hindiTitle: "नया जीएसटी रजिस्ट्रेशन",
            icon: "file-plus",
            badge: "Fast 3-7 Days",
            priceDisplay: "₹999*",
            shortDesc: "Complete hassle-free online GST registration for Proprietors, Partnerships, LLPs, Private Ltd companies, and E-commerce sellers.",
            longDesc: "Get your business GST registered with 100% legal compliance. Our tax experts verify your documents, prepare application Form REG-01, handle jurisdiction selection, track ARN, and respond to any Clarification (REG-03) till you receive your GST Certificate (REG-06).",
            features: [
                "Eligibility & Scheme selection (Regular vs Composition)",
                "Document verification & HSN/SAC code mapping",
                "Filing Form REG-01 on GST Portal",
                "Instant ARN generation & tracking",
                "Free reply to GST Officer clarification (if raised)",
                "Official GST Certificate (Form REG-06) download"
            ],
            documents: [
                "PAN Card of Business Owner / Entity",
                "Aadhaar Card of Applicant / Partners / Directors",
                "Passport size Photograph",
                "Electricity Bill / Property Tax Receipt of business premises",
                "Rent Agreement & NOC (if rented premises)",
                "Cancelled Cheque / Bank Statement with Bank details"
            ],
            turnaround: "3 to 7 Working Days (Subject to GST Officer verification)",
            whatsappMessage: "Hello Tax Ki Jankari, I need assistance with *New GST Registration*. Please share details and pricing."
        },
        {
            id: "gst-returns",
            title: "GST Return Filing",
            hindiTitle: "जीएसटी रिटर्न फाइलिंग (GSTR-1, 3B, 9)",
            icon: "refresh-cw",
            badge: "Monthly / Quarterly",
            priceDisplay: "₹499*/mo",
            shortDesc: "Accurate monthly & quarterly filing of GSTR-1, GSTR-3B, CMP-08, and Annual GSTR-9 with 2B reconciliation to maximize ITC.",
            longDesc: "Never miss a GST due date or pay hefty late fees. We reconcile your sales invoices with GSTR-2B purchase data, optimize Input Tax Credit (ITC), calculate net tax liability, file returns on time, and provide computation sheets for your records.",
            features: [
                "GSTR-1 (Outward Supplies) & GSTR-3B (Summary Return)",
                "Automated GSTR-2B vs Purchase Register ITC reconciliation",
                "Composition Return Filing (CMP-08) & Annual GSTR-4",
                "Annual Return GSTR-9 & Reconciliation Statement GSTR-9C",
                "Zero late fee advisory & compliance alerts",
                "Timely monthly tax computation sheets"
            ],
            documents: [
                "Monthly Sales Invoices / Summary",
                "Purchase Invoices / GSTR-2B summary",
                "GST Portal Login Credentials (User ID / Password)",
                "Bank Statement for the respective filing period"
            ],
            turnaround: "Same Day / 24 Hours before due date",
            whatsappMessage: "Hello Tax Ki Jankari, I want to get my *GST Return Filing (GSTR-1 / 3B / Annual)* done. Please guide me."
        },
        {
            id: "itr-filing",
            title: "Income Tax Return (ITR) Filing",
            hindiTitle: "इनकम टैक्स रिटर्न फाइलिंग",
            icon: "file-text",
            badge: "Max Refund Guarantee",
            priceDisplay: "₹499*",
            shortDesc: "Accurate ITR filing for Salaried employees, Freelancers, Small Businesses (44AD/ADA), and Capital Gains investors.",
            longDesc: "File your ITR accurately under the best tax regime (Old vs New). We cross-verify Form 16, AIS, TIS, and 26AS, claim all eligible deductions (80C, 80D, HRA, Home Loan interest), minimize tax liability, and ensure fast refund processing directly to your bank account.",
            features: [
                "ITR-1 (Sahaj) for Salaried & Pensioners with single house property",
                "ITR-2 for Capital Gains, Multiple House Properties & Foreign Assets",
                "ITR-3 & ITR-4 (Sugam) for Business & Freelancers under 44AD/ADA",
                "AIS / TIS and Form 26AS cross-verification",
                "Old vs New Tax Regime optimization comparison",
                "Free e-Verification assistance via Aadhaar OTP"
            ],
            documents: [
                "PAN Card & Aadhaar Card (linked)",
                "Form 16 / Salary Slips from Employer (for salaried)",
                "Bank Statements for the entire Financial Year",
                "Investment proofs (LIC, PPF, ELSS, Health Insurance)",
                "Capital Gains Statement from Zerodha/Groww/Broker (if any)",
                "Home Loan Interest Certificate (if applicable)"
            ],
            turnaround: "Within 24-48 Hours",
            whatsappMessage: "Hello Tax Ki Jankari, I need help with *ITR Filing (Income Tax Return)*. Please review my case."
        },
        {
            id: "gst-amendment",
            title: "GST Amendment & Cancellation",
            hindiTitle: "जीएसटी संशोधन एवं रद्दीकरण",
            icon: "edit-3",
            badge: "100% Online",
            priceDisplay: "₹799*",
            shortDesc: "Update business address, add partners, change phone/email, or surrender unused GSTIN to avoid compounding penalties.",
            longDesc: "Need to change your business premises, add additional places of business, update bank details, or close a dormant GSTIN? We handle Core and Non-Core amendments, GST surrender applications, and Revocation of Cancelled GST registrations.",
            features: [
                "Core Field Amendment (Business Name, Address, Partners/Directors)",
                "Non-Core Field Amendment (Bank details, Mobile, Email, HSN codes)",
                "Voluntary GST Cancellation / Surrender of GSTIN (Form REG-16)",
                "Final GST Return Filing (Form GSTR-10)",
                "Revocation of Cancelled GSTIN (Form REG-21)",
                "Removal of compounding penalties on dormant GSTINs"
            ],
            documents: [
                "Existing GST Certificate (REG-06)",
                "Proof of New Address / Updated Bank Statement / Partnership Deed",
                "PAN & Aadhaar of authorized signatory",
                "Reason for Cancellation / Closing Balance details (if cancelling)"
            ],
            turnaround: "2 to 5 Working Days",
            whatsappMessage: "Hello Tax Ki Jankari, I need help with *GST Amendment / GST Cancellation / Revocation*. Please connect with me."
        },
        {
            id: "tax-consultation",
            title: "Expert Tax Consultation & Notice Advisory",
            hindiTitle: "टैक्स कंसल्टेशन एवं नोटिस समाधान",
            icon: "shield-alert",
            badge: "1-on-1 Expert Call",
            priceDisplay: "₹499*",
            shortDesc: "Get personalized 1-on-1 advice for Income Tax notices (143(1), 148), GST notices (ASMT-10, DRC-01), or business tax planning.",
            longDesc: "Received a notice from the Income Tax Department or GST department? Don't panic. Our experienced tax professionals analyze your notice, verify data discrepancies, prepare legally compliant replies, and provide actionable advice to protect you from penalties.",
            features: [
                "Income Tax Scrutiny / Defective Return Notice (Section 139(9), 143(1), 148)",
                "GST Scrutiny Notices (ASMT-10, DRC-01, Form GST MOV-02)",
                "Business Structure Tax Optimization (Proprietorship vs LLP vs Pvt Ltd)",
                "High Value Transaction (SFT) & Cash Deposit advisory",
                "Advance Tax planning & calculation",
                "Dedicated phone consultation with experienced tax consultant"
            ],
            documents: [
                "Copy of the received Notice / Intimation Letter",
                "Relevant ITR acknowledgment / GST returns of that assessment year",
                "Supporting bank statements and invoices"
            ],
            turnaround: "Priority Call within 2 to 4 Hours",
            whatsappMessage: "Hello Tax Ki Jankari, I need *Tax Consultation / Notice Reply Assistance*. Here are my query details."
        }
    ],

    dueDates: [
        {
            category: "GST",
            title: "GSTR-1 (Monthly)",
            description: "Details of outward supplies (sales) for monthly taxpayers with turnover > ₹5 Crore or non-QRMP.",
            frequency: "Monthly",
            dayOfMonth: 11,
            nextDate: "11th of every month",
            badgeColor: "bg-blue-100 text-blue-800 border-blue-200"
        },
        {
            category: "GST",
            title: "GSTR-1 IFF (QRMP Scheme)",
            description: "Invoice Furnishing Facility (IFF) for quarterly filers under QRMP scheme (Optional for M1 & M2).",
            frequency: "Monthly (M1, M2)",
            dayOfMonth: 13,
            nextDate: "13th of every month",
            badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200"
        },
        {
            category: "GST",
            title: "GSTR-3B (Monthly Filers)",
            description: "Summary return & tax payment for regular taxpayers having turnover > ₹5 Crore or non-QRMP.",
            frequency: "Monthly",
            dayOfMonth: 20,
            nextDate: "20th of every month",
            badgeColor: "bg-orange-100 text-orange-800 border-orange-200"
        },
        {
            category: "GST",
            title: "CMP-08 (Composition Scheme)",
            description: "Quarterly statement-cum-challan for payment of self-assessed tax by composition dealers.",
            frequency: "Quarterly",
            nextDate: "18th after quarter end (Apr 18, Jul 18, Oct 18, Jan 18)",
            badgeColor: "bg-amber-100 text-amber-800 border-amber-200"
        },
        {
            category: "GST",
            title: "GSTR-3B (QRMP Category 1 & 2)",
            description: "Quarterly return for QRMP taxpayers (State group 1: 22nd, State group 2: 24th of following month).",
            frequency: "Quarterly",
            nextDate: "22nd / 24th after quarter end",
            badgeColor: "bg-purple-100 text-purple-800 border-purple-200"
        },
        {
            category: "ITR",
            title: "ITR Filing (Non-Audit Cases)",
            description: "Filing of Income Tax Return for individuals, salaried employees, HUF, and non-audit business entities.",
            frequency: "Annual",
            nextDate: "31st July of Assessment Year",
            badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
        },
        {
            category: "ITR",
            title: "ITR Filing (Tax Audit Cases)",
            description: "Filing of Income Tax Return for businesses/professionals liable for Tax Audit under Section 44AB.",
            frequency: "Annual",
            nextDate: "31st October of Assessment Year",
            badgeColor: "bg-teal-100 text-teal-800 border-teal-200"
        },
        {
            category: "TDS",
            title: "TDS Payment Deposit",
            description: "Monthly deposit of Tax Deducted at Source (TDS) under various sections.",
            frequency: "Monthly",
            dayOfMonth: 7,
            nextDate: "7th of every month",
            badgeColor: "bg-rose-100 text-rose-800 border-rose-200"
        },
        {
            category: "GST",
            title: "GSTR-9 & 9C (Annual Return)",
            description: "Annual Return for regular taxpayers and Reconciliation Statement for eligible businesses.",
            frequency: "Annual",
            nextDate: "31st December following Financial Year",
            badgeColor: "bg-red-100 text-red-800 border-red-200"
        }
    ],

    taxUpdates: [
        {
            id: 1,
            title: "New Tax Regime Default Slabs & Section 87A Rebate Explained",
            category: "Income Tax",
            date: "Budget Update",
            summary: "Under the New Tax Regime, income up to ₹7,00,000 has zero tax payable due to rebate u/s 87A. With the increased Standard Deduction of ₹75,000 for salaried employees, income up to ₹7.75 Lakhs is completely tax-free!",
            highlights: [
                "Standard Deduction for Salaried raised to ₹75,000",
                "Zero tax on total income up to ₹7.75 Lakhs under New Regime",
                "Revised Slabs: 0-3L (Nil), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), Above 15L (30%)"
            ],
            tag: "High Priority"
        },
        {
            id: 2,
            title: "GST Amnesty & Waiver of Interest/Penalties for Past Demand Notices",
            category: "GST Update",
            date: "GST Council",
            summary: "GST Council introduced Section 128A providing waiver of interest and penalty for demand notices issued under Section 73 for FY 2017-18, 2018-19, and 2019-20 if tax demand is paid within specified timelines.",
            highlights: [
                "Full waiver of interest & penalties under Section 73 demands",
                "Helps small businesses resolve old litigation cleanly",
                "Contact our team for verification of your demand eligibility"
            ],
            tag: "Relief Measure"
        },
        {
            id: 3,
            title: "E-Invoicing Mandatory Threshold: Current Rules & Applicability",
            category: "GST Compliance",
            date: "Compliance Alert",
            summary: "B2B E-Invoicing is mandatory for businesses with aggregate turnover exceeding ₹5 Crores in any preceding financial year. Non-compliance results in invalid invoices and loss of ITC for your buyers.",
            highlights: [
                "Applicable to all B2B invoices, Credit Notes, and Debit Notes",
                "IRN (Invoice Reference Number) & QR Code mandatory on tax invoice",
                "Penalties up to ₹10,000 or 100% of tax per non-generated invoice"
            ],
            tag: "Must Know"
        },
        {
            id: 4,
            title: "Annual Information Statement (AIS) & Form 26AS Matching Before ITR",
            category: "ITR Guide",
            date: "ITR Tip",
            summary: "The Income Tax Department automatically tracks high-value transactions, share trading, mutual fund redemptions, dividend payouts, and interest income via AIS/TIS. Ensure matching before filing.",
            highlights: [
                "Check AIS on the Income Tax e-filing portal before submission",
                "Report all interest income (Savings, FD, RD) to avoid Section 143(1) notices",
                "We provide automated AIS reconciliation with your ITR computation"
            ],
            tag: "Important"
        },
        {
            id: 5,
            title: "Bank Account Validation & Aadhaar-PAN Linkage Status",
            category: "General Compliance",
            date: "Refund Alert",
            summary: "Tax refunds can only be processed if your bank account is pre-validated and PAN-Aadhaar linkage is active. Inoperative PAN leads to 20% higher TDS deduction.",
            highlights: [
                "Check bank account validation status in e-filing profile",
                "Ensure Name in Bank matches exactly with PAN database",
                "Direct help available for bank re-validation issues"
            ],
            tag: "Action Required"
        }
    ],

    faqs: [
        {
            category: "General",
            q: "What is Tax Ki Jankari and who are we?",
            a: "Tax Ki Jankari (taxkijankari.com) is a private, independent tax consultancy and informational platform. We provide free educational guides, tax updates, compliance calendars, and interactive tax tools, alongside paid assisted filing services for GST and Income Tax. We are not a government website."
        },
        {
            category: "GST",
            q: "When is GST registration mandatory for a business?",
            a: "GST registration is mandatory if your aggregate turnover in a financial year exceeds ₹40 Lakhs for goods (₹20 Lakhs for special category states) or ₹20 Lakhs for services (₹10 Lakhs for special category states). Registration is also mandatory regardless of turnover for: E-commerce sellers (Amazon, Flipkart, etc.), interstate suppliers, persons liable to pay reverse charge (RCM), and casual taxable persons."
        },
        {
            category: "GST",
            q: "What is the difference between Regular GST and Composition Scheme?",
            a: "Under the Regular Scheme, businesses collect GST from buyers, claim Input Tax Credit (ITC) on purchases, and file monthly/quarterly returns (GSTR-1 & 3B). Under the Composition Scheme (available for turnover up to ₹1.5 Cr for goods, ₹50L for services), dealers pay tax at a nominal flat rate (1% to 5%) on turnover, cannot collect GST from customers, cannot claim ITC, and file simple quarterly statements (CMP-08)."
        },
        {
            category: "GST",
            q: "What happens if I don't file GST returns on time?",
            a: "Late filing of GST returns attracts a daily late fee (₹50/day for normal returns, ₹20/day for nil returns) plus 18% per annum interest on unpaid tax liability. Prolonged non-filing leads to GSTIN suspension/cancellation and E-way bill generation blocking."
        },
        {
            category: "ITR",
            q: "Which is better for me: Old Tax Regime or New Tax Regime?",
            a: "The New Tax Regime offers lower tax slab rates and a higher basic exemption (zero tax up to ₹7.75 Lakhs for salaried including standard deduction ₹75k), but does not allow chapter VI-A deductions (80C, 80D, HRA). The Old Tax Regime allows extensive deductions (80C ₹1.5L, 80D ₹25k-₹50k, HRA, Home loan interest ₹2L). If your total deductions exceed ₹3.75 - ₹4 Lakhs, the Old Regime is often beneficial; otherwise, the New Regime usually results in lower tax. Use our live Tax Calculator to compare!"
        },
        {
            category: "ITR",
            q: "Is it compulsory to file an ITR if my income is below the taxable limit?",
            a: "Filing is mandatory if your gross total income before deductions exceeds the basic exemption limit. However, filing a 'Nil Return' is highly recommended if you wish to apply for home/car loans, get visa approvals, carry forward business/stock market losses, or claim a TDS refund deducted on your income."
        },
        {
            category: "ITR",
            q: "How many days does it take to receive an Income Tax refund?",
            a: "After you e-verify your ITR, the Centralized Processing Center (CPC) usually processes the return within 7 to 30 days. Once processed, the refund is directly credited via NECS/RTGS to your pre-validated bank account."
        },
        {
            category: "Services",
            q: "How does the paid filing assistance work on Tax Ki Jankari?",
            a: "1) You submit your inquiry via our lead form, WhatsApp (7544065151), or Call. 2) Our tax expert connects with you, understands your case, and provides a document checklist. 3) You share documents securely via WhatsApp/Email. 4) We draft your computation/application, get your confirmation, file it on the official portal, and deliver official acknowledgment/certificate."
        },
        {
            category: "Services",
            q: "Are my personal financial documents and PAN details safe with you?",
            a: "Yes, 100%. We strictly adhere to data confidentiality. Your documents and credentials are used solely for preparing and submitting your tax returns/applications and are never shared with any third party."
        }
    ],

    testimonials: [
        {
            name: "Rajesh Sharma",
            role: "Proprietor, Sharma Enterprises (Jaipur)",
            rating: 5,
            comment: "Tax Ki Jankari helped me get my GST registration within 4 days without any hassle. Their team explained everything in simple Hindi and kept me updated at every step!"
        },
        {
            name: "Pooja Verma",
            role: "Software Engineer (Bengaluru)",
            rating: 5,
            comment: "Was confused between Old and New tax regime for FY 2024-25. The consultant analyzed my Form 16, HRA, and 80C investments and saved me ₹28,000 in tax. Very smooth ITR filing."
        },
        {
            name: "Amit Patel",
            role: "E-Commerce Seller (Ahmedabad)",
            rating: 5,
            comment: "Regular monthly GST return filing with GSTR-2B reconciliation is handled effortlessly by them. No late fees and perfect ITC matching. Highly recommended!"
        },
        {
            name: "Suresh Meena",
            role: "Trader (Delhi NCR)",
            rating: 5,
            comment: "I had received a GST notice regarding ITC mismatch. The team drafted a professional reply and got it resolved without penalty. Genuine and trustworthy consultancy."
        }
    ]
};

if (typeof window !== 'undefined') {
    window.TaxData = TaxData;
}

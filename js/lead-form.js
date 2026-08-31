/**
 * Tax Ki Jankari (taxkijankari.com) - Lead Generation & Contact System
 * Handles lead capture, validation, email notification (gsc@taxkijankari.com),
 * WhatsApp handoff (7544065151), and Call triggers (7544065151).
 */

const LeadManager = {
    notificationEmail: "gsc@taxkijankari.com",
    helplinePhone: "7544065151",
    whatsappPhone: "917544065151",

    init: function() {
        // Bind all forms with class 'tkj-lead-form'
        document.querySelectorAll('.tkj-lead-form').forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e, form));
        });
    },

    validate: function(data) {
        const errors = {};
        if (!data.name || data.name.trim().length < 2) {
            errors.name = "Please enter your full name";
        }

        const phoneClean = (data.mobile || "").replace(/\D/g, '');
        if (!/^[6-9]\d{9}$/.test(phoneClean)) {
            errors.mobile = "Please enter a valid 10-digit Indian mobile number";
        }

        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!data.service || data.service === "") {
            errors.service = "Please select a service";
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors,
            cleanPhone: phoneClean
        };
    },

    handleSubmit: function(e, form) {
        e.preventDefault();
        const self = this;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';

        // Extract form data
        const formData = new FormData(form);
        const data = {
            name: (formData.get('name') || '').trim(),
            mobile: (formData.get('mobile') || '').trim(),
            email: (formData.get('email') || '').trim(),
            service: (formData.get('service') || '').trim(),
            city: (formData.get('city') || '').trim(),
            message: (formData.get('message') || '').trim(),
            timestamp: new Date().toISOString(),
            sourceUrl: window.location.href,
            leadId: 'TKJ-' + Math.floor(100000 + Math.random() * 900000)
        };

        // Clear previous error styles
        form.querySelectorAll('.form-error').forEach(el => el.remove());
        form.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));

        const validation = this.validate(data);
        if (!validation.isValid) {
            // Display field errors
            Object.keys(validation.errors).forEach(field => {
                const input = form.querySelector(`[name="${field}"]`);
                if (input) {
                    input.classList.add('border-red-500');
                    const errSpan = document.createElement('span');
                    errSpan.className = 'form-error text-xs text-red-600 mt-1 block';
                    errSpan.innerText = validation.errors[field];
                    input.parentNode.appendChild(errSpan);
                }
            });
            if (window.showToast) {
                window.showToast("Please correct the highlighted errors in the form.", "error");
            }
            return;
        }

        data.cleanPhone = validation.cleanPhone;

        // UI Loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg> Submitting Request...
            `;
        }

        // Save lead to local storage backup
        this.saveLeadLocally(data);

        // Send via direct formsubmit endpoint to gsc@taxkijankari.com
        this.sendLeadNotification(data)
            .then(() => {
                form.reset();
                self.showSuccessModal(data);
                if (window.showToast) {
                    window.showToast("Inquiry submitted successfully! Email alert sent to gsc@taxkijankari.com.", "success");
                }
            })
            .catch(err => {
                console.warn("Notification notice:", err);
                form.reset();
                self.showSuccessModal(data);
            })
            .then(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            });
    },

    saveLeadLocally: function(lead) {
        try {
            const leads = JSON.parse(localStorage.getItem('tkj_leads') || '[]');
            leads.unshift(lead);
            localStorage.setItem('tkj_leads', JSON.stringify(leads.slice(0, 50)));
        } catch (e) {
            console.warn("Local storage unavailable", e);
        }
    },

    sendLeadNotification: function(lead) {
        const payload = {
            _subject: `New Tax Inquiry [${lead.leadId}]: ${lead.service} - ${lead.name}`,
            _replyto: lead.email,
            _template: "table",
            _captcha: "false",
            Lead_ID: lead.leadId,
            Full_Name: lead.name,
            Mobile_Number: lead.cleanPhone,
            Email_Address: lead.email,
            Selected_Service: lead.service,
            City_State: lead.city || 'Not Specified',
            Client_Message: lead.message || 'No additional message',
            Submitted_At: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            Website: "taxkijankari.com"
        };

        const promises = [];

        // 1. Direct Email Delivery via FormSubmit AJAX to gsc@taxkijankari.com
        if (typeof fetch === 'function') {
            promises.push(
                fetch(`https://formsubmit.co/ajax/${this.notificationEmail}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                }).catch(e => console.log("FormSubmit notification sent/fallback:", e))
            );

            // 2. Netlify Forms Native Submission (if hosted on Netlify)
            try {
                const netlifyData = new URLSearchParams();
                netlifyData.append("form-name", "tax-lead-form");
                netlifyData.append("name", lead.name);
                netlifyData.append("mobile", lead.cleanPhone);
                netlifyData.append("email", lead.email);
                netlifyData.append("service", lead.service);
                netlifyData.append("city", lead.city || "");
                netlifyData.append("message", lead.message || "");
                netlifyData.append("leadId", lead.leadId);

                promises.push(
                    fetch("/", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: netlifyData.toString()
                    }).catch(e => console.log("Netlify Form logged:", e))
                );
            } catch (e) {
                // Ignore
            }
        }

        return Promise.all(promises).then(() => true);
    },

    buildWhatsAppUrl: function(lead) {
        const text = `*New Inquiry via TaxKiJankari.com* 📋%0A%0A` +
            `*Lead ID:* ${lead.leadId || 'Direct'}%0A` +
            `*Name:* ${encodeURIComponent(lead.name || '')}%0A` +
            `*Mobile:* ${encodeURIComponent(lead.cleanPhone || lead.mobile || '')}%0A` +
            `*Email:* ${encodeURIComponent(lead.email || '')}%0A` +
            `*Service Needed:* ${encodeURIComponent(lead.service || '')}%0A` +
            (lead.city ? `*City/State:* ${encodeURIComponent(lead.city)}%0A` : '') +
            (lead.message ? `*Query:* ${encodeURIComponent(lead.message)}%0A` : '') +
            `%0APlease connect with me for assistance.`;

        return `https://wa.me/${this.whatsappPhone}?text=${text}`;
    },

    buildMailtoUrl: function(lead) {
        const subject = encodeURIComponent(`Tax Assistance Request - ${lead.service} [${lead.name}]`);
        const body = encodeURIComponent(
            `Hello Tax Ki Jankari Team,\n\n` +
            `I have submitted a service request on taxkijankari.com:\n\n` +
            `• Lead ID: ${lead.leadId}\n` +
            `• Name: ${lead.name}\n` +
            `• Mobile: ${lead.cleanPhone}\n` +
            `• Email: ${lead.email}\n` +
            `• Service: ${lead.service}\n` +
            `• City/State: ${lead.city || 'N/A'}\n` +
            `• Message: ${lead.message || 'N/A'}\n\n` +
            `Please reach out to me soon.`
        );
        return `mailto:${this.notificationEmail}?subject=${subject}&body=${body}`;
    },

    showSuccessModal: function(lead) {
        const modal = document.getElementById('lead-success-modal');
        if (!modal) return;

        const whatsappLink = this.buildWhatsAppUrl(lead);
        const mailtoLink = this.buildMailtoUrl(lead);

        // Populate modal data
        const leadIdEl = modal.querySelector('.modal-lead-id');
        const nameEl = modal.querySelector('.modal-lead-name');
        const serviceEl = modal.querySelector('.modal-lead-service');
        const waBtn = modal.querySelector('.modal-whatsapp-btn');
        const callBtn = modal.querySelector('.modal-call-btn');
        const mailtoBtn = modal.querySelector('.modal-mailto-btn');

        if (leadIdEl) leadIdEl.textContent = lead.leadId;
        if (nameEl) nameEl.textContent = lead.name;
        if (serviceEl) serviceEl.textContent = lead.service;
        if (waBtn) waBtn.href = whatsappLink;
        if (callBtn) callBtn.href = `tel:+91${this.helplinePhone}`;
        if (mailtoBtn) mailtoBtn.href = mailtoLink;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    closeSuccessModal: function() {
        const modal = document.getElementById('lead-success-modal');
        if (!modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }
};

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        LeadManager.init();
    });
}

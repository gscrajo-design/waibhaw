/**
 * Tax Ki Jankari (taxkijankari.com) - Core Application Controller
 * Handles SPA navigation, views, search, dynamic calendar, and calculator UI.
 */

const App = {
    currentRoute: 'home',

    init: function() {
        this.bindNavigation();
        this.renderServicesGrid();
        this.renderDueDates();
        this.renderTaxUpdates();
        this.renderFAQs();
        this.renderTestimonials();
        this.initCalculatorsUI();
        this.initMobileMenu();
        this.handleRoute();

        // Listen to hash changes
        window.addEventListener('hashchange', () => this.handleRoute());

        // Global Toast Notification Helper
        window.showToast = this.showToast;
    },

    bindNavigation: function() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.getAttribute('href');
                if (target.startsWith('#/service/')) {
                    e.preventDefault();
                    const serviceId = target.replace('#/service/', '');
                    this.openServiceModal(serviceId);
                    return;
                }
                // Normal view navigation
                const route = target.replace('#', '');
                if (['home', 'gst', 'itr', 'services', 'updates', 'faq', 'calculators', 'contact', 'privacy', 'terms', 'disclaimer'].includes(route)) {
                    // Handled by hashchange
                    this.closeMobileMenu();
                }
            });
        });
    },

    handleRoute: function() {
        let hash = window.location.hash.replace('#', '') || 'home';
        if (hash.startsWith('/service/')) {
            const serviceId = hash.replace('/service/', '');
            hash = 'services';
            this.openServiceModal(serviceId);
        }

        const validViews = ['home', 'gst', 'itr', 'services', 'updates', 'faq', 'calculators', 'contact', 'privacy', 'terms', 'disclaimer'];
        const activeView = validViews.includes(hash) ? hash : 'home';
        this.currentRoute = activeView;

        // Hide all views and show active
        document.querySelectorAll('.view-section').forEach(sec => {
            sec.classList.add('hidden');
        });

        const activeSec = document.getElementById(`view-${activeView}`);
        if (activeSec) {
            activeSec.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update active nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeView}` || (activeView === 'home' && href === '#')) {
                link.classList.add('text-saffron-600', 'font-bold', 'border-b-2', 'border-saffron-500');
                link.classList.remove('text-slate-700');
            } else {
                link.classList.remove('text-saffron-600', 'font-bold', 'border-b-2', 'border-saffron-500');
                link.classList.add('text-slate-700');
            }
        });
    },

    renderServicesGrid: function() {
        const container = document.getElementById('services-grid-container');
        const listContainer = document.getElementById('services-full-list-container');
        if (!TaxData.services) return;

        const htmlCards = TaxData.services.map(s => `
            <div class="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-xl bg-orange-50 text-saffron-600 flex items-center justify-center font-bold text-xl group-hover:bg-saffron-600 group-hover:text-white transition-colors">
                            <i data-lucide="${s.icon || 'file-text'}"></i>
                        </div>
                        <span class="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full border border-emerald-200">
                            ${s.badge}
                        </span>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 group-hover:text-saffron-600 transition-colors">${s.title}</h3>
                    <p class="text-xs text-saffron-700 font-medium mb-3">${s.hindiTitle}</p>
                    <p class="text-slate-600 text-sm leading-relaxed mb-4">${s.shortDesc}</p>
                    <ul class="space-y-2 mb-6">
                        ${s.features.slice(0, 3).map(f => `
                            <li class="flex items-start text-xs text-slate-700">
                                <svg class="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                <span>${f}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <span class="text-xs text-slate-400 block">Starting at</span>
                        <span class="text-lg font-extrabold text-navy-900">${s.priceDisplay}</span>
                    </div>
                    <button onclick="App.openServiceModal('${s.id}')" class="px-4 py-2 bg-slate-900 hover:bg-saffron-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1">
                        View Details & Apply
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
        `).join('');

        if (container) container.innerHTML = htmlCards;

        // Full services page view
        if (listContainer) {
            listContainer.innerHTML = TaxData.services.map((s, idx) => `
                <div class="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200 hover:border-saffron-300 transition-all mb-8">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        <div class="lg:col-span-2">
                            <div class="flex flex-wrap items-center gap-3 mb-2">
                                <span class="px-3 py-1 bg-saffron-50 text-saffron-700 font-bold text-xs rounded-full border border-saffron-200">
                                    Service #${idx + 1}
                                </span>
                                <span class="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full border border-emerald-200">
                                    ${s.badge}
                                </span>
                                <span class="text-xs text-slate-500 flex items-center gap-1">
                                    <i data-lucide="clock" class="w-3.5 h-3.5"></i> TAT: ${s.turnaround}
                                </span>
                            </div>
                            <h3 class="text-2xl font-extrabold text-slate-900 mb-1">${s.title}</h3>
                            <h4 class="text-sm font-semibold text-saffron-600 mb-3">${s.hindiTitle}</h4>
                            <p class="text-slate-600 text-sm leading-relaxed mb-6">${s.longDesc}</p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <h4 class="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        What's Included:
                                    </h4>
                                    <ul class="space-y-1.5">
                                        ${s.features.map(f => `
                                            <li class="text-xs text-slate-700 flex items-start">
                                                <span class="text-emerald-500 mr-1.5 font-bold">✓</span> ${f}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                                <div class="bg-amber-50/60 rounded-xl p-4 border border-amber-100">
                                    <h4 class="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        Documents Needed:
                                    </h4>
                                    <ul class="space-y-1.5">
                                        ${s.documents.map(d => `
                                            <li class="text-xs text-slate-700 flex items-start">
                                                <span class="text-amber-500 mr-1.5">•</span> ${d}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- Action Box -->
                        <div class="bg-gradient-to-br from-slate-900 to-navy-950 text-white rounded-xl p-6 flex flex-col justify-between">
                            <div>
                                <span class="text-xs text-slate-400 font-medium">Professional Assistance Fee</span>
                                <div class="text-3xl font-black text-saffron-400 mt-1 mb-2">${s.priceDisplay}</div>
                                <p class="text-xs text-slate-300 leading-relaxed mb-4">Transparent pricing, 100% online document collection, and dedicated consultant support.</p>
                                <div class="p-3 bg-white/10 rounded-lg text-xs text-slate-200 mb-6">
                                    <div class="font-semibold text-saffron-300 mb-0.5">Assistance Guarantee</div>
                                    Expert verification before submission on Govt portal to avoid rejections.
                                </div>
                            </div>
                            <div class="space-y-2.5">
                                <a href="https://wa.me/${TaxData.businessInfo.whatsapp}?text=${encodeURIComponent(s.whatsappMessage)}" target="_blank" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-md">
                                    <i data-lucide="message-circle" class="w-4 h-4"></i> Book via WhatsApp (${TaxData.businessInfo.phoneRaw})
                                </a>
                                <button onclick="App.openConsultationForService('${s.title}')" class="w-full py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-bold rounded-lg text-xs transition-colors">
                                    Request Callback Online
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        if (window.lucide) lucide.createIcons();
    },

    openServiceModal: function(serviceId) {
        const service = TaxData.services.find(s => s.id === serviceId);
        if (!service) return;

        const modal = document.getElementById('service-detail-modal');
        if (!modal) return;

        modal.querySelector('.service-modal-title').textContent = service.title;
        modal.querySelector('.service-modal-hindi').textContent = service.hindiTitle;
        modal.querySelector('.service-modal-desc').textContent = service.longDesc;
        modal.querySelector('.service-modal-price').textContent = service.priceDisplay;
        modal.querySelector('.service-modal-tat').textContent = service.turnaround;

        const featuresList = modal.querySelector('.service-modal-features');
        featuresList.innerHTML = service.features.map(f => `
            <li class="flex items-start text-xs text-slate-700">
                <span class="text-emerald-500 mr-2 font-bold">✓</span> ${f}
            </li>
        `).join('');

        const docsList = modal.querySelector('.service-modal-docs');
        docsList.innerHTML = service.documents.map(d => `
            <li class="flex items-start text-xs text-slate-700">
                <span class="text-amber-500 mr-2 font-bold">•</span> ${d}
            </li>
        `).join('');

        const waBtn = modal.querySelector('.service-modal-wa-btn');
        if (waBtn) {
            waBtn.href = `https://wa.me/${TaxData.businessInfo.whatsapp}?text=${encodeURIComponent(service.whatsappMessage)}`;
        }

        const applyBtn = modal.querySelector('.service-modal-apply-btn');
        if (applyBtn) {
            applyBtn.onclick = () => {
                this.closeServiceModal();
                this.openConsultationForService(service.title);
            };
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    closeServiceModal: function() {
        const modal = document.getElementById('service-detail-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    },

    openConsultationForService: function(serviceName) {
        window.location.hash = '#contact';
        setTimeout(() => {
            const selectEl = document.querySelector('select[name="service"]');
            if (selectEl) {
                for (let i = 0; i < selectEl.options.length; i++) {
                    if (selectEl.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) || 
                        serviceName.toLowerCase().includes(selectEl.options[i].text.toLowerCase())) {
                        selectEl.selectedIndex = i;
                        break;
                    }
                }
            }
            const contactSection = document.getElementById('contact-form-container');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                const nameInput = contactSection.querySelector('input[name="name"]');
                if (nameInput) nameInput.focus();
            }
        }, 100);
    },

    renderDueDates: function(filter = 'ALL') {
        const container = document.getElementById('due-dates-container');
        const tickerContainer = document.getElementById('due-dates-ticker');
        if (!TaxData.dueDates) return;

        let filtered = TaxData.dueDates;
        if (filter !== 'ALL') {
            filtered = TaxData.dueDates.filter(d => d.category === filter);
        }

        if (container) {
            container.innerHTML = filtered.map(d => `
                <div class="bg-white rounded-xl p-5 border border-slate-200 hover:border-saffron-400 transition-all shadow-sm">
                    <div class="flex items-center justify-between mb-3">
                        <span class="px-2.5 py-1 rounded-md text-xs font-bold ${d.badgeColor}">
                            ${d.category}
                        </span>
                        <span class="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <svg class="w-3.5 h-3.5 text-saffron-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            ${d.frequency}
                        </span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-base mb-1">${d.title}</h4>
                    <p class="text-xs text-slate-600 mb-4 leading-relaxed">${d.description}</p>
                    <div class="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                        <span class="text-xs text-slate-500 font-medium">Standard Due Date:</span>
                        <span class="text-xs font-extrabold text-saffron-700">${d.nextDate}</span>
                    </div>
                </div>
            `).join('');
        }

        // Ticker snippet for Home
        if (tickerContainer) {
            tickerContainer.innerHTML = TaxData.dueDates.slice(0, 4).map(d => `
                <div class="flex items-center space-x-3 bg-white/80 backdrop-blur px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm min-w-[280px]">
                    <span class="px-2 py-0.5 rounded text-[11px] font-bold ${d.badgeColor}">${d.category}</span>
                    <div class="text-left">
                        <div class="text-xs font-bold text-slate-900 truncate max-w-[170px]">${d.title}</div>
                        <div class="text-[11px] text-saffron-600 font-semibold">${d.nextDate}</div>
                    </div>
                </div>
            `).join('');
        }
    },

    filterDueDates: function(category, btn) {
        document.querySelectorAll('.due-date-filter-btn').forEach(b => {
            b.classList.remove('bg-navy-900', 'text-white');
            b.classList.add('bg-slate-100', 'text-slate-700');
        });
        if (btn) {
            btn.classList.add('bg-navy-900', 'text-white');
            btn.classList.remove('bg-slate-100', 'text-slate-700');
        }
        this.renderDueDates(category);
    },

    renderTaxUpdates: function() {
        const container = document.getElementById('tax-updates-container');
        if (!container || !TaxData.taxUpdates) return;

        container.innerHTML = TaxData.taxUpdates.map(u => `
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-saffron-300 transition-all mb-6">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1 bg-saffron-100 text-saffron-800 rounded-full text-xs font-bold">
                            ${u.category}
                        </span>
                        <span class="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-md text-[11px] font-bold">
                            ${u.tag}
                        </span>
                    </div>
                    <span class="text-xs text-slate-400 font-medium">${u.date}</span>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-2">${u.title}</h3>
                <p class="text-slate-600 text-sm leading-relaxed mb-4">${u.summary}</p>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Key Takeaways for Taxpayers:</h4>
                    <ul class="space-y-1.5">
                        ${u.highlights.map(h => `
                            <li class="text-xs text-slate-700 flex items-start">
                                <span class="text-saffron-500 mr-2 font-bold">👉</span> ${h}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    },

    renderFAQs: function(query = '') {
        const container = document.getElementById('faqs-container');
        if (!container || !TaxData.faqs) return;

        let filtered = TaxData.faqs;
        if (query.trim() !== '') {
            const qLower = query.toLowerCase();
            filtered = TaxData.faqs.filter(f => 
                f.q.toLowerCase().includes(qLower) || 
                f.a.toLowerCase().includes(qLower) ||
                f.category.toLowerCase().includes(qLower)
            );
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <p class="text-slate-500 text-sm">No FAQs found matching "${query}".</p>
                    <a href="#contact" class="inline-block mt-3 text-saffron-600 font-bold text-xs hover:underline">
                        Ask our Tax Experts Directly →
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map((f, idx) => `
            <div class="faq-item bg-white rounded-xl border border-slate-200 overflow-hidden mb-3.5 transition-all">
                <button type="button" onclick="App.toggleFaq(this)" class="w-full p-4 text-left font-bold text-slate-900 hover:text-saffron-600 flex items-center justify-between gap-4 transition-colors">
                    <span class="flex items-center gap-2.5 text-sm sm:text-base">
                        <span class="w-6 h-6 rounded-full bg-saffron-100 text-saffron-700 text-xs font-bold flex items-center justify-center flex-shrink-0">Q</span>
                        ${f.q}
                    </span>
                    <svg class="faq-icon w-5 h-5 text-slate-400 transform transition-transform duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div class="faq-answer hidden px-4 pb-4 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    ${f.a}
                </div>
            </div>
        `).join('');
    },

    toggleFaq: function(btn) {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        const isHidden = answer.classList.contains('hidden');

        // Close others in accordion
        document.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item) {
                other.querySelector('.faq-answer').classList.add('hidden');
                other.querySelector('.faq-icon').classList.remove('rotate-180');
            }
        });

        if (isHidden) {
            answer.classList.remove('hidden');
            icon.classList.add('rotate-180');
        } else {
            answer.classList.add('hidden');
            icon.classList.remove('rotate-180');
        }
    },

    renderTestimonials: function() {
        const container = document.getElementById('testimonials-container');
        if (!container || !TaxData.testimonials) return;

        container.innerHTML = TaxData.testimonials.map(t => `
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                    <div class="flex items-center space-x-1 text-amber-400 mb-3">
                        ${'★'.repeat(t.rating)}
                    </div>
                    <p class="text-slate-600 text-xs sm:text-sm leading-relaxed italic mb-4">"${t.comment}"</p>
                </div>
                <div class="pt-3 border-t border-slate-100 flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-saffron-100 text-saffron-800 font-bold flex items-center justify-center text-sm">
                        ${t.name.charAt(0)}
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-slate-900">${t.name}</h4>
                        <p class="text-[11px] text-slate-500">${t.role}</p>
                    </div>
                </div>
            </div>
        `).join('');
    },

    initCalculatorsUI: function() {
        // Income Tax Calculator UI
        const calcBtn = document.getElementById('calculate-tax-btn');
        const incomeInput = document.getElementById('calc-income');
        const salariedCheck = document.getElementById('calc-salaried');
        const ageSelect = document.getElementById('calc-age');
        
        const runTaxCalc = () => {
            const income = Number(incomeInput ? incomeInput.value : 0) || 0;
            const isSalaried = salariedCheck ? salariedCheck.checked : true;
            const age = ageSelect ? ageSelect.value : 'general';

            const deductions = {
                sec80C: document.getElementById('calc-80c')?.value || 0,
                sec80D: document.getElementById('calc-80d')?.value || 0,
                sec24b: document.getElementById('calc-24b')?.value || 0,
                hra: document.getElementById('calc-hra')?.value || 0,
                other: document.getElementById('calc-other')?.value || 0
            };

            const newRegime = TaxCalculator.calculateNewRegime(income, isSalaried);
            const oldRegime = TaxCalculator.calculateOldRegime(income, isSalaried, deductions, age);

            // Update New Regime Card
            document.getElementById('res-new-gross').textContent = TaxCalculator.formatINR(newRegime.grossIncome);
            document.getElementById('res-new-deductions').textContent = TaxCalculator.formatINR(newRegime.totalDeductions);
            document.getElementById('res-new-taxable').textContent = TaxCalculator.formatINR(newRegime.taxableIncome);
            document.getElementById('res-new-slabtax').textContent = TaxCalculator.formatINR(newRegime.slabTax);
            document.getElementById('res-new-rebate').textContent = TaxCalculator.formatINR(newRegime.rebate87A);
            document.getElementById('res-new-cess').textContent = TaxCalculator.formatINR(newRegime.cess);
            document.getElementById('res-new-total').textContent = TaxCalculator.formatINR(newRegime.totalTax);

            // Update Old Regime Card
            document.getElementById('res-old-gross').textContent = TaxCalculator.formatINR(oldRegime.grossIncome);
            document.getElementById('res-old-deductions').textContent = TaxCalculator.formatINR(oldRegime.totalDeductions);
            document.getElementById('res-old-taxable').textContent = TaxCalculator.formatINR(oldRegime.taxableIncome);
            document.getElementById('res-old-slabtax').textContent = TaxCalculator.formatINR(oldRegime.slabTax);
            document.getElementById('res-old-rebate').textContent = TaxCalculator.formatINR(oldRegime.rebate87A);
            document.getElementById('res-old-cess').textContent = TaxCalculator.formatINR(oldRegime.cess);
            document.getElementById('res-old-total').textContent = TaxCalculator.formatINR(oldRegime.totalTax);

            // Recommendation Banner
            const banner = document.getElementById('tax-recommendation-banner');
            if (banner) {
                const diff = Math.abs(newRegime.totalTax - oldRegime.totalTax);
                if (newRegime.totalTax < oldRegime.totalTax) {
                    banner.className = "p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900";
                    banner.innerHTML = `
                        <div class="flex items-center gap-2 font-bold text-sm">
                            <span class="text-emerald-600 text-lg">🎉</span> New Tax Regime is Better for You!
                        </div>
                        <p class="text-xs text-emerald-800 mt-1">You save <strong>${TaxCalculator.formatINR(diff)}</strong> in tax by opting for the New Tax Regime.</p>
                    `;
                } else if (oldRegime.totalTax < newRegime.totalTax) {
                    banner.className = "p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900";
                    banner.innerHTML = `
                        <div class="flex items-center gap-2 font-bold text-sm">
                            <span class="text-blue-600 text-lg">💡</span> Old Tax Regime is Better with Your Deductions!
                        </div>
                        <p class="text-xs text-blue-800 mt-1">You save <strong>${TaxCalculator.formatINR(diff)}</strong> in tax by claiming Chapter VI-A deductions under the Old Tax Regime.</p>
                    `;
                } else {
                    banner.className = "p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800";
                    banner.innerHTML = `
                        <div class="flex items-center gap-2 font-bold text-sm">
                            <span>⚖️</span> Both Regimes Result in Equal Tax (₹0 / Same)
                        </div>
                    `;
                }
            }
        };

        if (calcBtn) calcBtn.addEventListener('click', runTaxCalc);
        if (incomeInput) incomeInput.addEventListener('input', runTaxCalc);
        if (salariedCheck) salariedCheck.addEventListener('change', runTaxCalc);
        if (ageSelect) ageSelect.addEventListener('change', runTaxCalc);
        document.querySelectorAll('.income-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.income-preset-btn').forEach(b => {
                    b.classList.remove('bg-saffron-600', 'text-white');
                    b.classList.add('bg-slate-100', 'text-slate-800');
                });
                btn.classList.add('bg-saffron-600', 'text-white');
                btn.classList.remove('bg-slate-100', 'text-slate-800');
                const val = btn.getAttribute('data-income');
                if (incomeInput) {
                    incomeInput.value = val;
                    runTaxCalc();
                }
            });
        });

        // Trigger initial calculation
        runTaxCalc();

        // GST Calculator UI
        const gstAmountInput = document.getElementById('gst-amount');
        const gstCustomRate = document.getElementById('gst-custom-rate');
        let currentGstRate = 18;
        let currentGstMode = 'exclusive';

        const runGstCalc = () => {
            const amount = Number(gstAmountInput ? gstAmountInput.value : 10000) || 0;
            const res = TaxCalculator.calculateGST(amount, currentGstRate, currentGstMode);

            document.getElementById('gst-res-base').textContent = TaxCalculator.formatINR(res.baseAmount);
            document.getElementById('gst-res-tax').textContent = TaxCalculator.formatINR(res.gstAmount);
            document.getElementById('gst-res-total').textContent = TaxCalculator.formatINR(res.totalAmount);
            document.getElementById('gst-res-cgst').textContent = TaxCalculator.formatINR(res.cgst);
            document.getElementById('gst-res-sgst').textContent = TaxCalculator.formatINR(res.sgst);
            document.getElementById('gst-res-igst').textContent = TaxCalculator.formatINR(res.igst);
        };

        if (gstAmountInput) gstAmountInput.addEventListener('input', runGstCalc);

        // GST Rate Buttons
        document.querySelectorAll('.gst-rate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.gst-rate-btn').forEach(b => {
                    b.classList.remove('bg-saffron-600', 'text-white');
                    b.classList.add('bg-slate-100', 'text-slate-800');
                });
                btn.classList.add('bg-saffron-600', 'text-white');
                btn.classList.remove('bg-slate-100', 'text-slate-800');
                currentGstRate = Number(btn.getAttribute('data-rate'));
                if (gstCustomRate) gstCustomRate.value = '';
                runGstCalc();
            });
        });

        if (gstCustomRate) {
            gstCustomRate.addEventListener('input', () => {
                if (gstCustomRate.value !== '') {
                    currentGstRate = Number(gstCustomRate.value) || 0;
                    document.querySelectorAll('.gst-rate-btn').forEach(b => {
                        b.classList.remove('bg-saffron-600', 'text-white');
                        b.classList.add('bg-slate-100', 'text-slate-800');
                    });
                    runGstCalc();
                }
            });
        }

        // GST Mode Tabs
        const exclBtn = document.getElementById('gst-mode-exclusive');
        const inclBtn = document.getElementById('gst-mode-inclusive');
        if (exclBtn && inclBtn) {
            exclBtn.addEventListener('click', () => {
                currentGstMode = 'exclusive';
                exclBtn.classList.add('bg-navy-900', 'text-white');
                exclBtn.classList.remove('bg-slate-100', 'text-slate-700');
                inclBtn.classList.remove('bg-navy-900', 'text-white');
                inclBtn.classList.add('bg-slate-100', 'text-slate-700');
                runGstCalc();
            });
            inclBtn.addEventListener('click', () => {
                currentGstMode = 'inclusive';
                inclBtn.classList.add('bg-navy-900', 'text-white');
                inclBtn.classList.remove('bg-slate-100', 'text-slate-700');
                exclBtn.classList.remove('bg-navy-900', 'text-white');
                exclBtn.classList.add('bg-slate-100', 'text-slate-700');
                runGstCalc();
            });
        }

        // Run initial GST calc
        runGstCalc();
    },

    initMobileMenu: function() {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('mobile-nav-drawer');
        const closeBtn = document.getElementById('mobile-menu-close');
        const backdrop = document.getElementById('mobile-backdrop');

        if (toggleBtn && menu) {
            toggleBtn.addEventListener('click', () => {
                menu.classList.remove('-translate-x-full');
                if (backdrop) backdrop.classList.remove('hidden');
            });
        }

        if (closeBtn && menu) {
            closeBtn.addEventListener('click', () => this.closeMobileMenu());
        }

        if (backdrop) {
            backdrop.addEventListener('click', () => this.closeMobileMenu());
        }
    },

    closeMobileMenu: function() {
        const menu = document.getElementById('mobile-nav-drawer');
        const backdrop = document.getElementById('mobile-backdrop');
        if (menu) menu.classList.add('-translate-x-full');
        if (backdrop) backdrop.classList.add('hidden');
    },

    showToast: function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-20 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl text-white text-xs font-semibold flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0 ${
            type === 'error' ? 'bg-red-600' : 'bg-slate-900 border border-saffron-500'
        }`;
        toast.innerHTML = `
            <span>${type === 'error' ? '⚠️' : '✅'}</span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        }, 10);

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-4');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

/**
 * Tax Ki Jankari (taxkijankari.com) - Core Application Controller
 * Handles SPA navigation, views, search, dynamic calendar, and calculator UI.
 */

const App = {
    currentRoute: 'home',

    init: function() {
        try {
            this.initTheme();
            this.bindNavigation();
            this.initModals();
            this.initMobileMenu();
            this.renderServicesGrid();
            this.renderDueDates();
            this.renderTaxUpdates();
            this.renderFAQs();
            this.renderTestimonials();
            this.renderHsnList();
            this.initCalculatorsUI();
            this.initChatbot();
            this.renderAdminLogs();
            this.handleRoute();
        } catch (err) {
            console.warn("App initialization notice:", err);
            this.handleRoute();
        }

        // Listen to hash changes
        window.addEventListener('hashchange', () => this.handleRoute());

        // Global Toast Notification Helper
        window.showToast = this.showToast;
    },

    bindNavigation: function() {
        const self = this;
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const target = this.getAttribute('href');
                if (!target || target === '#') return;

                if (target.startsWith('#/service/')) {
                    e.preventDefault();
                    const serviceId = target.replace('#/service/', '');
                    self.showView('services');
                    self.openServiceModal(serviceId);
                    return;
                }

                // Normal view navigation
                const route = target.replace('#', '');
                const validViews = ['home', 'gst', 'itr', 'services', 'updates', 'faq', 'calculators', 'contact', 'privacy', 'terms', 'disclaimer', 'admin'];
                if (validViews.includes(route)) {
                    e.preventDefault();
                    window.location.hash = route;
                    self.showView(route);
                    self.closeMobileMenu();
                }
            });
        });
    },

    showView: function(viewName) {
        const validViews = ['home', 'gst', 'itr', 'services', 'updates', 'faq', 'calculators', 'contact', 'privacy', 'terms', 'disclaimer', 'admin'];
        const activeView = validViews.includes(viewName) ? viewName : 'home';
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

        if (window.lucide) {
            try { lucide.createIcons(); } catch(e) {}
        }
    },

    handleRoute: function() {
        let hash = window.location.hash.replace('#', '') || 'home';
        if (hash.startsWith('/service/')) {
            const serviceId = hash.replace('/service/', '');
            this.showView('services');
            this.openServiceModal(serviceId);
            return;
        }

        this.showView(hash);
    },

    initModals: function() {
        const self = this;

        // Service modal close on backdrop click
        const serviceModal = document.getElementById('service-detail-modal');
        if (serviceModal) {
            serviceModal.addEventListener('click', function(e) {
                if (e.target === serviceModal) {
                    self.closeServiceModal();
                }
            });
        }

        // Close buttons for service modal
        document.querySelectorAll('.close-service-modal-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                self.closeServiceModal();
            });
        });

        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                self.closeServiceModal();
                if (window.LeadManager) window.LeadManager.closeSuccessModal();
                self.closeMobileMenu();
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
                                <button onclick="App.openConsultationForService('${s.title}')" class="w-full py-3 bg-saffron-600 hover:bg-saffron-700 text-white font-bold rounded-lg text-xs transition-colors shadow-md flex items-center justify-center gap-2">
                                    <i data-lucide="send" class="w-4 h-4"></i> Request Service Online
                                </button>
                                <a href="mailto:gsc@taxkijankari.com?subject=Tax Inquiry: ${encodeURIComponent(s.title)}" class="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/20">
                                    <i data-lucide="mail" class="w-4 h-4 text-saffron-400"></i> Email Inquiry Desk
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        if (window.lucide) {
            try { lucide.createIcons(); } catch(e) {}
        }
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

        const emailBtn = modal.querySelector('.service-modal-email-btn');
        if (emailBtn) {
            emailBtn.href = `mailto:gsc@taxkijankari.com?subject=Tax Inquiry: ${encodeURIComponent(service.title)}`;
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

            const getVal = function(id) {
                const el = document.getElementById(id);
                return el ? el.value : 0;
            };

            const deductions = {
                sec80C: getVal('calc-80c'),
                sec80D: getVal('calc-80d'),
                sec24b: getVal('calc-24b'),
                hra: getVal('calc-hra'),
                other: getVal('calc-other')
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

    // ==========================================
    // THEME SWITCHER ENGINE (LIGHT / DARK)
    // ==========================================
    currentTheme: 'light',

    initTheme: function() {
        const saved = localStorage.getItem('tkj_theme');
        if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }
    },

    setTheme: function(theme) {
        this.currentTheme = theme;
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try { localStorage.setItem('tkj_theme', theme); } catch(e) {}
        this.updateThemeIcons();
    },

    toggleTheme: function() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.showToast(newTheme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
    },

    updateThemeIcons: function() {
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            const isDark = this.currentTheme === 'dark';
            btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
            btn.innerHTML = isDark 
                ? '<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
                : '<svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
        });
    },

    // ==========================================
    // GST HSN & SAC FINDER ENGINE
    // ==========================================
    hsnCurrentType: 'all',
    hsnCurrentRate: 'all',
    hsnCurrentSearch: '',

    renderHsnList: function() {
        const container = document.getElementById('hsn-results-container');
        const countBadge = document.getElementById('hsn-count-badge');
        if (!container || !TaxData.hsnCodes) return;

        let list = TaxData.hsnCodes;

        // Type filter
        if (this.hsnCurrentType !== 'all') {
            list = list.filter(item => item.type === this.hsnCurrentType);
        }

        // Rate filter
        if (this.hsnCurrentRate !== 'all') {
            const numRate = Number(this.hsnCurrentRate);
            list = list.filter(item => item.rate === numRate);
        }

        // Search query
        if (this.hsnCurrentSearch.trim() !== '') {
            const q = this.hsnCurrentSearch.toLowerCase().trim();
            list = list.filter(item => 
                item.code.toLowerCase().includes(q) ||
                item.title.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q) ||
                item.desc.toLowerCase().includes(q) ||
                (item.keywords && item.keywords.toLowerCase().includes(q))
            );
        }

        if (countBadge) countBadge.textContent = `${list.length} Records Found`;

        if (list.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
                    <div class="text-3xl mb-2">🔍</div>
                    <h4 class="font-bold text-slate-800 text-sm">No HSN / SAC Codes Found</h4>
                    <p class="text-xs text-slate-500 mt-1">Try searching with other keywords (e.g. mobile, cloth, software) or reset filters.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = list.map(item => `
            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-saffron-300 transition-all flex flex-col justify-between group">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            item.type === 'services' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-saffron-800'
                        }">
                            ${item.type === 'services' ? 'SAC (Service)' : 'HSN (Goods)'}
                        </span>
                        <span class="px-2.5 py-0.5 rounded-md text-xs font-black ${
                            item.rate === 0 ? 'bg-emerald-100 text-emerald-800' :
                            item.rate <= 5 ? 'bg-blue-100 text-blue-800' :
                            item.rate <= 12 ? 'bg-indigo-100 text-indigo-800' :
                            item.rate <= 18 ? 'bg-saffron-100 text-saffron-800' : 'bg-red-100 text-red-800'
                        }">
                            ${item.rate}% GST
                        </span>
                    </div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="font-mono text-lg font-black text-navy-950">${item.code}</span>
                        <button type="button" onclick="App.copyHsnCode('${item.code}', this)" class="p-1 rounded text-slate-400 hover:text-saffron-600 hover:bg-slate-100 transition-colors" title="Copy Code">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </button>
                    </div>
                    <h4 class="font-bold text-slate-900 text-sm mb-1">${item.title}</h4>
                    <p class="text-[11px] text-slate-500 mb-3 line-clamp-2">${item.desc}</p>
                </div>
                <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">${item.category}</span>
                    <button type="button" onclick="App.useHsnInCalc(${item.rate})" class="text-[11px] font-bold text-saffron-600 hover:text-saffron-700 flex items-center gap-1">
                        Calc GST <span>→</span>
                    </button>
                </div>
            </div>
        `).join('');
    },

    filterHsnType: function(type, btn) {
        this.hsnCurrentType = type;
        document.querySelectorAll('.hsn-type-btn').forEach(b => {
            b.classList.remove('bg-navy-900', 'text-white');
            b.classList.add('bg-slate-100', 'text-slate-700');
        });
        if (btn) {
            btn.classList.add('bg-navy-900', 'text-white');
            btn.classList.remove('bg-slate-100', 'text-slate-700');
        }
        this.renderHsnList();
    },

    filterHsnRate: function(rate, btn) {
        this.hsnCurrentRate = rate;
        document.querySelectorAll('.hsn-rate-filter-btn').forEach(b => {
            b.classList.remove('bg-saffron-600', 'text-white');
            b.classList.add('bg-slate-100', 'text-slate-700');
        });
        if (btn) {
            btn.classList.add('bg-saffron-600', 'text-white');
            btn.classList.remove('bg-slate-100', 'text-slate-700');
        }
        this.renderHsnList();
    },

    searchHsn: function(query) {
        this.hsnCurrentSearch = query;
        this.renderHsnList();
    },

    copyHsnCode: function(code, btn) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code).then(() => {
                this.showToast(`HSN Code ${code} copied!`);
                if (btn) {
                    const original = btn.innerHTML;
                    btn.innerHTML = '<span class="text-emerald-600 text-xs font-bold">✓</span>';
                    setTimeout(() => btn.innerHTML = original, 1500);
                }
            });
        }
    },

    useHsnInCalc: function(rate) {
        this.showView('calculators');
        setTimeout(() => {
            const rateBtn = document.querySelector(`.gst-rate-btn[data-rate="${rate}"]`);
            if (rateBtn) {
                rateBtn.click();
            } else {
                const customRate = document.getElementById('gst-custom-rate');
                if (customRate) {
                    customRate.value = rate;
                    customRate.dispatchEvent(new Event('input'));
                }
            }
            window.scrollTo({ top: 500, behavior: 'smooth' });
        }, 150);
    },

    // ==========================================
    // AI TAX ASSISTANT CHATBOT ("TAX MITRA")
    // ==========================================
    initChatbot: function() {
        const toggleBtn = document.getElementById('tax-chatbot-toggle');
        const closeBtn = document.getElementById('tax-chatbot-close');
        const sendBtn = document.getElementById('tax-chatbot-send');
        const inputEl = document.getElementById('tax-chatbot-input');
        const clearBtn = document.getElementById('tax-chatbot-clear');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleChatbot());
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggleChatbot(false));
        }
        if (sendBtn && inputEl) {
            sendBtn.addEventListener('click', () => {
                const text = inputEl.value.trim();
                if (text) {
                    this.sendChatMessage(text);
                    inputEl.value = '';
                }
            });
        }
        if (inputEl) {
            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const text = inputEl.value.trim();
                    if (text) {
                        this.sendChatMessage(text);
                        inputEl.value = '';
                    }
                }
            });
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearChat());
        }

        // Quick prompt chips
        document.querySelectorAll('.chat-prompt-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const text = pill.getAttribute('data-prompt') || pill.textContent.trim();
                this.sendChatMessage(text);
            });
        });
    },

    toggleChatbot: function(forceState) {
        const win = document.getElementById('tax-chatbot-window');
        if (!win) return;
        if (forceState === false) {
            win.classList.add('hidden');
        } else if (forceState === true) {
            win.classList.remove('hidden');
        } else {
            win.classList.toggle('hidden');
        }
    },

    sendChatMessage: function(query) {
        const messagesContainer = document.getElementById('tax-chatbot-messages');
        if (!messagesContainer) return;

        // Escape helper
        const safeQuery = query.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));

        // Add user bubble
        const userMsg = document.createElement('div');
        userMsg.className = 'flex justify-end mb-3';
        userMsg.innerHTML = `
            <div class="chat-bubble-user max-w-[80%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm">
                ${safeQuery}
            </div>
        `;
        messagesContainer.appendChild(userMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Find Bot response from knowledge base
        const botResponse = this.findBotResponse(query);

        // Record chat log to Admin Inbox Storage
        this.recordChatLog(query, botResponse);

        // Simulate typing animation
        const typingEl = document.createElement('div');
        typingEl.className = 'flex justify-start mb-3 chat-typing-indicator';
        typingEl.innerHTML = `
            <div class="chat-bubble-bot px-4 py-2.5 rounded-2xl text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-saffron-500 animate-bounce"></span>
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-saffron-500 animate-bounce" style="animation-delay: 0.15s"></span>
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-saffron-500 animate-bounce" style="animation-delay: 0.3s"></span>
                <span>Tax Mitra typing...</span>
            </div>
        `;
        messagesContainer.appendChild(typingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        setTimeout(() => {
            typingEl.remove();
            const botMsg = document.createElement('div');
            botMsg.className = 'flex justify-start mb-3';
            botMsg.innerHTML = `
                <div class="chat-bubble-bot max-w-[88%] px-4 py-3 rounded-2xl text-xs leading-relaxed border border-slate-200/50 shadow-sm">
                    <div>${botResponse}</div>

                    <!-- Live Human Consultation Option (Yes / No Prompt) -->
                    <div class="mt-3.5 pt-2.5 border-t border-slate-200/70">
                        <div class="p-2.5 rounded-xl bg-orange-50/90 border border-saffron-200 text-navy-950 space-y-2">
                            <div class="text-[11px] font-extrabold flex items-center gap-1.5 text-navy-900">
                                <span>👨‍💼</span> Kya aap hamare Live Tax Expert (Human) se seedha baat karna chahte hain?
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button type="button" onclick="App.connectToTawkLive(true)" class="flex-1 py-1.5 px-2 bg-gradient-saffron hover:opacity-95 text-white font-bold rounded-lg text-[10px] shadow-sm flex items-center justify-center gap-1 transition-transform active:scale-95">
                                    ✅ Haan (Live Chat - Tawk.to)
                                </button>
                                <button type="button" onclick="App.connectToTawkLive(false, this)" class="py-1.5 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold rounded-lg text-[10px] transition-colors">
                                    ❌ Nahi (Tax Mitra Se Hi Baat Karein)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(botMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 400);
    },

    connectToTawkLive: function(isLive, btnEl) {
        const messagesContainer = document.getElementById('tax-chatbot-messages');
        if (!messagesContainer) return;

        if (isLive) {
            // Visitor clicked YES -> Connect to Tawk.to
            const connectMsg = document.createElement('div');
            connectMsg.className = 'flex justify-start mb-3 animate-in fade-in';
            connectMsg.innerHTML = `
                <div class="chat-bubble-bot max-w-[88%] px-4 py-3 rounded-2xl text-xs leading-relaxed bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-sm">
                    <div class="font-extrabold flex items-center gap-1.5 mb-1">
                        <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>Connecting to Live Tax Expert on Tawk.to...</span>
                    </div>
                    <p class="text-[11px] leading-relaxed mb-2.5">
                        Aapko hamare <strong>Live Human Tax Consultant</strong> se joda ja raha hai. Please 1 second wait karein...
                    </p>
                    <div class="flex items-center gap-2">
                        <button type="button" onclick="App.triggerTawkMaximize()" class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shadow transition-colors">
                            Open Tawk.to Live Window 💬
                        </button>
                        <button type="button" onclick="App.openChatLeadPrompt('Live Consultation Request')" class="px-2.5 py-1.5 bg-white border border-emerald-300 text-emerald-800 font-bold rounded-lg text-[10px] hover:bg-emerald-50 transition-colors">
                            Leave Contact Details 📝
                        </button>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(connectMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Trigger Tawk.to live chat window
            setTimeout(() => {
                this.triggerTawkMaximize();
            }, 600);

        } else {
            // Visitor clicked NO -> Continue with Tax Mitra
            if (btnEl) {
                const parentBox = btnEl.closest('.bg-orange-50\\/90') || btnEl.parentElement.parentElement;
                if (parentBox) {
                    parentBox.innerHTML = `
                        <div class="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5">
                            <span>👌</span> Theek hai! Tax Mitra aapki sahayata ke liye hazir hai. GST, ITR ya kisi bhi naye tax topic par sawal poochiye!
                        </div>
                    `;
                }
            }
        }
    },

    triggerTawkMaximize: function() {
        if (typeof window.Tawk_API !== 'undefined') {
            try {
                if (typeof window.Tawk_API.showWidget === 'function') {
                    window.Tawk_API.showWidget();
                }
                if (typeof window.Tawk_API.maximize === 'function') {
                    window.Tawk_API.maximize();
                    this.toggleChatbot(false);
                    return;
                }
            } catch(e) {
                console.warn("Tawk maximize error:", e);
            }
        }
        
        // If Tawk hasn't loaded yet
        this.showToast('Connecting to Live Chat Agent...');
    },

    recordChatLog: function(userQuery, botReply) {
        try {
            const logs = JSON.parse(localStorage.getItem('tkj_visitor_chats') || '[]');
            logs.unshift({
                id: 'CHAT-' + Date.now().toString().slice(-6),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                date: new Date().toLocaleDateString(),
                timestamp: Date.now(),
                query: userQuery,
                reply: typeof botReply === 'string' ? botReply.replace(/<[^>]*>?/gm, ' ') : ''
            });
            // Keep last 100 messages
            if (logs.length > 100) logs.pop();
            localStorage.setItem('tkj_visitor_chats', JSON.stringify(logs));
            this.renderAdminLogs();
        } catch (e) {
            console.warn("Storage notice:", e);
        }
    },

    openChatLeadPrompt: function(encodedQuery) {
        const query = decodeURIComponent(encodedQuery);
        const messagesContainer = document.getElementById('tax-chatbot-messages');
        if (!messagesContainer) return;

        const safeQuery = query.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));

        const promptBox = document.createElement('div');
        promptBox.className = 'flex justify-start mb-3 animate-in fade-in';
        promptBox.innerHTML = `
            <div class="chat-bubble-bot w-[92%] p-3.5 rounded-2xl text-xs bg-orange-50 border border-saffron-300 shadow-md">
                <div class="font-extrabold text-navy-950 mb-1 flex items-center gap-1.5">
                    <span>📩</span> Direct Consultation Desk Forwarding
                </div>
                <p class="text-[11px] text-slate-600 mb-2.5">
                    Aapka question hamare tax expert (<strong class="text-saffron-700">gsc@taxkijankari.com</strong>) ko directly bhej diya jayega:
                </p>
                <div class="space-y-2 mb-2.5">
                    <input type="text" id="chat-lead-name" placeholder="Aapka Name (Your Name)" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-medium focus:ring-1 focus:ring-saffron-500">
                    <input type="text" id="chat-lead-contact" placeholder="Email ya Mobile Number" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-medium focus:ring-1 focus:ring-saffron-500">
                    <textarea id="chat-lead-msg" rows="2" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-medium focus:ring-1 focus:ring-saffron-500" placeholder="Aapka Sawal / Detail">${safeQuery}</textarea>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" onclick="App.submitChatLead(this)" class="flex-1 py-2 bg-gradient-saffron hover:opacity-95 text-white font-bold rounded-lg text-xs shadow text-center">
                        Send Message to Admin (भेजें)
                    </button>
                    <button type="button" onclick="this.closest('.animate-in').remove()" class="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        messagesContainer.appendChild(promptBox);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    submitChatLead: function(btn) {
        const nameEl = document.getElementById('chat-lead-name');
        const contactEl = document.getElementById('chat-lead-contact');
        const msgEl = document.getElementById('chat-lead-msg');

        const name = nameEl ? nameEl.value.trim() : 'Website Visitor';
        const contact = contactEl ? contactEl.value.trim() : '';
        const msg = msgEl ? msgEl.value.trim() : '';

        if (!contact) {
            alert('Kripya apna email ya phone number darj karein taaki hum aapse contact kar sakein.');
            if (contactEl) contactEl.focus();
            return;
        }

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = 'Sending query...';
        }

        const inquiryData = {
            id: 'LEAD-' + Date.now().toString().slice(-6),
            name: name,
            contact: contact,
            query: msg,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            source: 'Tax Mitra AI Chatbot'
        };

        // 1. Save to local storage for Admin Logs
        try {
            const leads = JSON.parse(localStorage.getItem('tkj_admin_inquiries') || '[]');
            leads.unshift(inquiryData);
            localStorage.setItem('tkj_admin_inquiries', JSON.stringify(leads));
        } catch(e) {}

        // 2. Dispatch via FormSubmit AJAX API to gsc@taxkijankari.com
        fetch('https://formsubmit.co/ajax/gsc@taxkijankari.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `New Visitor Inquiry from Tax Mitra AI: ${name}`,
                Name: name,
                Contact: contact,
                Message: msg,
                Time: new Date().toLocaleString(),
                Platform: 'taxkijankari.com'
            })
        }).catch(err => {
            console.warn("API Dispatch note:", err);
        });

        // 3. Update Chat UI
        const container = btn.closest('.animate-in');
        if (container) {
            container.innerHTML = `
                <div class="chat-bubble-bot w-[92%] p-3.5 rounded-2xl text-xs bg-emerald-50 border border-emerald-300 shadow">
                    <div class="font-extrabold text-emerald-900 mb-1 flex items-center gap-1.5">
                        <span>✅</span> Query Sent to Admin / Tax Desk!
                    </div>
                    <p class="text-[11px] text-emerald-800 leading-relaxed mb-2">
                        Dhanyawad <strong>${name}</strong>! Aapka question desk (<strong class="underline">gsc@taxkijankari.com</strong>) ko dispatch kar diya gaya hai. Ref ID: <strong>${inquiryData.id}</strong>.
                    </p>
                    <a href="mailto:gsc@taxkijankari.com?subject=Inquiry Ref ${inquiryData.id}&body=Name: ${encodeURIComponent(name)}%0D%0AContact: ${encodeURIComponent(contact)}%0D%0AQuestion: ${encodeURIComponent(msg)}" class="inline-block px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors">
                        Direct Email Send karein ✉️
                    </a>
                </div>
            `;
        }

        this.showToast('Query successfully sent to Admin & recorded in logs!');
        this.renderAdminLogs();
    },

    findBotResponse: function(query) {
        const q = query.toLowerCase();
        if (!TaxData.chatbotKnowledge) {
            return "Hello! How can I assist you with your GST, ITR, or tax filing questions today?";
        }

        // Match against knowledge base
        for (let i = 0; i < TaxData.chatbotKnowledge.length; i++) {
            const item = TaxData.chatbotKnowledge[i];
            for (let j = 0; j < item.keywords.length; j++) {
                if (q.includes(item.keywords[j].toLowerCase())) {
                    return item.answer;
                }
            }
        }

        // Default intelligent fallback
        return `
            <strong>Thanks for your question!</strong><br>
            I can help you with:<br>
            • <a href="#calculators" class="text-saffron-600 font-bold underline">Income Tax Old vs New Calculator</a><br>
            • <a href="#view-gst" class="text-saffron-600 font-bold underline">GST HSN Code & Rate Finder</a><br>
            • <a href="#updates" class="text-saffron-600 font-bold underline">Statutory Return Due Dates</a><br>
            • <a href="#services" class="text-saffron-600 font-bold underline">Paid Filing Services (GST/ITR)</a><br><br>
            For personalized assistance, send your query to <a href="mailto:gsc@taxkijankari.com" class="text-saffron-600 font-bold">gsc@taxkijankari.com</a> or <a href="#contact" class="text-saffron-600 font-bold underline">Submit Inquiry Online</a>.
        `;
    },

    clearChat: function() {
        const messagesContainer = document.getElementById('tax-chatbot-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="flex justify-start mb-3">
                    <div class="chat-bubble-bot max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed border border-slate-200/50 shadow-sm">
                        👋 <strong>Namaste! Main hoon Tax Mitra.</strong><br>
                        Aapka AI Tax & Compliance Assistant. GST, ITR, HSN codes ya tax slabs ke baare me koi bhi sawal poochiye!
                    </div>
                </div>
            `;
        }
    },

    // ==========================================
    // ADMIN CHAT & INQUIRY VIEWER
    // ==========================================
    renderAdminLogs: function() {
        const chatLogsContainer = document.getElementById('admin-chat-logs-container');
        const inquiryLogsContainer = document.getElementById('admin-inquiry-logs-container');
        const chatCountBadge = document.getElementById('admin-chat-count');
        const inquiryCountBadge = document.getElementById('admin-inquiry-count');

        const chats = JSON.parse(localStorage.getItem('tkj_visitor_chats') || '[]');
        const inquiries = JSON.parse(localStorage.getItem('tkj_admin_inquiries') || '[]');

        if (chatCountBadge) chatCountBadge.textContent = `${chats.length} Visitor Chats`;
        if (inquiryCountBadge) inquiryCountBadge.textContent = `${inquiries.length} Forwarded Inquiries`;

        // Render Inquiries
        if (inquiryLogsContainer) {
            if (inquiries.length === 0) {
                inquiryLogsContainer.innerHTML = `
                    <div class="text-center py-8 text-slate-400 text-xs">
                        No forwarded inquiries yet. Messages sent via chatbot or contact form will appear here.
                    </div>
                `;
            } else {
                inquiryLogsContainer.innerHTML = inquiries.map((item, idx) => `
                    <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-saffron-400 transition-all space-y-2">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded bg-saffron-100 text-saffron-800 text-[10px] font-bold">${item.id || 'LEAD'}</span>
                                <strong class="text-xs font-bold text-navy-950">${item.name || 'Visitor'}</strong>
                            </div>
                            <span class="text-[10px] text-slate-400">${item.date} ${item.time}</span>
                        </div>
                        <div class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <strong>Contact:</strong> <span class="text-saffron-700 font-bold">${item.contact}</span><br>
                            <strong>Message:</strong> ${item.query || item.message || '-'}
                        </div>
                        <div class="flex items-center justify-between pt-1 text-[11px]">
                            <span class="text-[10px] text-slate-400">Source: ${item.source || 'Website'}</span>
                            <a href="mailto:${item.contact.includes('@') ? item.contact : 'gsc@taxkijankari.com'}?subject=Re: Tax Consultation Inquiry ${item.id}" class="text-saffron-600 hover:text-saffron-700 font-bold">
                                Reply via Email →
                            </a>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Render Visitor Chats
        if (chatLogsContainer) {
            if (chats.length === 0) {
                chatLogsContainer.innerHTML = `
                    <div class="text-center py-8 text-slate-400 text-xs">
                        No visitor chat history yet. When someone asks Tax Mitra a question, it will be logged here live!
                    </div>
                `;
            } else {
                chatLogsContainer.innerHTML = chats.map((chat, idx) => `
                    <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-1.5">
                        <div class="flex items-center justify-between text-[11px]">
                            <span class="font-bold text-navy-900 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Visitor Question #${chats.length - idx}
                            </span>
                            <span class="text-[10px] text-slate-400">${chat.date} ${chat.time}</span>
                        </div>
                        <div class="text-xs font-semibold text-slate-800 bg-white p-2 rounded-lg border border-slate-200/80">
                            💬 "${chat.query}"
                        </div>
                        <div class="text-[11px] text-slate-500 line-clamp-2">
                            🤖 <strong>Bot Response:</strong> ${chat.reply}
                        </div>
                    </div>
                `).join('');
            }
        }
    },

    clearAdminLogs: function() {
        if (confirm('Are you sure you want to clear all stored chat logs and inquiries on this device?')) {
            localStorage.removeItem('tkj_visitor_chats');
            localStorage.removeItem('tkj_admin_inquiries');
            this.renderAdminLogs();
            this.showToast('Admin logs cleared successfully.');
        }
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

if (typeof window !== 'undefined') {
    window.App = App;
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

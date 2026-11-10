/**
 * Tax Ki Jankari (taxkijankari.com) - Interactive Tax Calculators
 * 1. Income Tax Calculator (Old vs New Tax Regime Comparison for FY 2026-27 / AY 2027-28)
 * 2. GST Calculator (Exclusive & Inclusive with CGST/SGST/IGST breakdown)
 */

const TaxCalculator = {
    // Format currency in Indian numbering system
    formatINR: function(amount) {
        if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Math.round(amount));
    },

    /**
     * Compute Income Tax under New Tax Regime
     * Financial Year 2026-27 (Assessment Year 2027-28)
     * 
     * Slabs:
     * - Up to ₹4,00,000: Nil (0%)
     * - ₹4,00,001 - ₹8,00,000: 5%
     * - ₹8,00,001 - ₹12,00,000: 10%
     * - ₹12,00,001 - ₹16,00,000: 15%
     * - ₹16,00,001 - ₹20,00,000: 20%
     * - ₹20,00,001 - ₹24,00,000: 25%
     * - Above ₹24,00,000: 30%
     * 
     * Standard Deduction: ₹75,000 for salaried & pensioners
     * Section 87A Rebate: 100% rebate (max ₹60,000) for taxable income up to ₹12,00,000
     * Marginal Relief u/s 87A: Tax before cess cannot exceed (Taxable Income - ₹12,00,000)
     */
    calculateNewRegime: function(grossIncome, isSalaried, opts) {
        grossIncome = Math.max(0, Number(grossIncome) || 0);
        opts = opts || {};

        // Standard deduction: ₹75,000 for salaried/pensioners (capped at gross income)
        const standardDeduction = isSalaried ? Math.min(grossIncome, 75000) : 0;
        const taxableIncome = Math.max(0, grossIncome - standardDeduction);

        // Slab calculation
        let slabTax = 0;
        if (taxableIncome <= 400000) {
            slabTax = 0;
        } else if (taxableIncome <= 800000) {
            slabTax = (taxableIncome - 400000) * 0.05;
        } else if (taxableIncome <= 1200000) {
            slabTax = 20000 + (taxableIncome - 800000) * 0.10;
        } else if (taxableIncome <= 1600000) {
            slabTax = 60000 + (taxableIncome - 1200000) * 0.15;
        } else if (taxableIncome <= 2000000) {
            slabTax = 120000 + (taxableIncome - 1600000) * 0.20;
        } else if (taxableIncome <= 2400000) {
            slabTax = 200000 + (taxableIncome - 2000000) * 0.25;
        } else {
            slabTax = 300000 + (taxableIncome - 2400000) * 0.30;
        }

        // Section 87A Rebate & Marginal Relief
        let rebate87A = 0;
        let netSlabTax = slabTax;

        if (taxableIncome <= 1200000) {
            // Full rebate up to ₹60,000 (tax becomes 0)
            rebate87A = slabTax;
            netSlabTax = 0;
        } else {
            // Marginal relief for taxable income exceeding ₹12,00,000
            // Tax payable before cess shall not exceed the excess of taxable income over ₹12,00,000
            const excessIncome = taxableIncome - 1200000;
            if (slabTax > excessIncome) {
                rebate87A = slabTax - excessIncome;
                netSlabTax = excessIncome;
            } else {
                rebate87A = 0;
                netSlabTax = slabTax;
            }
        }

        // Surcharge & Surcharge Marginal Relief (New Regime)
        // Thresholds: >50L: 10%, >1Cr: 15%, >2Cr: 25% (max rate under New Regime)
        const surchargeInfo = this._calculateSurchargeNewRegime(taxableIncome, netSlabTax);
        const surcharge = surchargeInfo.surcharge;

        // Health & Education Cess: 4% on (Tax after rebate + Surcharge)
        const cess = (netSlabTax + surcharge) * 0.04;
        const totalTax = netSlabTax + surcharge + cess;

        return {
            regime: "New Tax Regime",
            financialYear: "FY 2026-27 (AY 2027-28)",
            grossIncome: grossIncome,
            standardDeduction: standardDeduction,
            otherDeductions: 0,
            totalDeductions: standardDeduction,
            taxableIncome: taxableIncome,
            slabTax: Math.round(slabTax),
            rebate87A: Math.round(rebate87A),
            netSlabTax: Math.round(netSlabTax),
            surcharge: Math.round(surcharge),
            surchargeRelief: Math.round(surchargeInfo.marginalRelief),
            cess: Math.round(cess),
            totalTax: Math.round(totalTax)
        };
    },

    /**
     * Compute Income Tax under Old Tax Regime
     * Financial Year 2026-27 (Assessment Year 2027-28)
     * 
     * Slabs:
     * - General (<60 yrs): 0-2.5L: Nil, 2.5L-5L: 5%, 5L-10L: 20%, Above 10L: 30%
     * - Senior (60 to <80 yrs): 0-3L: Nil, 3L-5L: 5%, 5L-10L: 20%, Above 10L: 30%
     * - Super Senior (80+ yrs): 0-5L: Nil, 5L-10L: 20%, Above 10L: 30%
     * 
     * Standard Deduction: ₹50,000 for salaried & pensioners
     * Deductions: 80C (max 1.5L), 80D (max 75k general / 1L senior), 24b (max 2L), HRA, Other
     * Section 87A Rebate: Max ₹12,500 for taxable income up to ₹5,00,000
     */
    calculateOldRegime: function(grossIncome, isSalaried, deductions, ageGroup, opts) {
        grossIncome = Math.max(0, Number(grossIncome) || 0);
        deductions = deductions || {};
        ageGroup = ageGroup || 'general';
        opts = opts || {};

        // Standard deduction: ₹50,000 for salaried/pensioners (capped at gross income)
        const standardDeduction = isSalaried ? Math.min(grossIncome, 50000) : 0;

        // Deductions under Chapter VI-A & Section 24(b)
        const sec80C = Math.min(150000, Math.max(0, Number(deductions.sec80C) || 0));
        const max80D = (ageGroup === 'senior' || ageGroup === 'super-senior') ? 100000 : 75000;
        const sec80D = Math.min(max80D, Math.max(0, Number(deductions.sec80D) || 0));
        const sec24b = Math.min(200000, Math.max(0, Number(deductions.sec24b) || 0));
        const hra = Math.max(0, Number(deductions.hra) || 0);
        const otherDeductions = Math.max(0, Number(deductions.other) || 0);

        const totalEligibleDeductions = standardDeduction + sec80C + sec80D + sec24b + hra + otherDeductions;
        const taxableIncome = Math.max(0, grossIncome - totalEligibleDeductions);

        let exemptionLimit = 250000;
        if (ageGroup === 'senior') exemptionLimit = 300000;
        if (ageGroup === 'super-senior') exemptionLimit = 500000;

        let slabTax = 0;
        if (taxableIncome <= exemptionLimit) {
            slabTax = 0;
        } else if (taxableIncome <= 500000) {
            slabTax = (taxableIncome - exemptionLimit) * 0.05;
        } else if (taxableIncome <= 1000000) {
            slabTax = ((500000 - exemptionLimit) * 0.05) + ((taxableIncome - 500000) * 0.20);
        } else {
            slabTax = ((500000 - exemptionLimit) * 0.05) + (500000 * 0.20) + ((taxableIncome - 1000000) * 0.30);
        }

        // Section 87A Rebate for Old Regime (Max ₹12,500 if taxable income <= 5,00,000)
        let rebate87A = 0;
        if (taxableIncome <= 500000) {
            rebate87A = Math.min(slabTax, 12500);
        }
        const netSlabTax = Math.max(0, slabTax - rebate87A);

        // Surcharge & Surcharge Marginal Relief (Old Regime)
        // Thresholds: >50L: 10%, >1Cr: 15%, >2Cr: 25%, >5Cr: 37%
        const surchargeInfo = this._calculateSurchargeOldRegime(taxableIncome, netSlabTax, ageGroup);
        const surcharge = surchargeInfo.surcharge;

        // Health & Education Cess: 4% on (Tax after rebate + Surcharge)
        const cess = (netSlabTax + surcharge) * 0.04;
        const totalTax = netSlabTax + surcharge + cess;

        return {
            regime: "Old Tax Regime",
            financialYear: "FY 2026-27 (AY 2027-28)",
            grossIncome: grossIncome,
            standardDeduction: standardDeduction,
            otherDeductions: totalEligibleDeductions - standardDeduction,
            totalDeductions: totalEligibleDeductions,
            taxableIncome: taxableIncome,
            slabTax: Math.round(slabTax),
            rebate87A: Math.round(rebate87A),
            netSlabTax: Math.round(netSlabTax),
            surcharge: Math.round(surcharge),
            surchargeRelief: Math.round(surchargeInfo.marginalRelief),
            cess: Math.round(cess),
            totalTax: Math.round(totalTax)
        };
    },

    /**
     * Internal helper to compute New Regime slab tax at any taxable income amount
     */
    _computeNewRegimeRawTax: function(ti) {
        if (ti <= 400000) return 0;
        if (ti <= 800000) return (ti - 400000) * 0.05;
        if (ti <= 1200000) return 20000 + (ti - 800000) * 0.10;
        if (ti <= 1600000) return 60000 + (ti - 1200000) * 0.15;
        if (ti <= 2000000) return 120000 + (ti - 1600000) * 0.20;
        if (ti <= 2400000) return 200000 + (ti - 2000000) * 0.25;
        return 300000 + (ti - 2400000) * 0.30;
    },

    /**
     * Calculate Surcharge and statutory Marginal Relief for New Regime
     */
    _calculateSurchargeNewRegime: function(taxableIncome, taxBeforeSurcharge) {
        if (taxableIncome <= 5000000 || taxBeforeSurcharge <= 0) {
            return { surcharge: 0, marginalRelief: 0 };
        }

        let rate = 0;
        let threshold = 5000000;
        let prevSurchargeRate = 0;

        if (taxableIncome > 20000000) {
            rate = 0.25;
            threshold = 20000000;
            prevSurchargeRate = 0.15;
        } else if (taxableIncome > 10000000) {
            rate = 0.15;
            threshold = 10000000;
            prevSurchargeRate = 0.10;
        } else if (taxableIncome > 5000000) {
            rate = 0.10;
            threshold = 5000000;
            prevSurchargeRate = 0;
        }

        const unadjustedSurcharge = taxBeforeSurcharge * rate;
        const totalTaxWithSurcharge = taxBeforeSurcharge + unadjustedSurcharge;

        // Marginal Relief Calculation:
        // Tax + Surcharge at threshold
        const taxAtThreshold = this._computeNewRegimeRawTax(threshold);
        const surchargeAtThreshold = taxAtThreshold * prevSurchargeRate;
        const totalAtThreshold = taxAtThreshold + surchargeAtThreshold;

        // Maximum permissible Tax + Surcharge is total at threshold + income exceeding threshold
        const excessIncome = taxableIncome - threshold;
        const maxPermissibleTax = totalAtThreshold + excessIncome;

        if (totalTaxWithSurcharge > maxPermissibleTax) {
            const relief = totalTaxWithSurcharge - maxPermissibleTax;
            const adjustedSurcharge = Math.max(0, unadjustedSurcharge - relief);
            return { surcharge: adjustedSurcharge, marginalRelief: relief };
        }

        return { surcharge: unadjustedSurcharge, marginalRelief: 0 };
    },

    /**
     * Internal helper to compute Old Regime slab tax at any taxable income amount
     */
    _computeOldRegimeRawTax: function(ti, ageGroup) {
        let exemptionLimit = 250000;
        if (ageGroup === 'senior') exemptionLimit = 300000;
        if (ageGroup === 'super-senior') exemptionLimit = 500000;

        if (ti <= exemptionLimit) return 0;
        if (ti <= 500000) return (ti - exemptionLimit) * 0.05;
        if (ti <= 1000000) return ((500000 - exemptionLimit) * 0.05) + ((ti - 500000) * 0.20);
        return ((500000 - exemptionLimit) * 0.05) + (500000 * 0.20) + ((ti - 1000000) * 0.30);
    },

    /**
     * Calculate Surcharge and statutory Marginal Relief for Old Regime
     */
    _calculateSurchargeOldRegime: function(taxableIncome, taxBeforeSurcharge, ageGroup) {
        if (taxableIncome <= 5000000 || taxBeforeSurcharge <= 0) {
            return { surcharge: 0, marginalRelief: 0 };
        }

        let rate = 0;
        let threshold = 5000000;
        let prevSurchargeRate = 0;

        if (taxableIncome > 50000000) {
            rate = 0.37;
            threshold = 50000000;
            prevSurchargeRate = 0.25;
        } else if (taxableIncome > 20000000) {
            rate = 0.25;
            threshold = 20000000;
            prevSurchargeRate = 0.15;
        } else if (taxableIncome > 10000000) {
            rate = 0.15;
            threshold = 10000000;
            prevSurchargeRate = 0.10;
        } else if (taxableIncome > 5000000) {
            rate = 0.10;
            threshold = 5000000;
            prevSurchargeRate = 0;
        }

        const unadjustedSurcharge = taxBeforeSurcharge * rate;
        const totalTaxWithSurcharge = taxBeforeSurcharge + unadjustedSurcharge;

        // Marginal Relief Calculation
        const taxAtThreshold = this._computeOldRegimeRawTax(threshold, ageGroup);
        const surchargeAtThreshold = taxAtThreshold * prevSurchargeRate;
        const totalAtThreshold = taxAtThreshold + surchargeAtThreshold;

        const excessIncome = taxableIncome - threshold;
        const maxPermissibleTax = totalAtThreshold + excessIncome;

        if (totalTaxWithSurcharge > maxPermissibleTax) {
            const relief = totalTaxWithSurcharge - maxPermissibleTax;
            const adjustedSurcharge = Math.max(0, unadjustedSurcharge - relief);
            return { surcharge: adjustedSurcharge, marginalRelief: relief };
        }

        return { surcharge: unadjustedSurcharge, marginalRelief: 0 };
    },

    /**
     * Compute GST Values
     * mode: 'exclusive' (Price without GST) or 'inclusive' (Price with GST)
     */
    calculateGST: function(amount, rate, supplyType) {
        amount = Math.max(0, Number(amount) || 0);
        rate = Math.max(0, Number(rate) || 0);

        let baseAmount = 0;
        let gstAmount = 0;
        let totalAmount = 0;

        if (supplyType === 'exclusive') {
            baseAmount = amount;
            gstAmount = (baseAmount * rate) / 100;
            totalAmount = baseAmount + gstAmount;
        } else {
            // Inclusive
            totalAmount = amount;
            baseAmount = (totalAmount * 100) / (100 + rate);
            gstAmount = totalAmount - baseAmount;
        }

        const cgst = gstAmount / 2;
        const sgst = gstAmount / 2;
        const igst = gstAmount;

        return {
            baseAmount: Math.round(baseAmount * 100) / 100,
            gstAmount: Math.round(gstAmount * 100) / 100,
            totalAmount: Math.round(totalAmount * 100) / 100,
            cgst: Math.round(cgst * 100) / 100,
            sgst: Math.round(sgst * 100) / 100,
            igst: Math.round(igst * 100) / 100,
            rate: rate
        };
    }
};

if (typeof window !== 'undefined') {
    window.TaxCalculator = TaxCalculator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaxCalculator;
}

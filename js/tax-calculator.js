/**
 * Tax Ki Jankari (taxkijankari.com) - Interactive Tax Calculators
 * 1. Income Tax Calculator (Old vs New Tax Regime Comparison)
 * 2. GST Calculator (Exclusive & Inclusive with CGST/SGST/IGST breakdown)
 */

const TaxCalculator = {
    // Format currency in Indian numbering system
    formatINR: function(amount) {
        if (isNaN(amount)) return '₹0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Math.round(amount));
    },

    /**
     * Compute Income Tax under New Tax Regime
     * FY 2024-25 / FY 2025-26 (AY 2025-26 & AY 2026-27)
     */
    calculateNewRegime: function(grossIncome, isSalaried) {
        const standardDeduction = isSalaried ? 75000 : 0;
        const taxableIncome = Math.max(0, grossIncome - standardDeduction);
        let tax = 0;

        // Revised Budget Slabs
        // 0 to 3L: Nil
        // 3L to 7L: 5%
        // 7L to 10L: 10%
        // 10L to 12L: 15%
        // 12L to 15L: 20%
        // Above 15L: 30%

        if (taxableIncome <= 300000) {
            tax = 0;
        } else if (taxableIncome <= 700000) {
            tax = (taxableIncome - 300000) * 0.05;
        } else if (taxableIncome <= 1000000) {
            tax = (400000 * 0.05) + ((taxableIncome - 700000) * 0.10);
        } else if (taxableIncome <= 1200000) {
            tax = (400000 * 0.05) + (300000 * 0.10) + ((taxableIncome - 1000000) * 0.15);
        } else if (taxableIncome <= 1500000) {
            tax = (400000 * 0.05) + (300000 * 0.10) + (200000 * 0.15) + ((taxableIncome - 1200000) * 0.20);
        } else {
            tax = (400000 * 0.05) + (300000 * 0.10) + (200000 * 0.15) + (300000 * 0.20) + ((taxableIncome - 1500000) * 0.30);
        }

        // Section 87A Rebate (Zero tax if taxable income <= 7,00,000)
        let rebate87A = 0;
        if (taxableIncome <= 700000) {
            rebate87A = tax;
            tax = 0;
        }

        const cess = tax * 0.04;
        const totalTax = tax + cess;

        return {
            regime: "New Tax Regime",
            grossIncome: grossIncome,
            standardDeduction: standardDeduction,
            otherDeductions: 0,
            totalDeductions: standardDeduction,
            taxableIncome: taxableIncome,
            slabTax: tax + rebate87A,
            rebate87A: rebate87A,
            netSlabTax: tax,
            cess: cess,
            totalTax: Math.round(totalTax)
        };
    },

    /**
     * Compute Income Tax under Old Tax Regime
     */
    calculateOldRegime: function(grossIncome, isSalaried, deductions, ageGroup) {
        let standardDeduction = isSalaried ? 50000 : 0;
        let sec80C = Math.min(150000, Number(deductions.sec80C) || 0);
        let sec80D = Number(deductions.sec80D) || 0;
        let sec24b = Math.min(200000, Number(deductions.sec24b) || 0);
        let hra = Number(deductions.hra) || 0;
        let otherDeductions = Number(deductions.other) || 0;

        let totalEligibleDeductions = standardDeduction + sec80C + sec80D + sec24b + hra + otherDeductions;
        let taxableIncome = Math.max(0, grossIncome - totalEligibleDeductions);

        let exemptionLimit = 250000;
        if (ageGroup === 'senior') exemptionLimit = 300000; // 60 to 80
        if (ageGroup === 'super-senior') exemptionLimit = 500000; // 80+

        let tax = 0;
        if (taxableIncome <= exemptionLimit) {
            tax = 0;
        } else if (taxableIncome <= 500000) {
            tax = (taxableIncome - exemptionLimit) * 0.05;
        } else if (taxableIncome <= 1000000) {
            tax = ((500000 - exemptionLimit) * 0.05) + ((taxableIncome - 500000) * 0.20);
        } else {
            tax = ((500000 - exemptionLimit) * 0.05) + (500000 * 0.20) + ((taxableIncome - 1000000) * 0.30);
        }

        // Section 87A Rebate for Old Regime (taxable income <= 5,00,000)
        let rebate87A = 0;
        if (taxableIncome <= 500000) {
            rebate87A = tax;
            tax = 0;
        }

        const cess = tax * 0.04;
        const totalTax = tax + cess;

        return {
            regime: "Old Tax Regime",
            grossIncome: grossIncome,
            standardDeduction: standardDeduction,
            otherDeductions: totalEligibleDeductions - standardDeduction,
            totalDeductions: totalEligibleDeductions,
            taxableIncome: taxableIncome,
            slabTax: tax + rebate87A,
            rebate87A: rebate87A,
            netSlabTax: tax,
            cess: cess,
            totalTax: Math.round(totalTax)
        };
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

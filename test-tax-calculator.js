const TaxCalculator = require('./js/tax-calculator.js');

const testCases = [
    {
        name: "Test 1: Gross 8.5L, Salaried (New Regime)",
        run: () => TaxCalculator.calculateNewRegime(850000, true),
        expected: {
            standardDeduction: 75000,
            taxableIncome: 775000,
            slabTax: 18750,
            rebate87A: 18750,
            totalTax: 0
        }
    },
    {
        name: "Test 2: Gross 12L, Salaried (New Regime)",
        run: () => TaxCalculator.calculateNewRegime(1200000, true),
        expected: {
            standardDeduction: 75000,
            taxableIncome: 1125000,
            slabTax: 52500,
            rebate87A: 52500,
            totalTax: 0
        }
    },
    {
        name: "Test 3: Gross 15L, Salaried (New Regime)",
        run: () => TaxCalculator.calculateNewRegime(1500000, true),
        expected: {
            standardDeduction: 75000,
            taxableIncome: 1425000,
            slabTax: 93750, // 60k + 225k*15% = 60000 + 33750 = 93750
            rebate87A: 0,
            cess: 3750,
            totalTax: 97500
        }
    },
    {
        name: "Test 4: Gross 12.75L, Salaried (Exact 12L taxable threshold)",
        run: () => TaxCalculator.calculateNewRegime(1275000, true),
        expected: {
            standardDeduction: 75000,
            taxableIncome: 1200000,
            slabTax: 60000,
            rebate87A: 60000,
            totalTax: 0
        }
    },
    {
        name: "Test 5: Marginal Relief 87A at 12.10L Taxable (Gross 12.85L, Salaried)",
        run: () => TaxCalculator.calculateNewRegime(1285000, true),
        expected: {
            standardDeduction: 75000,
            taxableIncome: 1210000,
            slabTax: 61500,
            rebate87A: 51500, // 61500 - 10000 = 51500
            netSlabTax: 10000,
            cess: 400,
            totalTax: 10400
        }
    },
    {
        name: "Test 6: Old Regime Senior Citizen (65 yrs) Gross 6L, 80C 1.5L",
        run: () => TaxCalculator.calculateOldRegime(600000, false, { sec80C: 150000 }, 'senior'),
        expected: {
            standardDeduction: 0,
            totalDeductions: 150000,
            taxableIncome: 450000,
            slabTax: 7500, // (4.5L - 3L) * 5%
            rebate87A: 7500,
            totalTax: 0
        }
    },
    {
        name: "Test 7: Old Regime Super Senior Citizen (82 yrs) Gross 8L",
        run: () => TaxCalculator.calculateOldRegime(800000, false, {}, 'super-senior'),
        expected: {
            standardDeduction: 0,
            totalDeductions: 0,
            taxableIncome: 800000,
            slabTax: 60000, // (8L - 5L) * 20%
            rebate87A: 0,
            cess: 2400,
            totalTax: 62400
        }
    },
    {
        name: "Test 8: Old Regime General Individual Gross 10L, Salaried, 80C 1.5L, 80D 25k",
        run: () => TaxCalculator.calculateOldRegime(1000000, true, { sec80C: 150000, sec80D: 25000 }, 'general'),
        expected: {
            standardDeduction: 50000,
            totalDeductions: 225000,
            taxableIncome: 775000,
            slabTax: 12500 + 275000 * 0.20, // 12500 + 55000 = 67500
            rebate87A: 0,
            cess: 67500 * 0.04, // 2700
            totalTax: 70200
        }
    },
    {
        name: "Test 9: New Regime High Earner Surcharge (Gross 60L, Salaried)",
        run: () => TaxCalculator.calculateNewRegime(6000000, true),
        expected: {
            standardDeduction: 75000,
            taxableIncome: 5925000,
            slabTax: 1357500,
            rebate87A: 0,
            totalTax: 1552980
        }
    },
    {
        name: "Test 10: New Regime Marginal Relief boundary at 12.70L taxable (Gross 12.70L, Non-Salaried)",
        run: () => TaxCalculator.calculateNewRegime(1270000, false),
        expected: {
            standardDeduction: 0,
            taxableIncome: 1270000,
            slabTax: 70500,
            rebate87A: 500, // marginal relief
            netSlabTax: 70000,
            cess: 2800,
            totalTax: 72800
        }
    },
    {
        name: "Test 11: New Regime Just beyond Marginal Relief at 12.71L taxable (Gross 12.71L, Non-Salaried)",
        run: () => TaxCalculator.calculateNewRegime(1271000, false),
        expected: {
            standardDeduction: 0,
            taxableIncome: 1271000,
            slabTax: 70650,
            rebate87A: 0,
            netSlabTax: 70650,
            cess: 2826,
            totalTax: 73476
        }
    },
    {
        name: "Test 12: New Regime Surcharge Marginal Relief at 50.50L taxable (Gross 50.50L, Non-Salaried)",
        run: () => TaxCalculator.calculateNewRegime(5050000, false),
        expected: {
            standardDeduction: 0,
            taxableIncome: 5050000,
            slabTax: 1095000,
            rebate87A: 0,
            surcharge: 35000,
            surchargeRelief: 74500,
            cess: 45200,
            totalTax: 1175200
        }
    }
];

let failed = 0;
console.log("=== Running Tax Calculator FY 2026-27 Test Suite ===\n");

testCases.forEach((tc, idx) => {
    const result = tc.run();
    let pass = true;
    const errors = [];

    Object.keys(tc.expected).forEach(key => {
        const expectedVal = tc.expected[key];
        if (result[key] !== expectedVal) {
            pass = false;
            errors.push(`Field '${key}': expected ${expectedVal}, got ${result[key]}`);
        }
    });

    if (pass) {
        console.log(`[PASS] ${tc.name}`);
        console.log(`       Taxable: ${TaxCalculator.formatINR(result.taxableIncome)}, Slab Tax: ${TaxCalculator.formatINR(result.slabTax)}, Rebate: ${TaxCalculator.formatINR(result.rebate87A)}, Total Tax: ${TaxCalculator.formatINR(result.totalTax)}`);
    } else {
        failed++;
        console.error(`[FAIL] ${tc.name}`);
        errors.forEach(e => console.error(`       -> ${e}`));
        console.error(`       Actual Result:`, result);
    }
});

console.log(`\n==========================================`);
console.log(`Summary: ${testCases.length - failed}/${testCases.length} Passed`);

if (failed > 0) {
    process.exit(1);
} else {
    console.log("All calculation tests passed successfully!");
}

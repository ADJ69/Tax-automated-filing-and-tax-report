function calculateReturn() {
    const income = parseFloat(document.getElementById('income').value);
    const deductions = parseFloat(document.getElementById('deductions').value);
    const tdsPaid = parseFloat(document.getElementById('tds').value);
    const lateMonths = parseFloat(document.getElementById('lateMonths').value);
    const regime = document.querySelector('input[name="taxRegime"]:checked').value;

    // Validate input
    if (isNaN(income) || isNaN(deductions) || isNaN(tdsPaid) || isNaN(lateMonths)) {
        alert("Please enter valid numbers.");
        return;
    }

    // Calculate taxable income
    const taxableIncome = income - deductions;

    let tax = 0;

    switch (regime) {
        case "old":
            // Old Tax Regime Tax Slabs
            if (taxableIncome <= 250000) {
                tax = 0; // No tax
            } else if (taxableIncome <= 500000) {
                tax = (taxableIncome - 250000) * 0.05; // 5%
            } else if (taxableIncome <= 1000000) {
                tax = 12500 + (taxableIncome - 500000) * 0.2; // 20%
            } else {
                tax = 62500 + (taxableIncome - 1000000) * 0.3; // 30%
            }
            break;

        case "new":
            // New Tax Regime Tax Slabs
            if (taxableIncome <= 250000) {
                tax = 0; // No tax
            } else if (taxableIncome <= 500000) {
                tax = (taxableIncome - 250000) * 0.05; // 5%
            } else if (taxableIncome <= 750000) {
                tax = 12500 + (taxableIncome - 500000) * 0.1; // 10%
            } else if (taxableIncome <= 1000000) {
                tax = 37500 + (taxableIncome - 750000) * 0.15; // 15%
            } else if (taxableIncome <= 1250000) {
                tax = 75000 + (taxableIncome - 1000000) * 0.2; // 20%
            } else if (taxableIncome <= 1500000) {
                tax = 125000 + (taxableIncome - 1250000) * 0.25; // 25%
            } else {
                tax = 187500 + (taxableIncome - 1500000) * 0.3; // 30%
            }
            break;

        case "senior":
            // Senior Citizen Tax Regime (higher exemption limit)
            if (taxableIncome <= 300000) {
                tax = 0; // No tax
            } else if (taxableIncome <= 500000) {
                tax = (taxableIncome - 300000) * 0.05; // 5%
            } else if (taxableIncome <= 1000000) {
                tax = 10000 + (taxableIncome - 500000) * 0.2; // 20%
            } else {
                tax = 110000 + (taxableIncome - 1000000) * 0.3; // 30%
            }
            break;

        case "superSenior":
            // Super Senior Citizen Tax Regime (even higher exemption limit)
            if (taxableIncome <= 500000) {
                tax = 0; // No tax
            } else if (taxableIncome <= 1000000) {
                tax = (taxableIncome - 500000) * 0.2; // 20%
            } else {
                tax = 100000 + (taxableIncome - 1000000) * 0.3; // 30%
            }
            break;

        case "nri":
            // NRI Taxation (flat rate of 30% on income above 2.5 lakhs)
            if (taxableIncome <= 250000) {
                tax = 0; // No tax
            } else {
                tax = (taxableIncome - 250000) * 0.3; // 30%
            }
            break;

        case "ltcg":
            // Long-Term Capital Gains Tax
            if (taxableIncome > 100000) {
                tax = (taxableIncome - 100000) * 0.2; // 20%
            }
            break;

        case "stcg":
            // Short-Term Capital Gains Tax
            tax = taxableIncome * 0.15; // 15% flat rate
            break;

        case "property":
            // Income from House Property (example: assume standard deduction of 30%)
            const rentalIncome = income; // Assuming total income is rental
            const netIncomeFromProperty = rentalIncome * 0.7; // 30% standard deduction
            tax = (netIncomeFromProperty > 250000) ? (netIncomeFromProperty - 250000) * 0.3 : 0; // 30% on amount exceeding 2.5 lakhs
            break;

        case "startup":
            // Special Tax Regime for Startups (example: lower rate for first three years)
            tax = taxableIncome * 0.15; // 15% flat rate
            break;

        default:
            tax = 0; // Default to no tax if nothing matches
            break;
    }

    // Calculate final tax after TDS
    const finalTax = Math.max(0, tax - tdsPaid); // No negative tax
    document.getElementById('taxPayable').innerText = `Tax Payable: ₹${finalTax.toFixed(2)}`;

    // Late filing penalty (₹1,000 for each month delayed, up to ₹10,000)
    const latePenalty = Math.min(lateMonths * 1000, 10000);
    document.getElementById('latePenalty').innerText = `Late Penalty: ₹${latePenalty.toFixed(2)}`;

    // Total amount payable including late penalty
    const totalPayable = finalTax + latePenalty;
    document.getElementById('advanceTax').innerText = `Total Amount Payable: ₹${totalPayable.toFixed(2)}`;

    // Determine eligible form based on income and taxpayer type
    let eligibleForm = '';
    if (document.getElementById('presumptive').checked) {
        eligibleForm = 'Eligible to file ITR-4 (Sugam)';
    } else if (document.getElementById('nri').checked) {
        eligibleForm = 'Eligible to file ITR-2';
    } else if (document.getElementById('seniorCitizen').checked) {
        if (income <= 500000) {
            eligibleForm = 'Eligible to file ITR-1 (Sahaj)';
        } else {
            eligibleForm = 'Eligible to file ITR-2';
        }
    } else {
        if (income <= 500000) {
            eligibleForm = 'Eligible to file ITR-1 (Sahaj)';
        } else if (income <= 1000000) {
            eligibleForm = 'Eligible to file ITR-2';
        } else {
            eligibleForm = 'Eligible to file ITR-3';
        }
    }

    // Display the eligible form
    document.getElementById('eligibleForm').innerText = eligibleForm;
}

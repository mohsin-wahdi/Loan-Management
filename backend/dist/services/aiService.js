"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLoanRiskSummary = void 0;
const generateLoanRiskSummary = async (input) => {
    const stableIncome = input.monthlySalary >= 50000;
    const lowerRiskAge = input.age >= 25 && input.age <= 45;
    const employed = input.employmentMode !== "Unemployed";
    if (stableIncome && lowerRiskAge && employed) {
        return "Applicant meets eligibility criteria with stable income. Risk level: Low.";
    }
    return "Applicant meets basic criteria with moderate income variability. Risk level: Medium.";
};
exports.generateLoanRiskSummary = generateLoanRiskSummary;

export const generateLoanRiskSummary = async (input: {
  age: number;
  monthlySalary: number;
  employmentMode: string;
}): Promise<string> => {
  const stableIncome = input.monthlySalary >= 50000;
  const lowerRiskAge = input.age >= 25 && input.age <= 45;
  const employed = input.employmentMode !== "Unemployed";

  if (stableIncome && lowerRiskAge && employed) {
    return "Applicant meets eligibility criteria with stable income. Risk level: Low.";
  }
  return "Applicant meets basic criteria with moderate income variability. Risk level: Medium.";
};
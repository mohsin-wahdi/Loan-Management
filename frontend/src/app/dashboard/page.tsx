"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AuthGuard } from "../../components/AuthGuard";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/api";
import { Activity, Loan } from "../../types";

const INTEREST_RATE = 12;

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { user, token, logout } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<{ _id: string; fullName: string; email: string }[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    pan: "",
    dateOfBirth: "",
    monthlySalary: 25000,
    employmentMode: "Salaried",
    amount: 50000,
    tenureDays: 30
  });
  const [salarySlip, setSalarySlip] = useState<File | null>(null);

  const si = useMemo(
    () => Number(((form.amount * INTEREST_RATE * form.tenureDays) / (365 * 100)).toFixed(2)),
    [form.amount, form.tenureDays]
  );
  const totalRepayment = useMemo(() => Number((form.amount + si).toFixed(2)), [form.amount, si]);

  const fetchData = async () => {
    if (!token || !user) return;
    setError("");
    try {
      if (user.role === "Borrower") setLoans(await apiRequest("/api/loans/my-loans", {}, token));
      if (user.role === "Sales") setUsers(await apiRequest("/api/loans/sales/not-applied-users", {}, token));
      if (user.role === "Sanction") setLoans(await apiRequest("/api/loans/sanction/applied", {}, token));
      if (user.role === "Disbursement") setLoans(await apiRequest("/api/loans/disbursement/sanctioned", {}, token));
      if (user.role === "Collection") setLoans(await apiRequest("/api/loans/collection/disbursed", {}, token));
      if (user.role === "Admin") {
        const [a, b, c] = await Promise.all([
          apiRequest<Loan[]>("/api/loans/sanction/applied", {}, token),
          apiRequest<Loan[]>("/api/loans/disbursement/sanctioned", {}, token),
          apiRequest<Loan[]>("/api/loans/collection/disbursed", {}, token)
        ]);
        setLoans([...a, ...b, ...c]);
      }
      setActivities(await apiRequest("/api/activities/my", {}, token));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, user?.role]);

  const applyLoan = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const nextErrors: Record<string, string> = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!form.pan.trim()) nextErrors.pan = "PAN is required";
    else if (!/^[0-9]{10}$/.test(form.pan))
      nextErrors.pan = "Enter valid PAN number (10 digits)";
    if (!form.dateOfBirth) nextErrors.dateOfBirth = "Date of birth is required";
    if (!form.monthlySalary || form.monthlySalary < 25000)
      nextErrors.monthlySalary = "Salary must be at least 25000";
    if (form.amount < 50000 || form.amount > 500000)
      nextErrors.amount = "Amount must be between 50000 and 500000";
    if (form.tenureDays < 30 || form.tenureDays > 365)
      nextErrors.tenureDays = "Tenure must be between 30 and 365 days";
    if (!salarySlip) nextErrors.salarySlip = "Salary slip is required";
    if (salarySlip && salarySlip.size > 5 * 1024 * 1024)
      nextErrors.salarySlip = "File size must be up to 5MB";
    if (
      salarySlip &&
      !["application/pdf", "image/jpeg", "image/png"].includes(salarySlip.type)
    ) {
      nextErrors.salarySlip = "Only PDF/JPG/PNG files are allowed";
    }
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }
    setFormErrors({});

    const slip = salarySlip;
    if (!slip) return;

    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => body.append(k, String(v)));
    body.append("salarySlip", slip);
    try {
      await apiRequest("/api/loans/apply", { method: "POST", body }, token);
      setSalarySlip(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Apply failed");
    }
  };

  const loanAction = async (endpoint: string, body?: unknown) => {
    if (!token) return;
    try {
      await apiRequest(endpoint, { method: "POST", body: JSON.stringify(body ?? {}) }, token);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between bg-white p-4 rounded shadow">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p>
            {user?.fullName} ({user?.role})
          </p>
        </div>
        <button className="border px-4 py-2 rounded" onClick={logout}>
          Logout
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {user?.role === "Borrower" && (
        <section className="grid md:grid-cols-2 gap-6">
          <form onSubmit={applyLoan} className="bg-white rounded shadow p-4 space-y-3">
            <h2 className="text-lg font-semibold">Multi-step Loan Application</h2>
            <label className="text-sm font-medium">Full Name</label>
            <input className="w-full border p-2 rounded" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
            {formErrors.fullName && <p className="text-red-600 text-sm">{formErrors.fullName}</p>}
            <label className="text-sm font-medium">PAN Number (10 digits)</label>
            <input className="w-full border p-2 rounded" placeholder="Enter 10 digit PAN number" maxLength={10} value={form.pan} onChange={(e) => setForm((p) => ({ ...p, pan: e.target.value.replace(/\D/g, "").slice(0, 10) }))} />
            {formErrors.pan && <p className="text-red-600 text-sm">{formErrors.pan}</p>}
            <label className="text-sm font-medium">Date of Birth</label>
            <input className="w-full border p-2 rounded" type="date" value={form.dateOfBirth} onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))} />
            {formErrors.dateOfBirth && <p className="text-red-600 text-sm">{formErrors.dateOfBirth}</p>}
            <label className="text-sm font-medium">Monthly Salary</label>
            <input className="w-full border p-2 rounded" type="number" min={25000} value={form.monthlySalary} onChange={(e) => setForm((p) => ({ ...p, monthlySalary: Number(e.target.value) }))} />
            {formErrors.monthlySalary && <p className="text-red-600 text-sm">{formErrors.monthlySalary}</p>}
            <label className="text-sm font-medium">Employment Mode</label>
            <select className="w-full border p-2 rounded" value={form.employmentMode} onChange={(e) => setForm((p) => ({ ...p, employmentMode: e.target.value }))}>
              <option>Salaried</option>
              <option>Self-Employed</option>
              <option>Unemployed</option>
            </select>
            <label className="text-sm font-medium">Loan Amount: {form.amount}</label>
            <input className="w-full" type="range" min={50000} max={500000} step={1000} value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))} />
            {formErrors.amount && <p className="text-red-600 text-sm">{formErrors.amount}</p>}
            <label className="text-sm font-medium">Tenure Days: {form.tenureDays}</label>
            <input className="w-full" type="range" min={30} max={365} step={1} value={form.tenureDays} onChange={(e) => setForm((p) => ({ ...p, tenureDays: Number(e.target.value) }))} />
            {formErrors.tenureDays && <p className="text-red-600 text-sm">{formErrors.tenureDays}</p>}
            <label className="text-sm font-medium">Salary Slip Upload (PDF/JPG/PNG)</label>
            <input className="w-full border p-2 rounded" type="file" accept=".pdf,image/png,image/jpeg" onChange={(e) => setSalarySlip(e.target.files?.[0] ?? null)} />
            {formErrors.salarySlip && <p className="text-red-600 text-sm">{formErrors.salarySlip}</p>}
            <div className="text-sm bg-blue-50 p-2 rounded space-y-1">
              <p>Rate: 12% p.a.</p>
              <p>Simple Interest: {si}</p>
              <p>Total Repayment: {totalRepayment}</p>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded">Apply Loan</button>
          </form>
          <LoanList title="My Loans" loans={loans} role={user.role} onAction={loanAction} />
        </section>
      )}

      {user?.role === "Sales" && (
        <section className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Registered Users Not Applied</h2>
          <ul className="space-y-2">
            {users.map((u) => (
              <li key={u._id} className="border rounded p-2">
                {u.fullName} - {u.email}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(user?.role === "Sanction" || user?.role === "Disbursement" || user?.role === "Collection" || user?.role === "Admin") && (
        <LoanList title="Operational Loans" loans={loans} role={user.role} onAction={loanAction} />
      )}

      <section className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-3"> Activity History</h2>
        <ul className="space-y-2">
          {activities.map((item) => (
            <li key={item._id} className="border rounded p-2 text-sm">
              <p className="font-medium">{item.action}</p>
              <p>{item.details}</p>
              <p className="text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
            </li>
          ))}
          {activities.length === 0 && <li className="text-sm text-slate-500">No activity found</li>}
        </ul>
      </section>
    </main>
  );
}

function LoanList({
  title,
  loans,
  role,
  onAction
}: {
  title: string;
  loans: Loan[];
  role: string;
  onAction: (endpoint: string, body?: unknown) => Promise<void>;
}) {
  const [reason, setReason] = useState("");
  const [payment, setPayment] = useState({ utr: "", amount: 0, paymentDate: "" });
  const [localError, setLocalError] = useState("");

  const onReject = async (loanId: string) => {
    if (!reason.trim()) {
      setLocalError("Rejection reason is required");
      return;
    }
    setLocalError("");
    await onAction(`/api/loans/sanction/${loanId}/reject`, { reason });
  };

  const onAddPayment = async (loanId: string) => {
    if (!payment.utr.trim()) {
      setLocalError("UTR is required");
      return;
    }
    if (!payment.amount || payment.amount <= 0) {
      setLocalError("Payment amount must be greater than 0");
      return;
    }
    if (!payment.paymentDate) {
      setLocalError("Payment date is required");
      return;
    }
    setLocalError("");
    await onAction(`/api/loans/collection/${loanId}/payments`, payment);
  };

  return (
    <section className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {localError && <p className="text-red-600 text-sm mb-2">{localError}</p>}
      <div className="space-y-4">
        {loans.map((loan) => (
          <div key={loan._id} className="border rounded p-3 space-y-2">
            <p>
              {loan.fullName} | {loan.status} | Amount: {loan.amount}
            </p>
            <p className="text-sm">Repayment: {loan.totalRepayment}, Paid: {loan.totalPaid}, Outstanding: {loan.outstandingBalance}</p>
            <p className="text-sm">Risk: {loan.riskSummary}</p>
            {loan.rejectionReason && <p className="text-sm text-red-700">Reason: {loan.rejectionReason}</p>}

            {role === "Sanction" && (
              <div className="flex gap-2 items-center">
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => onAction(`/api/loans/sanction/${loan._id}/approve`)}>
                  Approve
                </button>
                <input className="border p-1 rounded" placeholder="Rejection reason" value={reason} onChange={(e) => setReason(e.target.value)} />
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => onReject(loan._id)}>
                  Reject
                </button>
              </div>
            )}

            {role === "Disbursement" && (
              <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => onAction(`/api/loans/disbursement/${loan._id}/disburse`)}>
                Mark Disbursed
              </button>
            )}

            {role === "Collection" && (
              <div className="grid md:grid-cols-4 gap-2">
                <input className="border p-1 rounded" placeholder="UTR" value={payment.utr} onChange={(e) => setPayment((p) => ({ ...p, utr: e.target.value }))} />
                <input className="border p-1 rounded" type="number" placeholder="Amount" value={payment.amount || ""} onChange={(e) => setPayment((p) => ({ ...p, amount: Number(e.target.value) }))} />
                <input className="border p-1 rounded" type="date" value={payment.paymentDate} onChange={(e) => setPayment((p) => ({ ...p, paymentDate: e.target.value }))} />
                <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => onAddPayment(loan._id)}>
                  Add Payment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

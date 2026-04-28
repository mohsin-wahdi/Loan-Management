export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Loan Management System</h1>
        <p className="mt-3 text-slate-600">
          Borrower portal, RBAC operations dashboard, and complete loan lifecycle flow.
        </p>
        <div className="mt-6 flex gap-3">
          <a href="/login" className="px-5 py-2 rounded bg-blue-600 text-white">
            Login
          </a>
          <a href="/signup" className="px-5 py-2 rounded border border-slate-300">
            Signup
          </a>
        </div>
      </div>
    </main>
  );
}

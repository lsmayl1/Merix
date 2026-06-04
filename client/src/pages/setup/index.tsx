import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetupClientMutation } from "../../redux/features/clients/clientsSlice.tsx";

type Step = 1 | 2;

const Field = ({
  label, name, type = "text", value, onChange, error, placeholder, required = false,
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (v: string) => void; error?: string; placeholder?: string; required?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-[#64748b]">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`border rounded-lg px-3 py-2.5 text-sm text-[#0f172a] bg-white transition-colors focus:outline-none focus:border-[#0f172a] ${
        error ? "border-red-400 bg-red-50" : "border-[#e2e8f0]"
      }`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export const Setup = () => {
  const navigate = useNavigate();
  const [setupClient, { isLoading }] = useSetupClientMutation();
  const [step, setStep] = useState<Step>(1);
  const [result, setResult] = useState<any>(null);

  const [company, setCompany] = useState({
    companyName: "", companyEmail: "", companyPhone: "", companyAddress: "",
  });
  const [user, setUser] = useState({
    firstName: "", lastName: "", email: "", phoneNumber: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setC = (k: keyof typeof company) => (v: string) => setCompany((p) => ({ ...p, [k]: v }));
  const setU = (k: keyof typeof user)    => (v: string) => setUser((p) => ({ ...p, [k]: v }));

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!company.companyName.trim()) e.companyName = "Company name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!user.firstName.trim())  e.firstName = "First name is required";
    if (!user.lastName.trim())   e.lastName  = "Last name is required";
    if (!user.email.trim())      e.email     = "Email is required";
    if (!user.password)          e.password  = "Password is required";
    else if (user.password.length < 6) e.password = "Password must be at least 6 characters";
    if (user.password !== user.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    try {
      const res = await setupClient({ ...company, ...user }).unwrap();
      setResult(res);
    } catch (err: any) {
      setErrors({ submit: err?.data?.error || "Something went wrong" });
    }
  };

  // ── Success screen ──
  if (result) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 w-full max-w-md shadow-sm text-center flex flex-col gap-6">
          <div className="size-14 rounded-full bg-[#f0fdf4] flex items-center justify-center mx-auto">
            <svg className="size-7 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0f172a]">Setup Complete</h2>
            <p className="text-sm text-[#64748b] mt-1">Company and employee created successfully.</p>
          </div>
          <div className="bg-[#f8fafc] rounded-xl p-4 text-left flex flex-col gap-3">
            <div>
              <p className="text-xs text-[#94a3b8] mb-0.5">Company</p>
              <p className="text-sm font-semibold text-[#0f172a]">{result.company?.name}</p>
            </div>
            <div className="border-t border-[#e2e8f0] pt-3">
              <p className="text-xs text-[#94a3b8] mb-0.5">Employee</p>
              <p className="text-sm font-semibold text-[#0f172a]">{result.user?.firstName} {result.user?.lastName}</p>
              <p className="text-xs text-[#64748b]">{result.user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setResult(null); setStep(1); setCompany({ companyName:"", companyEmail:"", companyPhone:"", companyAddress:"" }); setUser({ firstName:"", lastName:"", email:"", phoneNumber:"", password:"", confirmPassword:"" }); }}
              className="flex-1 py-2.5 border border-[#e2e8f0] rounded-lg text-sm text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
            >
              New Setup
            </button>
            <button
              onClick={() => navigate("/companies")}
              className="flex-1 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg text-sm font-medium transition-colors"
            >
              View Companies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full py-8">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm w-full max-w-lg">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#e2e8f0]">
          <h1 className="text-xl font-bold text-[#0f172a]">New Company Setup</h1>
          <p className="text-sm text-[#64748b] mt-1">Create a company and its first employee account.</p>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mt-5">
            {([1, 2] as Step[]).map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s ? "bg-[#0f172a] text-white" : step > s ? "bg-emerald-500 text-white" : "bg-[#f1f5f9] text-[#94a3b8]"
                  }`}>
                    {step > s
                      ? <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      : s}
                  </div>
                  <span className={`text-sm font-medium ${step === s ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>
                    {s === 1 ? "Company" : "Employee"}
                  </span>
                </div>
                {i === 0 && <div className={`flex-1 h-px ${step > 1 ? "bg-emerald-500" : "bg-[#e2e8f0]"}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
          <div className="px-8 py-6 flex flex-col gap-4">
            {step === 1 ? (
              <>
                <Field label="Company Name" name="companyName" value={company.companyName} onChange={setC("companyName")} error={errors.companyName} placeholder="Acme Corp" required />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email" name="companyEmail" type="email" value={company.companyEmail} onChange={setC("companyEmail")} placeholder="info@acme.com" />
                  <Field label="Phone" name="companyPhone" value={company.companyPhone} onChange={setC("companyPhone")} placeholder="+994 50 000 00 00" />
                </div>
                <Field label="Address" name="companyAddress" value={company.companyAddress} onChange={setC("companyAddress")} placeholder="123 Main St, Baku" />
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name" name="firstName" value={user.firstName} onChange={setU("firstName")} error={errors.firstName} placeholder="John" required />
                  <Field label="Last Name" name="lastName" value={user.lastName} onChange={setU("lastName")} error={errors.lastName} placeholder="Doe" required />
                </div>
                <Field label="Email" name="email" type="email" value={user.email} onChange={setU("email")} error={errors.email} placeholder="john@acme.com" required />
                <Field label="Phone Number" name="phoneNumber" value={user.phoneNumber} onChange={setU("phoneNumber")} placeholder="+994 50 000 00 00" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Password" name="password" type="password" value={user.password} onChange={setU("password")} error={errors.password} placeholder="••••••••" required />
                  <Field label="Confirm Password" name="confirmPassword" type="password" value={user.confirmPassword} onChange={setU("confirmPassword")} error={errors.confirmPassword} placeholder="••••••••" required />
                </div>
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
                    {errors.submit}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 border border-[#e2e8f0] rounded-lg text-sm text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {step === 1 ? "Next: Employee Details →" : isLoading ? "Creating..." : "Create Company & Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

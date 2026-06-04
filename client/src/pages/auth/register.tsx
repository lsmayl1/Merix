import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthSchema } from "../../validations/Auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/features/auth/authHooks";
import LogoMain from "../../assets/Logo/LogoMain";
import { Eye, EyeOff } from "lucide-react";

const RegisterSchema = AuthSchema.pick([
  "firstName", "lastName", "phoneNumber", "email", "password", "confirmPassword",
]);

const Field = ({
  label, error, children, required = false,
}: {
  label: string; error?: string; children: React.ReactNode; required?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-[#64748b]">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const inputClass = (hasError: boolean) =>
  `w-full border rounded-lg px-3 py-2.5 text-sm text-[#0f172a] bg-white focus:outline-none focus:border-[#0f172a] transition-colors ${
    hasError ? "border-red-400 bg-red-50" : "border-[#e2e8f0]"
  }`;

export const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(RegisterSchema),
  });

  const handleRegister = async (data: any) => {
    try {
      await registerUser(data).unwrap();
      navigate("/dashboard");
    } catch (err: any) {
      setError("root", { message: err?.data?.message ?? "Registration failed" });
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8 flex flex-col gap-6">
      {/* Logo */}
      <div className="flex justify-center">
        <LogoMain className="size-10" />
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#0f172a]">Create an account</h1>
        <p className="text-sm text-[#64748b] mt-1">Fill in your details to get started</p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleRegister)}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name" error={errors.firstName?.message} required>
            <input {...register("firstName")} type="text" placeholder="John" className={inputClass(!!errors.firstName)} />
          </Field>
          <Field label="Last Name" error={errors.lastName?.message} required>
            <input {...register("lastName")} type="text" placeholder="Doe" className={inputClass(!!errors.lastName)} />
          </Field>
        </div>

        <Field label="Email" error={errors.email?.message} required>
          <input {...register("email")} type="text" placeholder="you@example.com" className={inputClass(!!errors.email)} />
        </Field>

        <Field label="Phone Number" error={errors.phoneNumber?.message} required>
          <input {...register("phoneNumber")} type="text" placeholder="+994 50 000 00 00" className={inputClass(!!errors.phoneNumber)} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" error={errors.password?.message} required>
            <div className="relative">
              <input
                {...register("password")}
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                className={inputClass(!!errors.password) + " pr-10"}
              />
              <button type="button" onClick={() => setShowPwd((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>
          <Field label="Confirm Password" error={errors.confirmPassword?.message} required>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className={inputClass(!!errors.confirmPassword) + " pr-10"}
              />
              <button type="button" onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>
        </div>

        {errors.root?.message && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 mt-1 bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isLoading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-[#64748b]">
        Already have an account?{" "}
        <NavLink to="/" className="text-[#0f172a] font-semibold hover:underline">
          Sign in
        </NavLink>
      </p>
    </div>
  );
};

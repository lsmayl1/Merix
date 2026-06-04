import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthSchema } from "../../validations/Auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/features/auth/authHooks";
import { setCredentials } from "../../redux/services/authService";
import { useDispatch } from "react-redux";
import LogoMain from "../../assets/Logo/LogoMain";
import { Eye, EyeOff } from "lucide-react";

const LoginSchema = AuthSchema.pick(["email", "password"]);

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (data: { email: string; password?: string }) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ token: res.data.token, refreshToken: res.data.refreshToken }));
      navigate("/dashboard");
    } catch (err: any) {
      setError("root", { message: err?.data?.message ?? "Invalid email or password" });
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8 flex flex-col gap-6">
      {/* Logo */}
      <div className="flex justify-center">
        <LogoMain className="size-10" />
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#0f172a]">Welcome back</h1>
        <p className="text-sm text-[#64748b] mt-1">Sign in to your admin account</p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleLogin)}>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#64748b]">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email")}
            type="text"
            placeholder="you@example.com"
            className={`border rounded-lg px-3 py-2.5 text-sm text-[#0f172a] bg-white focus:outline-none focus:border-[#0f172a] transition-colors ${
              errors.email ? "border-red-400 bg-red-50" : "border-[#e2e8f0]"
            }`}
          />
          {errors.email?.message && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#64748b]">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm text-[#0f172a] bg-white focus:outline-none focus:border-[#0f172a] transition-colors ${
                errors.password ? "border-red-400 bg-red-50" : "border-[#e2e8f0]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password?.message && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
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
          {isLoading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-[#64748b]">
        Don't have an account?{" "}
        <NavLink to="/register" className="text-[#0f172a] font-semibold hover:underline">
          Register
        </NavLink>
      </p>
    </div>
  );
};

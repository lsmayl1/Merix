import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthSchema } from "../../validations/Auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/features/auth/authHooks";
import { setCredentials } from "../../redux/services/authService";
import { useDispatch } from "react-redux";
import LogoMain from "../../assets/Logo/LogoMain";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const LoginSchema = AuthSchema.pick(["email", "password"]);

const inputBase = "w-full h-10 px-3 rounded-lg border text-sm text-text-primary bg-bg-subtle placeholder:text-text-muted transition-colors focus:ring-2 focus:ring-offset-0";

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
      const { token, refreshToken, user } = res.data;
      dispatch(setCredentials({ token, refreshToken, role: user.role, clientId: user.clientId }));
      navigate(user.role === "owner" ? "/owner/dashboard" : "/dashboard");
    } catch (err: any) {
      setError("root", { message: err?.data?.message ?? "Invalid email or password" });
    }
  };

  return (
    <div className="w-full max-w-sm bg-bg-surface rounded-2xl border border-border shadow-modal p-8 flex flex-col gap-6">
      {/* Logo */}
      <div className="flex justify-center">
        <LogoMain className="size-10" />
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-text-primary">Welcome back</h1>
        <p className="text-sm text-text-secondary mt-1">Sign in to your admin account</p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleLogin)}>
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-secondary">
            Email <span className="text-danger font-normal">*</span>
          </label>
          <input
            {...register("email")}
            type="text"
            placeholder="you@example.com"
            className={`${inputBase} ${
              errors.email
                ? "border-danger focus:border-danger focus:ring-danger/20 bg-danger-bg"
                : "border-border focus:border-brand focus:ring-brand/20"
            }`}
          />
          {errors.email?.message && (
            <p className="text-xs text-danger-text flex items-center gap-1">
              <AlertCircle size={11} /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-secondary">
            Password <span className="text-danger font-normal">*</span>
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              className={`${inputBase} pr-10 ${
                errors.password
                  ? "border-danger focus:border-danger focus:ring-danger/20 bg-danger-bg"
                  : "border-border focus:border-brand focus:ring-brand/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password?.message && (
            <p className="text-xs text-danger-text flex items-center gap-1">
              <AlertCircle size={11} /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Root error */}
        {errors.root?.message && (
          <div className="bg-danger-bg border border-danger/30 rounded-lg px-3 py-2.5 text-sm text-danger-text flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 mt-1 bg-brand hover:bg-brand-hover disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isLoading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
};

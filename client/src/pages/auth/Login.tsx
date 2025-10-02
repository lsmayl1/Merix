import React from "react";
import { useForm } from "react-hook-form";
import { AuthSchema } from "../../validations/Auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/features/auth/authHooks";
import { ToastContainer } from "react-toastify";
import useApiError, { type ApiError } from "../../hooks/useApiError";
const LoginSchema = AuthSchema.pick(["email", "password"]);
import { setCredentials } from "../../redux/services/authService";
import { useDispatch } from "react-redux";
export const Login = () => {
  const { handleError } = useApiError();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: "is234mayilovi925@gmail.com",
      password: "ismo23423",
    },
  });
  const [login] = useLoginMutation();

  const handleLogin = async (data: { email: string; password?: string }) => {
    try {
      const response = await login(data).unwrap();
      dispatch(
        setCredentials({
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        })
      );
      navigate("/dashboard");
    } catch (error: unknown) {
      handleError(error as ApiError);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      <ToastContainer />
      <h1 className="font-extrabold text-2xl">Welcome Back</h1>
      <form
        className="flex flex-col gap-4 w-1/4 max-md:w-3/4"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className="flex flex-col gap-1">
          <input
            className="border border-border rounded-lg p-2"
            {...register("email")}
            type="text"
            placeholder="Email"
          />
          {errors.email?.message && (
            <p className="text-red-500 px-2 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <input
            className="border border-border rounded-lg p-2"
            {...register("password")}
            type="password"
            placeholder="Password"
          />
          {errors.password?.message && (
            <p className="text-red-500 px-2 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-black text-center cursor-pointer text-white p-2 rounded-lg"
        >
          Login
        </button>
      </form>
      <h1>
        Don`t have an account?{" "}
        <NavLink to="/register" className=" underline">
          Register
        </NavLink>
      </h1>
    </div>
  );
};

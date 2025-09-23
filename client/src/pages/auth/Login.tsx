import React from "react";
import { useForm } from "react-hook-form";
import { AuthSchema } from "../../validations/Auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink } from "react-router-dom";

const LoginSchema = AuthSchema.pick(["email", "password"]);
export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(LoginSchema) });

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      <h1 className="font-extrabold text-2xl">Welcome Back</h1>
      <form
        className="flex flex-col gap-4 w-1/4 max-md:w-3/4"
        onSubmit={handleSubmit((data) => console.log(data))}
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
        <NavLink to="/dashboard" className="bg-black text-center cursor-pointer text-white p-2 rounded-lg">
          Login
        </NavLink>
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

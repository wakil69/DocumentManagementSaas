"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getValidationSchemaFirstLogin } from "./validationSchemaFirstLogin";
import useFirstLogin from "@/hooks/authentication/useFirstLogin";
import Logo from "../../../../../public/logoSite.png";
import Image from "next/image";
import { useState } from "react";

export default function FirstLoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(getValidationSchemaFirstLogin()),
  });

  const {
    firstLoginMutate,
    isErrorFirstLogin,
    isPendingFirstLogin,
    isSuccessFirstLogin,
    message,
  } = useFirstLogin();

  return (
    <div className="w-10/12 lg:w-2/5 2xl:w-1/5">
      <div className="relative max-w-full">
        <div className="absolute -inset-2">
          <div
            className="w-full h-full mx-auto rounded-3xl opacity-30 blur-lg filter"
            style={{
              background:
                "linear-gradient(90deg, #000000 0%, #51377a 15%, #533b7d 30%, #db543e 50%, #d0db50 70%, #d1dd52 100%)",
            }}
          ></div>
        </div>

        <div className="relative overflow-hidden bg-white shadow-xl rounded-xl">
          <form
            onSubmit={handleSubmit((data) =>
              firstLoginMutate({ password: data.password })
            )}
            className="px-4 py-6 sm:px-8 flex flex-col space-y-6"
          >
            <div className="flex flex-col space-y-6 items-center justify-between">
              <Image
                src={Logo}
                alt="logo semiv"
                className="w-32 lg:w-64 drop-shadow-2xl"
                priority
              />
              <h1 className="w-full text-lg lg:text-xl font-bold text-violet-custom font-pj text-center">
                Espace pour les membres du conseil syndical
              </h1>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-3">
                <label
                  htmlFor=""
                  className="text-base font-medium text-gray-900 font-pj"
                >
                  Nouveau mot de passe
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Nouveau mot de passe"
                  className="block w-full px-2 py-2 lg:px-4 lg:py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-400 rounded-xl focus:border-gray-900 focus:ring-gray-900 caret-gray-900"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={togglePasswordVisibility}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                  />
                  <label
                    htmlFor="showPassword"
                    className="text-gray-700 text-sm"
                  >
                    Afficher le mot de passe
                  </label>
                </div>

                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900 font-pj"
                  >
                    Confirmation du mot de passe
                  </label>
                </div>
                <input
                  type="password"
                  {...register("confirmation_password")}
                  placeholder="Confirmation du mot de passe"
                  className="block w-full px-2 py-2 lg:px-4 lg:py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-400 rounded-xl focus:border-gray-900 focus:ring-gray-900 caret-gray-900"
                />
                {errors.confirmation_password && (
                  <p className="text-red-500">
                    {errors.confirmation_password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPendingFirstLogin || isSuccessFirstLogin}
              className="cursor-pointer flex items-center justify-center w-full px-8 py-4 mt-5 text-base font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-pj hover:bg-gray-600"
            >
              Changer le mot de passe
            </button>
            {isErrorFirstLogin && message && (
              <p className="font-semibold text-red-500">{message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

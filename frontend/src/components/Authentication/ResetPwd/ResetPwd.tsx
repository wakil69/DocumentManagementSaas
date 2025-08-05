"use client";
import Image from "next/image";
import Logo from "../../../../public/logoSite.png";
import BackgroundHome from "../../../../public/homebackground.jpg";
import useResetPwd from "@/hooks/authentication/useResetPwd";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidationSchemaResetPwd } from "./validationSchemaResetPwd";
import { useForm } from "react-hook-form";
import LoadingClient from "@/components/Loading/Loading";
import { useState } from "react";

export default function ResetPwd({ token }: { token: string }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(getValidationSchemaResetPwd()),
  });

  const {
    resetPwdMutate,
    isErrorResetPwd,
    isPendingResetPwd,
    isSuccessResetPwd,
    message,
  } = useResetPwd(token);

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 h-screen flex justify-center items-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src={BackgroundHome}
          alt="Background semiv"
          fill
          className="object-cover"
          priority
        />
      </div>
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
              onSubmit={handleSubmit((data) => resetPwdMutate(data))}
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
                <h6 className="w-full text-md lg:text-lg font-bold text-orange-custom font-pj text-center">
                  Veuillez choisir un nouveau mot de passe (min. 12 caractères
                  et 4 types de caractères différents : des minuscules, des
                  majuscules, des chiffres et des caractères spéciaux.).
                </h6>
              </div>

              <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900 font-pj"
                  >
                    {" "}
                    Nouveau mot de passe{" "}
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("new_password")}
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
                  {errors.new_password && (
                    <p className="text-red-500">
                      {errors.new_password.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900 font-pj"
                  >
                    {" "}
                    Confirmation du nouveau mot de passe{" "}
                  </label>
                  <input
                    type="password"
                    {...register("confirmation_new_password")}
                    placeholder="Confirmation nouveau mot de passe"
                    className="block w-full px-2 py-2 lg:px-4 lg:py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-400 rounded-xl focus:border-gray-900 focus:ring-gray-900 caret-gray-900"
                  />
                  {errors.confirmation_new_password && (
                    <p className="text-red-500">
                      {errors.confirmation_new_password.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPendingResetPwd || isSuccessResetPwd}
                className="cursor-pointer flex items-center justify-center w-full px-8 py-4 mt-5 text-base font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-pj hover:bg-gray-600"
              >
                Réinitialiser le mot de passe
              </button>
              {isErrorResetPwd && message && (
                <p className="font-semibold text-red-500">{message}</p>
              )}
              {isSuccessResetPwd && message && (
                <p className="font-semibold text-green-500">{message}</p>
              )}
              {isPendingResetPwd && message && <LoadingClient />}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { User } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { getValidationEditUser } from "./validationSchemaEditUser";
import { GetSyndicats } from "@/types/syndicats";
import useModifyUser from "@/hooks/settings/useModifyUser";
import LoadingClient from "@/components/Loading/Loading";

export default function EditUser({
  setEditOpen,
  user,
  syndicats,
}: {
  setEditOpen: Dispatch<SetStateAction<number | null>>;
  user: User;
  syndicats: GetSyndicats;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getValidationEditUser()),
    defaultValues: user,
  });

  const { modifyUserMutate, isErrorModifyUser, message, isPendingModifyUser, isSuccessModifyUser } =
    useModifyUser();

  return (
    <div className="fixed top-0 left-0 z-50 w-full min-h-[100vh] flex justify-center items-center bg-[rgba(255,255,255,.7)]">
      <div className="flex items-center justify-center w-full h-full px-4 py-5 sm:p-6">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-xl">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-xl font-bold text-gray-900">
              Modifier les informations d&apos;un utilisateur
            </p>

            <form
              onSubmit={handleSubmit((data) => modifyUserMutate(data))}
              className="flex flex-col space-y-3"
            >
              <div className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor="civilite"
                    className="text-sm font-bold text-gray-900"
                  >
                    Civilité
                  </label>
                  <select
                    id="civilite"
                    {...register("civilite")}
                    className="block w-full py-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                  >
                    <option value=""></option>
                    <option value="Mr">Mr</option>
                    <option value="Mme">Mme</option>
                  </select>

                  {errors.civilite && (
                    <p className="text-red-500">{errors.civilite.message}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor="surname"
                    className="text-sm font-bold text-gray-900"
                  >
                    {" "}
                    Nom{" "}
                  </label>
                  <input
                    id="surname"
                    {...register("surname")}
                    className="block w-full px-4 py-3 placeholder-gray-500 border -gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                  />
                  {errors.surname && (
                    <p className="text-red-500">{errors.surname.message}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor="first_name"
                    className="text-sm font-bold text-gray-900"
                  >
                    {" "}
                    Prénom{" "}
                  </label>
                  <input
                    id="first_name"
                    {...register("first_name")}
                    className="block w-full px-4 py-3 placeholder-gray-500 border -gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                  />
                  {errors.first_name && (
                    <p className="text-red-500">{errors.first_name.message}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor="email"
                    className="text-sm font-bold text-gray-900"
                  >
                    {" "}
                    Email{" "}
                  </label>
                  <input
                    id="email"
                    {...register("email")}
                    className="block w-full px-4 py-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-3">
                  <label className="text-sm font-bold text-gray-900">
                    Copropriétés
                  </label>
                  <Controller
                    name="syndicats"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        onChange={(selected) => field.onChange(selected)}
                        value={field.value}
                        options={syndicats.map((syndicat) => ({
                          id: syndicat.syndicat_id,
                          name: syndicat.name,
                        }))}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id.toString()}
                      />
                    )}
                  />
                  {errors.syndicats && (
                    <p className="text-red-500">{errors.syndicats.message}</p>
                  )}
                </div>

                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor="role"
                    className="text-sm font-bold text-gray-900"
                  >
                    Rôle
                  </label>
                  <select
                    id="role"
                    {...register("role")}
                    className="block w-full py-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                  >
                    <option value="admin">Administrateur</option>
                    <option value="user">Utilisateur</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500">{errors.role.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end mt-5 space-x-4">
                <button
                  onClick={() => setEditOpen(null)}
                  className="cursor-pointer inline-flex items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-gray-600 transition-all duration-200 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="cursor-pointer inline-flex items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-violet-custom border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-custom hover:bg-violet-custom"
                >
                  Modifier
                </button>
              </div>
              {isErrorModifyUser && message && (
                <p className="font-semibold text-red-500">{message}</p>
              )}
              {isPendingModifyUser && <LoadingClient />}
              {isSuccessModifyUser && message && (
                <p className="font-semibold text-green-500">{message}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import LoadingClient from "@/components/Loading/Loading";
import { GetCategories } from "@/types/categories";
import { getValidationEditSyndicat } from "./validationSchemaEditSyndicat";
import { Syndicat } from "@/types/syndicats";
import useModifySyndicat from "@/hooks/settings/useModifySyndicat";

export default function EditSyndicat({
  setEditOpen,
  categories,
  syndicat,
}: {
  setEditOpen: Dispatch<SetStateAction<number | null>>;
  categories: GetCategories;
  syndicat: Syndicat;
}) {

  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getValidationEditSyndicat()),
    defaultValues: {
      syndicat_id: syndicat.syndicat_id,
      categories: syndicat.categories_syndicats,
    },
  });

  const {
    modifySyndicatMutate,
    isErrorModifySyndicat,
    message,
    isPendingModifySyndicat,
  } = useModifySyndicat();

  return (
    <div className="fixed top-0 left-0 z-50 w-full min-h-[100vh] flex justify-center items-center bg-[rgba(255,255,255,.7)]">
      <div className="flex items-center justify-center w-full h-full px-4 py-5 sm:p-6">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-xl">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-xl font-bold text-gray-900">
              Modifier un syndicat
            </p>

            <form
              onSubmit={handleSubmit((data) => modifySyndicatMutate(data))}
              className="flex flex-col space-y-3 mt-6"
            >
              <div className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <label
                    htmlFor="name"
                    className="text-sm font-bold text-gray-900"
                  >
                    {" "}
                    Nom{" "}
                  </label>
                  <input
                    id="name"
                    value={syndicat.name}
                    readOnly={true}
                    className="block w-full px-4 py-3 placeholder-gray-500 border -gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                  />
                </div>

                <div className="flex flex-col space-y-3">
                  <label className="text-sm font-bold text-gray-900">
                    Categories
                  </label>
                  <Controller
                    name="categories"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        onChange={(selected) => field.onChange(selected)}
                        value={field.value}
                        options={categories.map((category) => ({
                          id: category.category_id,
                          name: category.name,
                        }))}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id.toString()}
                      />
                    )}
                  />
                  {errors.categories && (
                    <p className="text-red-500">{errors.categories.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end mt-5 space-x-4">
                <button
                  onClick={() => setEditOpen(null)}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-gray-600 transition-all duration-200 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-violet-custom border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-custom hover:bg-violet-custom"
                >
                  Ajouter
                </button>
              </div>
              {isErrorModifySyndicat && message && (
                <p className="font-semibold text-red-500">{message}</p>
              )}
              {isPendingModifySyndicat && <LoadingClient />}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

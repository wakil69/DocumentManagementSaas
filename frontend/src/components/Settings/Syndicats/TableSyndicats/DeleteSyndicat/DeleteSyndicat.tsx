import LoadingClient from "@/components/Loading/Loading";
import useDeleteSyndicat from "@/hooks/settings/useDeleteSyndicat";
import { Syndicat } from "@/types/syndicats";
import { Dispatch, SetStateAction } from "react";

export default function DeleteSyndicat({
  setDeleteOpen,
  syndicat,
}: {
  setDeleteOpen: Dispatch<SetStateAction<number | null>>;
  syndicat: Syndicat;
}) {
  const {
    deleteSyndicatMutate,
    isPendingDeleteSyndicat,
    message,
    isErrorDeleteSyndicat,
  } = useDeleteSyndicat();

  return (
    <div className="fixed top-0 left-0 z-50 w-full min-h-[100vh] flex justify-center items-center bg-[rgba(255,255,255,.7)]">
      <div className="flex items-center justify-center w-full h-full px-4 py-5 sm:p-6">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-xl">
          <div className="px-4 py-5 sm:p-6 flex flex-col space-y-3">
            <svg
              className="text-gray-900 w-9 h-9"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <p className="mt-5 text-xl font-bold text-gray-900">
              Supprimer {syndicat.name}?
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Veuillez confirmer que vous souhaitez bien continuer.
            </p>
            <div className="flex items-center mt-8 space-x-4">
              <button
                type="button"
                onClick={() => setDeleteOpen(null)}
                className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-gray-600 transition-all duration-200 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() => deleteSyndicatMutate({ syndicat_id: syndicat.syndicat_id })} 
                className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-red-500 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
            {isErrorDeleteSyndicat && message && (
              <p className="font-semibold text-red-500">{message}</p>
            )}
            {isPendingDeleteSyndicat && <LoadingClient />}
          </div>
        </div>
      </div>
    </div>
  );
}

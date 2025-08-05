import LoadingClient from "@/components/Loading/Loading";
import useExpirationDate from "@/hooks/docs/useExpirationDate";
import { Dispatch, SetStateAction, useState } from "react";

export default function EditExpirationDate({
  setEditDoc,
  doc,
  syndicatId,
  categoryId,
  expirationDate,
  page,
}: {
  setEditDoc: Dispatch<SetStateAction<string | null>>;
  doc: string;
  syndicatId: number;
  categoryId: number;
  page: number;
  expirationDate: string;
}) {
  const [newDate, setNewDate] = useState(
    expirationDate ? expirationDate.slice(0, 10) : ""
  );
  const {
    expirationDateMutate,
    isErrorExpirationDate,
    isPendingExpirationDate,
    message,
  } = useExpirationDate(setEditDoc, syndicatId, categoryId, page);

  const handleSubmit = () => {
    expirationDateMutate({
      file_name: doc,
      syndicat_id: syndicatId,
      category_id: categoryId,
      expiration_date: newDate,
    });
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full min-h-[100vh] flex justify-center items-center bg-[rgba(255,255,255,.7)]">
      <div className="flex items-center justify-center w-full h-full px-4 py-5 sm:p-6">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-xl">
          <div className="flex flex-col space-y-3 px-4 py-5 sm:p-6">
            <h2 className="text-lg font-bold mb-4">
              Modifier la date d’expiration
            </h2>

            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full mb-4 border border-gray-300 rounded-md px-2 py-1 text-sm"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditDoc(null)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPendingExpirationDate}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Valider
              </button>
            </div>

            {isPendingExpirationDate && <LoadingClient />}
            {isErrorExpirationDate && message && (
              <p className="mt-2 text-sm text-red-500 font-semibold">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

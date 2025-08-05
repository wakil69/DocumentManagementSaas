import LoadingClient from "@/components/Loading/Loading";
import useInfosSyndicat from "@/hooks/docs/useInfosSyndicats";
import useProfile from "@/hooks/useProfile";
import { GetCategories } from "@/types/categories";
import { SyndicatsAllowed } from "@/types/syndicats";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

export default function Filters({
  syndicatsAllowed,
  setSelectedCategory,
  setSelectedSyndicat,
  selectedCategory,
  selectedSyndicat,
  categories,
  isFetchingCategories,
}: {
  syndicatsAllowed: SyndicatsAllowed;
  selectedCategory: number | null;
  selectedSyndicat: number | null;
  setSelectedCategory: Dispatch<SetStateAction<number | null>>;
  setSelectedSyndicat: Dispatch<SetStateAction<number | null>>;
  categories: GetCategories;
  isFetchingCategories: boolean;
}) {
  const { profile } = useProfile();
  const {
    modifyInfosSyndicatMutate,
    isPendingModifyInfosSyndicat,
    isSuccessModifyInfosSyndicat,
    isErrorModifyInfosSyndicat,
    message,
  } = useInfosSyndicat();

  const [editableInfos, setEditableInfos] = useState("");

  useEffect(() => {
    const selected = syndicatsAllowed.find(
      (s) => s.syndicat_id === selectedSyndicat
    );
    setEditableInfos(selected?.infos || "");
  }, [selectedSyndicat, syndicatsAllowed]);

  const handleModify = () => {
    if (selectedSyndicat !== null) {
      modifyInfosSyndicatMutate({
        syndicat_id: selectedSyndicat,
        infos: editableInfos,
      });
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-wrap space-x-6">
        <div className="flex flex-col space-y-3">
          <label
            htmlFor="syndicats"
            className="text-sm font-bold text-gray-900"
          >
            Syndicats
          </label>
          <select
            id="syndicats"
            value={selectedSyndicat ?? ""}
            onChange={(e: any) => setSelectedSyndicat(Number(e.target.value))}
            className="block w-full py-3 pl-4 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
          >
            {syndicatsAllowed.map((syndicatAllowed) => (
              <option
                key={syndicatAllowed.syndicat_id}
                value={syndicatAllowed.syndicat_id}
              >
                {syndicatAllowed.name}
              </option>
            ))}
          </select>
        </div>
        {!isFetchingCategories && (
          <div className="flex flex-col space-y-3">
            <label
              htmlFor="categories"
              className="text-sm font-bold text-gray-900"
            >
              Catégories
            </label>
            <select
              id="categories"
              value={selectedCategory ?? ""}
              onChange={(e: any) => setSelectedCategory(Number(e.target.value))}
              className="block w-full py-3 pl-4 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-3">
        <label htmlFor="syndicats" className="text-sm font-bold text-gray-900">
          Informations sur le syndicat
        </label>
        {
          profile?.role === "admin" && (
            <>
              <textarea
                id="infos"
                className="w-96 h-32 p-2 border border-gray-300 rounded-md bg-white"
                value={editableInfos}
                onChange={(e) => setEditableInfos(e.target.value)}
              />
              <button
                type="button"
                onClick={handleModify}
                disabled={isPendingModifyInfosSyndicat}
                className="max-w-32 duration-200 cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-custom hover:bg-violet-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-700"
              >
                <EditIcon />
                Modifier
              </button>
              {isPendingModifyInfosSyndicat && <LoadingClient />}
              {isErrorModifyInfosSyndicat && message && (
                <p className="font-semibold text-red-500">{message}</p>
              )}
              {isSuccessModifyInfosSyndicat && message && (
                <p className="font-semibold text-green-500">{message}</p>
              )}
            </>
          ) 
          // (
          //   <p className="max-w-md text-sm text-gray-700 whitespace-pre-line">
          //     {
          //       syndicatsAllowed.find(
          //         (syndicat) => syndicat.syndicat_id === selectedSyndicat
          //       )?.infos
          //     }
          //   </p>
          // )
        }
        
      </div>
    </div>
  );
}

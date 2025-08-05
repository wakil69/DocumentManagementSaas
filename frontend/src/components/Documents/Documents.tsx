"use client";
import useSyndicatsAllowed from "@/hooks/docs/useSyndicatsAllowed";
import { SyndicatsAllowed } from "@/types/syndicats";
import { useEffect, useState } from "react";
import Filters from "./Filters/Filters";
import useCategoriesSyndicat from "@/hooks/docs/useCategoriesSyndicat";
import useProfile from "@/hooks/useProfile";
import ImportFilesButton from "./ImportButtonFiles/ImportButtonFiles";
import TableDocuments from "./TableDocuments/TableDocuments";

export default function Documents({
  syndicatsAllowedInitial,
}:
{
  syndicatsAllowedInitial: SyndicatsAllowed;
}) {
  const [selectedSyndicat, setSelectedSyndicat] = useState<null | number>(
    syndicatsAllowedInitial[0].syndicat_id ?? null
  );
  const { syndicatsAllowed } = useSyndicatsAllowed(
    syndicatsAllowedInitial
  );
  const { profile } = useProfile();
  const { categories, isFetchingCategories } =
    useCategoriesSyndicat(selectedSyndicat);

  const [selectedCategory, setSelectedCategory] = useState<null | number>(null);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].category_id);
    }
  }, [categories, selectedCategory]);

  return (
    <div className="min-h-screen w-full py-6 flex flex-col space-y-9 my-12">
      {profile && (
        <h1 className="text-orange-custom text-2xl">
          Bienvenue {profile.civilite} {profile.first_name} !
        </h1>
      )}
      <Filters
        isFetchingCategories={isFetchingCategories}
        categories={categories}
        selectedSyndicat={selectedSyndicat}
        selectedCategory={selectedCategory}
        syndicatsAllowed={syndicatsAllowed}
        setSelectedCategory={setSelectedCategory}
        setSelectedSyndicat={setSelectedSyndicat}
      />
      {profile?.role === "admin" && selectedCategory && selectedSyndicat && (
        <ImportFilesButton
          syndicatId={selectedSyndicat}
          selectedCategory={selectedCategory}
        />
      )}
      {selectedCategory && selectedSyndicat ? (
        <TableDocuments
          syndicatId={selectedSyndicat}
          categoryId={selectedCategory}
        />
      ) : (
        <p>Il n&apos;y a aucun document à afficher.</p>
      )}
    </div>
  );
}

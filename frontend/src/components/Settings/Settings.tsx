"use client";
import { GetUsers } from "@/types/users";
import Syndicats from "./Syndicats/Syndicats";
import Users from "./Users/Users";
import { GetSyndicats } from "@/types/syndicats";
import useSyndicats from "@/hooks/settings/useSyndicats";
import Categories from "./CategoriesSyndicats/Categories";
import useCategories from "@/hooks/settings/useCategories";
import { GetCategories } from "@/types/categories";

export default function Settings({
  usersInitial,
  syndicatsInitial,
  categoriesInitial,
}: {
  usersInitial: GetUsers;
  syndicatsInitial: GetSyndicats;
  categoriesInitial: GetCategories;
}) {
  const { syndicats, isFetchingSyndicat } = useSyndicats(syndicatsInitial);
  const { categories, isFetchingCategories } = useCategories(categoriesInitial);

  return (
    <div className="min-h-screen w-full py-6 flex flex-col space-y-9">
      <Users usersInitial={usersInitial} syndicats={syndicats} />
      <Syndicats
        syndicats={syndicats}
        categories={categories}
        isFetchingSyndicat={isFetchingSyndicat}
      />
      <Categories
        categories={categories}
        isFetchingCategories={isFetchingCategories}
      />
    </div>
  );
}

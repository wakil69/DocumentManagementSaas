"use client";
import TableSyndicats from "./TableSyndicats/TableSyndicats";
import LoadingClient from "@/components/Loading/Loading";
import { GetCategories } from "@/types/categories";
import { GetSyndicats } from "@/types/syndicats";

export default function Syndicats({
  syndicats,
  isFetchingSyndicat,
  categories
}: {
  syndicats: GetSyndicats;
  isFetchingSyndicat: boolean;
  categories: GetCategories
}) {
  return (
    <>
      {isFetchingSyndicat ? (
        <LoadingClient />
      ) : (
        <TableSyndicats syndicats={syndicats} categories={categories} />
      )}
    </>
  );
}

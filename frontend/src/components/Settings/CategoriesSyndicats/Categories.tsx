"use client";
import LoadingClient from "@/components/Loading/Loading";
import TableCategories from "./TableCategories/TableCategories";
import { GetCategories } from "@/types/categories";

export default function Categories({
  categories,
  isFetchingCategories,
}: {
  categories: GetCategories;
  isFetchingCategories: boolean;
}) {
  return (
    <>
      {isFetchingCategories ? (
        <LoadingClient />
      ) : (
        <TableCategories categories={categories} />
      )}
    </>
  );
}

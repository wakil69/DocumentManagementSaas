import customRequest from "@/lib/axios";
import { GetCategories } from "@/types/categories";
import { useQuery } from "@tanstack/react-query";

export default function useCategories(categoriesInitial: GetCategories) {
  const getCategories = async () => {
    try {
      const response = await customRequest.get<
        GetCategories
      >("/settings/categories");

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error("Server Error");
    }
  };

  const { data: categories = [], isFetching: isFetchingCategories } = useQuery({
    queryKey: ["categories-syndicats"],
    queryFn: getCategories,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    initialData: categoriesInitial,
  });

  return { categories, isFetchingCategories };
}

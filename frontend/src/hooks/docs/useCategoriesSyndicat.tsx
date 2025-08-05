import customRequest from "@/lib/axios";
import { GetCategories } from "@/types/categories";
import { useQuery } from "@tanstack/react-query";

export default function useCategoriesSyndicat(
  syndicatId: number | null
) {
  const getDocs = async () => {
    try {

      if (!syndicatId) {
        return [];
      }

      const response = await customRequest.get<GetCategories>(
        `/documents/categories?syndicat_id=${syndicatId}`
      );

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
    queryKey: ["syndicats", "categories", syndicatId],
    queryFn: getDocs,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!syndicatId,
  });

  return { categories, isFetchingCategories };
}

import customRequest from "@/lib/axios";
import { GetDocuments } from "@/types/documents";
import { useQuery } from "@tanstack/react-query";

export default function useDocs(syndicatId: number, categoryId: number, page: number) {
  const getDocs = async () => {
    try {
      const response = await customRequest.get<
        GetDocuments
      >(`/documents?syndicat_id=${syndicatId}&category_id=${categoryId}&page=${page}`);

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error("Server Error");
    }
  };

  const { data: docs, isFetching: isFetchingCategories } = useQuery({
    queryKey: ["docs", syndicatId, categoryId, page],
    queryFn: getDocs,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!categoryId
  });

  return { docs, isFetchingCategories };
}

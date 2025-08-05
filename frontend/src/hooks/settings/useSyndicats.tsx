import customRequest from "@/lib/axios";
import { GetSyndicats } from "@/types/syndicats";
import { useQuery } from "@tanstack/react-query";

export default function useSyndicats(syndicatsInitial: GetSyndicats) {
  const getSyndicats = async () => {
    try {
      const response = await customRequest.get<
        GetSyndicats
      >("/settings/syndicats");

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error("Server Error");
    }
  };

  const { data: syndicats = [], isFetching: isFetchingSyndicat } = useQuery({
    queryKey: ["syndicats"],
    queryFn: getSyndicats,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    initialData: syndicatsInitial,
  });

  return { syndicats, isFetchingSyndicat };
}

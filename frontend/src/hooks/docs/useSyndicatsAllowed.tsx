import customRequest from "@/lib/axios";
import { SyndicatsAllowed } from "@/types/syndicats";
import { useQuery } from "@tanstack/react-query";

export default function useSyndicatsAllowed(
  syndicatsAllowedInitial: SyndicatsAllowed
) {
  const getDocs = async () => {
    try {
      const response = await customRequest.get<SyndicatsAllowed>(
        "/documents/syndicats"
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

  const { data: syndicatsAllowed = [], isFetching: isFetchingSyndicatsAllowed } = useQuery({
    queryKey: ["syndicats", "allowed"],
    queryFn: getDocs,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    initialData: syndicatsAllowedInitial,
  });

  return { syndicatsAllowed, isFetchingSyndicatsAllowed };
}

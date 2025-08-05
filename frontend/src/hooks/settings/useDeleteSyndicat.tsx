import customRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useDeleteSyndicat() {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteSyndicat = async (syndicat_id: number) => {
    try {
      setMessage(null);
      const response = await customRequest.delete(
        `/settings/syndicats/${syndicat_id}`
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      } else {
        throw new Error(
          "Une erreur inattendue est survenue. Veuillez réessayer."
        );
      }
    }
  };

  const {
    mutate: deleteSyndicatMutate,
    isSuccess: isSuccessDeleteSyndicat,
    isError: isErrorDeleteSyndicat,
    isPending: isPendingDeleteSyndicat,
  } = useMutation({
    mutationFn: (data: { syndicat_id: number }) =>
      deleteSyndicat(data.syndicat_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syndicats"] });
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    deleteSyndicatMutate,
    isErrorDeleteSyndicat,
    isSuccessDeleteSyndicat,
    isPendingDeleteSyndicat,
    message,
  };
}

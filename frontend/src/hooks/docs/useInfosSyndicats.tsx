import customRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useInfosSyndicat() {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const setInfosSyndicat = async (data: { syndicat_id: number; infos: string }) => {
    try {
      setMessage(null);
      const response = await customRequest.put("/documents/infos-syndicat", data);

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
    mutate: modifyInfosSyndicatMutate,
    isSuccess: isSuccessModifyInfosSyndicat,
    isError: isErrorModifyInfosSyndicat,
    isPending: isPendingModifyInfosSyndicat,
  } = useMutation({
    mutationFn: (data: { syndicat_id: number; infos: string }) => setInfosSyndicat(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["syndicats"] });
      setMessage(data.message)
      setTimeout(() => setMessage(null), 3000)
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    modifyInfosSyndicatMutate,
    isErrorModifyInfosSyndicat,
    isSuccessModifyInfosSyndicat,
    isPendingModifyInfosSyndicat,
    message,
  };
}

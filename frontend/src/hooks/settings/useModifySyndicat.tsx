import customRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useModifySyndicat() {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const modifySyndicat = async (data: { syndicat_id: number; categories: { id: number; name: string }[]}) => {
    try {
      setMessage(null);
      const response = await customRequest.put("/settings/syndicats", data);

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
    mutate: modifySyndicatMutate,
    isSuccess: isSuccessModifySyndicat,
    isError: isErrorModifySyndicat,
    isPending: isPendingModifySyndicat,
  } = useMutation({
    mutationFn: (data: { syndicat_id: number; categories: { id: number; name: string }[]}) => modifySyndicat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syndicats"] });
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    modifySyndicatMutate,
    isErrorModifySyndicat,
    isSuccessModifySyndicat,
    isPendingModifySyndicat,
    message,
  };
}

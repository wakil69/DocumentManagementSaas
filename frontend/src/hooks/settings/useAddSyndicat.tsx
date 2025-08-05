import customRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useAddSyndicat() {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const addSyndicat = async (data: { name: string; categories: { id: number; name: string }[]}) => {
    try {
      setMessage(null);
      const response = await customRequest.post("/settings/syndicats", data);

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
    mutate: addSyndicatMutate,
    isSuccess: isSuccessAddSyndicat,
    isError: isErrorAddSyndicat,
    isPending: isPendingAddSyndicat,
  } = useMutation({
    mutationFn: (data: { name: string; categories: { id: number; name: string }[]}) => addSyndicat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syndicats"] });
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    addSyndicatMutate,
    isErrorAddSyndicat,
    isSuccessAddSyndicat,
    isPendingAddSyndicat,
    message,
  };
}

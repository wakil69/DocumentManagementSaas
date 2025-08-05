import customRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

export default function useDeleteDoc(setDeleteOpen: Dispatch<SetStateAction<string | null>>) {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteFile = async (data: { syndicat_id: number; category_id:number; file_name: string}) => {
    try {
      setMessage(null);
      const response = await customRequest.put("/documents", data);

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
    mutate: deleteDocMutate,
    isSuccess: isSuccessDeleteDoc,
    isError: isErrorDeleteDoc,
    isPending: isPendingDeleteDoc,
  } = useMutation({
    mutationFn: (data: { syndicat_id: number; category_id:number; file_name: string}) => deleteFile(data),
    onSuccess: () => {
      setDeleteOpen(null)
      queryClient.invalidateQueries({ queryKey: ["docs"] });
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    deleteDocMutate,
    isErrorDeleteDoc,
    isSuccessDeleteDoc,
    isPendingDeleteDoc,
    message,
  };
}

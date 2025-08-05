import customRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

export default function useExpirationDate(
  setEditDoc: Dispatch<SetStateAction<string | null>>,
  syndicatId: number,
  categoryId: number,
  page: number
) {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const modifyExpirationDate = async (data: {
    category_id: number;
    syndicat_id: number;
    file_name: string;
    expiration_date: string;
  }) => {
    try {
      setMessage(null);
      const response = await customRequest.put("/documents/expiration-date", data);

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
    mutate: expirationDateMutate,
    isSuccess: isSuccessExpirationDate,
    isError: isErrorExpirationDate,
    isPending: isPendingExpirationDate,
  } = useMutation({
    mutationFn: (data: {
      category_id: number;
      syndicat_id: number;
      file_name: string;
      expiration_date: string;
    }) => modifyExpirationDate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs", syndicatId, categoryId, page] });
      setEditDoc(null);
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    expirationDateMutate,
    isErrorExpirationDate,
    isSuccessExpirationDate,
    isPendingExpirationDate,
    message,
  };
}

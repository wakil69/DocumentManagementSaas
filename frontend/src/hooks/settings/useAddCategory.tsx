import customRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useAddCategory() {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const addCategory = async (data: { name: string }) => {
    try {
      setMessage(null);
      const response = await customRequest.post("/settings/categories", data);

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
    mutate: addCategoryMutate,
    isSuccess: isSuccessAddCategory,
    isError: isErrorAddCategory,
    isPending: isPendingAddCategory,
  } = useMutation({
    mutationFn: (data: { name: string }) => addCategory(data),
    onSuccess: (data: { message: string }) => {
      queryClient.invalidateQueries({ queryKey: ["categories-syndicats"] })
      setMessage(data.message);
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    addCategoryMutate,
    isErrorAddCategory,
    isSuccessAddCategory,
    isPendingAddCategory,
    message,
  };
}

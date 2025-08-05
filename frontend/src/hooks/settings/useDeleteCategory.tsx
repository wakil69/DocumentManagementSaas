import customRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useDeleteCategory() {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteCategory = async (category_id: number) => {
    try {
      setMessage(null);
      const response = await customRequest.delete(
        `/settings/categories/${category_id}`
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
    mutate: deleteCategoryMutate,
    isSuccess: isSuccessDeleteCategory,
    isError: isErrorDeleteCategory,
    isPending: isPendingDeleteCategory,
  } = useMutation({
    mutationFn: (data: { category_id: number }) =>
        deleteCategory(data.category_id),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories-syndicats"] })
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    deleteCategoryMutate,
    isErrorDeleteCategory,
    isSuccessDeleteCategory,
    isPendingDeleteCategory,
    message,
  };
}

import customRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useDeleteUser() {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteUser = async (data: { user_id: number }) => {
    try {
      setMessage(null);
      const response = await customRequest.delete(
        `/settings/users/${data.user_id}`
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
    mutate: deleteUserMutate,
    isSuccess: isSuccessDeleteUser,
    isError: isErrorDeleteUser,
    isPending: isPendingDeleteUser,
  } = useMutation({
    mutationFn: (data: { user_id: number }) => deleteUser(data),
    onSuccess: (data) => {
      setMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    deleteUserMutate,
    isErrorDeleteUser,
    isSuccessDeleteUser,
    isPendingDeleteUser,
    message,
  };
}

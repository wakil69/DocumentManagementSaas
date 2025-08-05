import customRequest from "@/lib/axios";
import { User } from "@/types/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useModifyUser() {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const modifyUser = async (data: User) => {
    try {
      setMessage(null);
      const response = await customRequest.put("/settings/users", data);

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
    mutate: modifyUserMutate,
    isSuccess: isSuccessModifyUser,
    isError: isErrorModifyUser,
    isPending: isPendingModifyUser,
  } = useMutation({
    mutationFn: (data: User) => modifyUser(data),
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
    modifyUserMutate,
    isErrorModifyUser,
    isSuccessModifyUser,
    isPendingModifyUser,
    message,
  };
}

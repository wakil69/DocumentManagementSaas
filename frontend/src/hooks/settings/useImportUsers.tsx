import customRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useImportUsers() {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const importUsers = async (file: File) => {
    try {
      setMessage(null);

      const formData = new FormData();
      formData.append("addAccounts", file);

      const response = await customRequest.post("/settings/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
    mutate: importUsersMutate,
    isSuccess: isSuccessImportUsers,
    isError: isErrorImportUsers,
    isPending: isPendingImportUsers,
  } = useMutation({
    mutationFn: (data: { file: File }) => importUsers(data.file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    importUsersMutate,
    isSuccessImportUsers,
    isErrorImportUsers,
    isPendingImportUsers,
    message,
  };
}

import customRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

export default function useImportDocs(
  syndicat_id: number,
  category_id: number,
  setImportOpen: Dispatch<SetStateAction<boolean>>
) {
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const importDocs = async ({
    files,
    expirationDates,
  }: {
    files: File[];
    expirationDates: string[];
  }) => {
    try {
      setMessage(null);

      const formData = new FormData();

      formData.append("syndicat_id", syndicat_id.toString());
      formData.append("category_id", category_id.toString());

      files.forEach((file) => {
        formData.append("documents", file);
      });

      expirationDates.forEach((date) => {
        formData.append("expiration_dates[]", date || "");
      });
      
      const response = await customRequest.post("/documents/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else {
        throw new Error(
          "Une erreur inattendue est survenue. Veuillez réessayer."
        );
      }
    }
  };

  const {
    mutate: importDocsMutate,
    isSuccess: isSuccessImportDocs,
    isError: isErrorImportDocs,
    isPending: isPendingImportDocs,
  } = useMutation({
    mutationFn: (data: { files: File[]; expirationDates: string[] }) =>
      importDocs(data),
    onSuccess: (data: { message: string }) => {
      setMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["docs"] });
      setImportOpen(false);
      setTimeout(() => setMessage(null), 3000);
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    importDocsMutate,
    isSuccessImportDocs,
    isErrorImportDocs,
    isPendingImportDocs,
    message,
  };
}

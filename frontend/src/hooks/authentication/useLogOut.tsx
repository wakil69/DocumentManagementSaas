import customRequest from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function useLogout() {
  const [message, setMessage] = useState<string | null>(null);

  const logout = async () => {
    try {
      setMessage(null);
      const response = await customRequest.post("/authentication/logout");

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
    mutate: logoutMutate,
    isSuccess: isSuccessLogOut,
    isError: isErrorLogOut,
    isPending: isPendingLogOut,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    logoutMutate,
    isErrorLogOut,
    isSuccessLogOut,
    isPendingLogOut,
    message,
  };
}

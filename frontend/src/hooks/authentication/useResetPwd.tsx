import customRequest from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function useResetPwd(token: string) {

  const [message, setMessage] = useState<string | null>(null);

  const resetPwd = async (data: {
    new_password: string;
    confirmation_new_password: string;
  }) => {
    try {
      
      setMessage(null);

      const response = await customRequest.put(
        `/authentication/reset-pwd/${token}`,
        { new_password: data.new_password }
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
    mutate: resetPwdMutate,
    isSuccess: isSuccessResetPwd,
    isError: isErrorResetPwd,
    isPending: isPendingResetPwd,
  } = useMutation({
    mutationFn: (data: {
      new_password: string;
      confirmation_new_password: string;
    }) => resetPwd(data),
    onSuccess: (data: { message: string }) => {
      setMessage(data.message);
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    resetPwdMutate,
    isErrorResetPwd,
    isSuccessResetPwd,
    isPendingResetPwd,
    message,
  };
}

import customRequest from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function usePwdForgotten() {
    const [message, setMessage] = useState<string | null>(null);
  
    const pwdForgotten = async (data : { email: string }) => {
      try {
        setMessage(null)
        const response = await customRequest.post("/authentication/reset-pwd-link", data);
  
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
      mutate: pwdForgottenMutate,
      isSuccess: isSuccessPwdForgotten,
      isError: isErrorPwdForgotten,
      isPending: isPendingPwdForgotten,
    } = useMutation({
      mutationFn: (data: { email: string }) => pwdForgotten(data),
      onSuccess: (data: { message: string }) => {
        setMessage(data.message)
      },
      onError: (err: any) => {
        console.error(err)
        setMessage(err.message);
      },
    });
  
    return { pwdForgottenMutate, isErrorPwdForgotten, isSuccessPwdForgotten, isPendingPwdForgotten, message };
  
}
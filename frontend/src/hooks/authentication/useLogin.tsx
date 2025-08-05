import customRequest from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useLogin() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  const login = async (data: { email: string; password: string }) => {
    try {
      setMessage(null);
      const response = await customRequest.post("/authentication/login", data);

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
    mutate: loginMutate,
    isSuccess: isSuccessLogin,
    isError: isErrorLogin,
    isPending: isPendingLogin,
  } = useMutation({
    mutationFn: (data: { email: string; password: string }) => login(data),
    onSuccess: (data: { first_login: boolean }) => {
      if (data.first_login) {
        router.push("/first-login");
      } else {
        router.push("/documents");
      }
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return { loginMutate, isErrorLogin, isSuccessLogin, isPendingLogin, message };
}

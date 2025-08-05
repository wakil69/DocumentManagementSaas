import customRequest from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useFirstLogin() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  const firstLogin = async (data: { password: string }) => {
    try {
      setMessage(null);
      const response = await customRequest.put(
        "/authentication/first-login",
        data
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
    mutate: firstLoginMutate,
    isSuccess: isSuccessFirstLogin,
    isError: isErrorFirstLogin,
    isPending: isPendingFirstLogin,
  } = useMutation({
    mutationFn: (data: { password: string }) => firstLogin(data),
    onSuccess: () => {
      router.push("/documents");
    },
    onError: (err: any) => {
      console.error(err);
      setMessage(err.message);
    },
  });

  return {
    firstLoginMutate,
    isErrorFirstLogin,
    isSuccessFirstLogin,
    isPendingFirstLogin,
    message,
  };
}

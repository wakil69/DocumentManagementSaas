import PwdForgotten from "@/components/Authentication/PwdForgotten/PwdForgotten";
import customRequest from "@/lib/axios";
import { fetchData, isStatus500 } from "@/utilities/fetchData";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PwdForgottenPage() {
  const cookieStore = await cookies();
  const connected = cookieStore.get("connect.sid");

  if (connected) {
    const checkFirstLogin = await fetchData(
      customRequest.get<{ first_login: boolean }>(
        "/authentication/check-first-login"
      )
    );

    if (isStatus500(checkFirstLogin)) {
      return <div>{checkFirstLogin.message}</div>;
    }

    if (checkFirstLogin.first_login) {
      return redirect("/first-login");
    }

    redirect("/documents");
  }

  return <PwdForgotten />;
}

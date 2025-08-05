import ResetPwd from "@/components/Authentication/ResetPwd/ResetPwd";
import TokenExpired from "@/components/Authentication/TokenExpired/TokenExpired";
import customRequest from "@/lib/axios";
import { fetchData, isStatus500 } from "@/utilities/fetchData";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ResetPwdPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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

  const checkToken = await fetchData(
    customRequest.get<{ valid: boolean; message?: string }>(
      `/authentication/check-token-reset-pwd/${slug}`
    )
  );

  if ("valid" in checkToken && !checkToken.valid) {
    return <TokenExpired />;
  }

  return <ResetPwd token={slug} />;
}

import { ReactNode } from "react";
import { cookies } from "next/headers";
import customRequest from "@/lib/axios";
import { fetchData, isStatus500 } from "@/utilities/fetchData";
import { redirect } from "next/navigation";
import VerticalMenu from "@/components/VerticalMenu/VerticalMenu";

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const connected = cookieStore.get("connect.sid");
  
  if (!connected) {
    redirect("/");
  }

  const [checkFirstLogin, checkAdmin] = await Promise.all([
    fetchData(
      customRequest.get<{ first_connection: boolean }>(
        "/authentication/check-first-login"
      )
    ),
    fetchData(
      customRequest.get<{ isAdmin: boolean }>(
        "/authentication/check-admin"
      )
    ),
  ]);

  if (isStatus500(checkFirstLogin)) {
    return <div>{checkFirstLogin.message}</div>;
  }

  if (checkFirstLogin.first_connection) {
    redirect("/first-login");
  }

  if (isStatus500(checkAdmin)) {
    return <div>{checkAdmin.message}</div>;
  }

  return <VerticalMenu isAdmin={checkAdmin.isAdmin}>{children}</VerticalMenu>;
}

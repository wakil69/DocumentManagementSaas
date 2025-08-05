import Documents from "@/components/Documents/Documents";
import customRequest from "@/lib/axios";
import { SyndicatsAllowed } from "@/types/syndicats";
import { fetchData, isStatus401, isStatus500 } from "@/utilities/fetchData";

export default async function DocsPage() {
  type SyndicatsAllowedResponse =
    | SyndicatsAllowed
    | { status: 401; message: string }
    | { status: 500; message: string };

  const syndicatsAllowed = await fetchData(customRequest.get<SyndicatsAllowedResponse>("/documents/syndicats"))

  if (isStatus401(syndicatsAllowed) || isStatus500(syndicatsAllowed)) {
    return <div>{syndicatsAllowed.message}</div>;
  }  

  return <Documents syndicatsAllowedInitial={syndicatsAllowed} />
}

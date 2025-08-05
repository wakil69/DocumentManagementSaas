"use client";
import useUsers from "@/hooks/settings/useUsers";
import LoadingClient from "@/components/Loading/Loading";
import { GetUsers } from "@/types/users";
import { GetSyndicats } from "@/types/syndicats";
import TableUsers from "./TableUsers/TableUsers";

export default function Users({
  usersInitial,
  syndicats,
}: {
  usersInitial: GetUsers;
  syndicats: GetSyndicats;
}) {
  const { users, isFetchingUsers } = useUsers(usersInitial);

  return (
    <div className="my-12">
      {isFetchingUsers ? (
        <LoadingClient />
      ) : (
        <TableUsers users={users} syndicats={syndicats} />
      )}
    </div>
  );
}

import Settings from "@/components/Settings/Settings";
import customRequest from "@/lib/axios";
import { GetCategories } from "@/types/categories";
import { GetSyndicats } from "@/types/syndicats";
import { GetUsers } from "@/types/users";
import { fetchData, isStatus401, isStatus500 } from "@/utilities/fetchData";

export default async function SettingsPage() {
  type SyndicatsResponse =
    | GetSyndicats
    | { status: 401; message: string }
    | { status: 500; message: string };

  type CategoriesResponse =
    | GetCategories
    | { status: 401; message: string }
    | { status: 500; message: string };

  type UsersResponse =
    | GetUsers
    | { status: 401; message: string }
    | { status: 500; message: string };

  const [users, syndicats, categories] = await Promise.all([
    fetchData(customRequest.get<UsersResponse>("/settings/users")),
    fetchData(customRequest.get<SyndicatsResponse>("/settings/syndicats")),
    fetchData(customRequest.get<CategoriesResponse>("/settings/categories")),
  ]);

  if (isStatus401(users) || isStatus500(users)) {
    return <div>{users.message}</div>;
  }

  if (isStatus401(syndicats) || isStatus500(syndicats)) {
    return <div>{syndicats.message}</div>;
  }

  if (isStatus401(categories) || isStatus500(categories)) {
    return <div>{categories.message}</div>;
  }

  return (
    <Settings
      usersInitial={users}
      syndicatsInitial={syndicats}
      categoriesInitial={categories}
    />
  );
}

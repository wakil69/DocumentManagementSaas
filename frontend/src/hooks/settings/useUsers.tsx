import customRequest from "@/lib/axios";
import { GetUsers } from "@/types/users";
import { useQuery } from "@tanstack/react-query";

export default function useUsers(usersInitial: GetUsers) {
  const getUsers = async () => {
    try {
      const response = await customRequest.get<GetUsers>(
        "/settings/users"
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (err) {
      console.error(err)
      throw new Error("Server Error");
    }
  };

  const { data: users = [], isFetching: isFetchingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    initialData: usersInitial,
  });

  return { users, isFetchingUsers };
}

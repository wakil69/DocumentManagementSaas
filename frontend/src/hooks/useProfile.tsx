import customRequest from "@/lib/axios";
import { Profile } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";

export default function useProfile() {
  const getUser = async () => {
    try {
      const response = await customRequest.get<Profile>("/authentication/profile");

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error("Server Error");
    }
  };

  const { data: profile, isFetching: isFetchingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getUser,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  return { profile, isFetchingProfile };
}

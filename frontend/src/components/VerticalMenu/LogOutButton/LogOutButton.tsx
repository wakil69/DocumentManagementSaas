"use client"
import LogoutIcon from "@mui/icons-material/Logout";
import useLogout from "@/hooks/authentication/useLogOut";

export default function LogOutButton() {
  const { logoutMutate, isErrorLogOut, message } = useLogout();
  return (
    <>
      <button
        onClick={() => logoutMutate()}
        className="cursor-pointer w-full flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg hover:bg-violet-custom group"
      >
        <LogoutIcon className="mr-4" fontSize="small" />
        Déconnexion
      </button>
      {isErrorLogOut && message && (
        <p className="font-semibold text-red-500">{message}</p>
      )}
    </>
  );
}

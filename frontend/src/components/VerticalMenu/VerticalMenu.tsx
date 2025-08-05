"use client"
import { ReactNode } from "react";
import Logo from "../../../public/logoSite.png";
import Image from "next/image";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import Link from "next/link";
import LogOutButton from "./LogOutButton/LogOutButton";
import { usePathname } from "next/navigation";

export default function VerticalMenu({
  children,
  isAdmin
}: {
  children: ReactNode;
  isAdmin: boolean
}) {

  const pathname = usePathname()

  return (
    <div className="flex flex-1 bg-gray-50">
      <div className="min-h-screen hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white">
          <div className="flex items-center flex-shrink-0 px-6">
            <Image
              src={Logo}
              alt="logo semiv"
              className="w-auto drop-shadow-2xl"
              priority
            />
          </div>

          <div className="px-4 mt-6">
            <hr className="border-gray-200" />
          </div>

          <div className="flex flex-col flex-1 px-3 mt-6">
            <div className="space-y-4">
              <nav className="flex-1 space-y-2">
                <Link
                  href="/documents"
                  className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                    pathname === "/documents"
                      ? "text-white bg-violet-custom"
                      : "text-gray-900 hover:text-white hover:bg-violet-custom"
                  }`}
                >
                  <DescriptionIcon className="mr-4" fontSize="small" />
                  Documents
                </Link>

                {isAdmin && <Link
                  href="/settings"
                  className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                    pathname === "/settings"
                      ? "text-white bg-violet-custom"
                      : "text-gray-900 hover:text-white hover:bg-violet-custom"
                  }`}
                >
                  <SettingsIcon className="mr-4" fontSize="small" />
                  Réglages
                </Link>}
              </nav>

              <hr className="border-gray-200" />
              <LogOutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <main>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

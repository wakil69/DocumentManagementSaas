"use client";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import EditUser from "../EditUser/EditUser";
import { GetUsers } from "@/types/users";
import DeleteUser from "../DeleteUser/DeleteUser";
import { GetSyndicats } from "@/types/syndicats";
import useImportUsers from "@/hooks/settings/useImportUsers";
import ImportUsersButton from "./ImportUsersButton/ImportUsersButton";
import LoadingClient from "@/components/Loading/Loading";
import GroupIcon from "@mui/icons-material/Group";

export default function TableUsers({
  users,
  syndicats,
}: {
  users: GetUsers;
  syndicats: GetSyndicats;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [editOpen, setEditOpen] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const downloadTemplate = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/users/download-template`,
      "_blank"
    );
  };

  const downloadExport = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/users/download-export`,
      "_blank"
    );
  };

  const {
    importUsersMutate,
    isPendingImportUsers,
    isSuccessImportUsers,
    isErrorImportUsers,
    message,
  } = useImportUsers();

  const handleFileSelected = (file: File) => {
    importUsersMutate({ file });
  };

  return (
    <div className="bg-white shadow-2xl py-9 rounded-2xl">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900">Utilisateurs</p>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer flex items-center gap-1 text-sm text-orange-custom hover:underline"
          >
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ExpandMoreIcon fontSize="large" />
            </motion.span>
          </button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="table"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col mt-4 lg:mt-8">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="mx-3 mb-3 flex gap-4">
                      <ImportUsersButton onFileSelected={handleFileSelected} />
                      <button
                        type="button"
                        onClick={() => downloadTemplate()}
                        className="transition-all duration-200 cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-lime-custom hover:bg-violet-custom hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <DownloadIcon fontSize="small" />
                        Télécharger le template
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadExport()}
                        className="transition-all duration-200 cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-lime-custom hover:bg-violet-custom hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <GroupIcon fontSize="small" />
                        Export utilisateurs
                      </button>
                    </div>
                    {isErrorImportUsers && message && (
                      <p className="font-semibold text-red-500">{message}</p>
                    )}
                    {isSuccessImportUsers && message && (
                      <p className="font-semibold text-green-500">{message}</p>
                    )}
                    {isPendingImportUsers && <LoadingClient />}
                    <table className="min-w-full lg:divide-y lg:divide-gray-200">
                      <thead className="hidden lg:table-header-group">
                        <tr>
                          <th className="py-3.5 pl-4 pr-3 text-left text-sm whitespace-nowrap font-medium text-gray-500 sm:pl-6 md:pl-0">
                            <div className="flex items-center">ID</div>
                          </th>

                          <th className="py-3.5 px-3 text-left text-sm whitespace-nowrap font-medium text-gray-500">
                            <div className="flex items-center">
                              Libellé
                              <button
                                type="button"
                                onClick={() => setSortAsc((prev) => !prev)}
                                className="cursor-pointer flex items-center"
                              >
                                <svg
                                  className="w-4 h-4 ml-2"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                  />
                                </svg>
                              </button>
                            </div>
                          </th>

                          <th className="py-3.5 px-3 text-left text-sm whitespace-nowrap font-medium text-gray-500">
                            <div className="flex items-center">Email</div>
                          </th>

                          <th className="py-3.5 px-3 text-left text-sm whitespace-nowrap font-medium text-gray-500">
                            <div className="flex items-center">Rôle</div>
                          </th>

                          <th className="py-3.5 px-3 text-left text-sm whitespace-nowrap font-medium text-gray-500">
                            <div className="flex items-center">Syndicat</div>
                          </th>

                          <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                            <span className="sr-only"> Actions </span>
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">
                        {users
                          .slice()
                          .sort((a, b) => {
                            if (sortAsc) {
                              return a.first_name.localeCompare(b.first_name);
                            } else {
                              return b.first_name.localeCompare(a.first_name);
                            }
                          })
                          .map((user) => (
                            <tr key={user.user_id}>
                              {editOpen === user.user_id && (
                                <EditUser
                                  setEditOpen={setEditOpen}
                                  user={user}
                                  syndicats={syndicats}
                                />
                              )}
                              {deleteOpen === user.user_id && (
                                <DeleteUser
                                  setDeleteOpen={setDeleteOpen}
                                  user={user}
                                />
                              )}
                              <td className="hidden py-4 pl-4 pr-3 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap sm:pl-6 md:pl-0">
                                #{user.user_id}
                              </td>

                              <td className="px-4 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                                {user.first_name} {user.surname}
                              </td>

                              <td className="hidden px-4 py-4 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap">
                                {user.email}
                              </td>

                              <td className="hidden px-4 py-4 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap">
                                {user.role === "admin"
                                  ? "Administrateur"
                                  : "Utilisateur"}
                              </td>

                              <td className="hidden px-4 py-4 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap">
                                <ul className="list-disc pl-5 space-y-1">
                                  {user.syndicats.map((s) => (
                                    <li key={s.id}>{s.name}</li>
                                  ))}
                                </ul>
                              </td>

                              <td className="px-4 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap flex space-x-3 justify-end items-center">
                                <button
                                  type="button"
                                  onClick={() => setEditOpen(user.user_id)}
                                  className="cursor-pointer inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                >
                                  <EditIcon className="w-6 h-6" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteOpen(user.user_id)}
                                  className="cursor-pointer inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                >
                                  <DeleteIcon className="w-6 h-6" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

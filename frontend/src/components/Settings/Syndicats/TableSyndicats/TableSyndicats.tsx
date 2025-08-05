"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSyndicat from "./DeleteSyndicat/DeleteSyndicat";
import { GetSyndicats } from "@/types/syndicats";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AddSyndicat from "./AddSyndicat/AddSyndicat";
import { GetCategories } from "@/types/categories";
import EditSyndicat from "./EditSyndicat/EditSyndicat";

export default function TableSyndicats({
  syndicats,
  categories,
}: {
  syndicats: GetSyndicats;
  categories: GetCategories;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <div className="bg-white shadow-2xl py-9 rounded-2xl">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-gray-900">Syndicats</p>
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
                      {addOpen && (
                        <AddSyndicat
                          setAddOpen={setAddOpen}
                          categories={categories}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setAddOpen(true)}
                        className="cursor-pointer mx-3 mb-3 transition-all duration-200 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-lime-custom rounded-lg hover:bg-violet-custom hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-custom focus:ring-offset-2"
                      >
                        <AddIcon fontSize="small" />
                        Ajouter
                      </button>
                      <table className="min-w-full lg:divide-y lg:divide-gray-200">
                        <thead className="hidden lg:table-header-group">
                          <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm whitespace-nowrap font-medium text-gray-500 sm:pl-6 md:pl-0">
                              <div className="flex items-center">ID</div>
                            </th>

                            <th className="py-3.5 px-3 text-left text-sm whitespace-nowrap font-medium text-gray-500">
                              <div className="flex items-center">Libellé</div>
                            </th>

                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                              <span className="sr-only"> Actions </span>
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                          {syndicats.map((syndicat) => (
                            <tr key={syndicat.syndicat_id}>
                              {editOpen === syndicat.syndicat_id && (
                                <EditSyndicat
                                  setEditOpen={setEditOpen}
                                  categories={categories}
                                  syndicat={syndicat}
                                />
                              )}

                              {deleteOpen === syndicat.syndicat_id && (
                                <DeleteSyndicat
                                  setDeleteOpen={setDeleteOpen}
                                  syndicat={syndicat}
                                />
                              )}

                              <td className="hidden py-4 pl-4 pr-3 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap sm:pl-6 md:pl-0">
                                #{syndicat.syndicat_id}
                              </td>

                              <td className="px-4 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                                {syndicat.name}
                              </td>

                              <td className="px-4 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap flex space-x-3 justify-end items-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditOpen(syndicat.syndicat_id)
                                  }
                                  className="cursor-pointer inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                >
                                  <EditIcon className="w-6 h-6" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteOpen(syndicat.syndicat_id)
                                  }
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
    </>
  );
}

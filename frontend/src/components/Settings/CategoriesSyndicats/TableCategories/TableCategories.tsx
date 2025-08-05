"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import InputCategory from "./InputCategory/InputCategory";
import DeleteCategory from "./DeleteCategory/DeleteCategories";
import { GetCategories } from "@/types/categories";

export default function TableCategories({
  categories,
}: {
  categories: GetCategories;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState<number | null>(null);

  return (
    <>
      <div className="bg-white shadow-2xl py-9 mb-32 rounded-2xl">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-gray-900">
              Catégories des documents
            </p>
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
                      <InputCategory />
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
                          {categories.map((category) => (
                            <tr key={category.category_id}>
                              {deleteOpen === category.category_id && (
                                <DeleteCategory
                                  category={category}
                                  setDeleteOpen={setDeleteOpen}
                                />
                              )}

                              <td className="hidden py-4 pl-4 pr-3 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap sm:pl-6 md:pl-0">
                                #{category.category_id}
                              </td>

                              <td className="px-4 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                                {category.name}
                              </td>

                              <td className="px-4 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteOpen(category.category_id)
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

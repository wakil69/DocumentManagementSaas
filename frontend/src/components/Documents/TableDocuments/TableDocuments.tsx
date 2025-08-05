import useDocs from "@/hooks/docs/useDocs";
import { useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import useProfile from "@/hooks/useProfile";
import DeleteDoc from "./DeleteDoc/DeleteDoc";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewPdf from "./ViewDocs/ViewDoc";
import EditIcon from "@mui/icons-material/Edit";
import EditExpirationDate from "./EditExpirationDate/EditExpirationDate";

export default function TableDocuments({
  syndicatId,
  categoryId,
}: {
  syndicatId: number;
  categoryId: number;
}) {
  const [deleteOpen, setDeleteOpen] = useState<string | null>(null);
  const [viewPdfOpen, setViewPdfOpen] = useState<string | null>(null);
  const [editDoc, setEditDoc] = useState<string | null>(null);
  const { profile } = useProfile();
  const [page, setPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);
  const { docs } = useDocs(syndicatId, categoryId, page);

  const downloadFile = (
    file_name: string,
    syndicatId: number,
    categoryId: number
  ) => {
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/download-file?file_name=${file_name}&syndicat_id=${syndicatId}&category_id=${categoryId}`,
      "_blank"
    );
  };

  const totalPages = useMemo(() => {
    if (docs && docs.total && docs.limit) {
      return Math.ceil(docs.total / docs.limit);
    }
    return 1;
  }, [docs]);

  return (
    <div className="bg-white shadow-2xl py-9 mb-12 rounded-2xl">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              {docs && <p>Total documents: {docs.total}</p>}
              <table className="min-w-full lg:divide-y lg:divide-gray-200">
                <thead className="hidden lg:table-header-group">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm whitespace-nowrap font-medium text-gray-500 sm:pl-6 md:pl-0">
                      <div className="flex items-center">
                        Nom du fichier
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
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm whitespace-nowrap font-medium text-gray-500 sm:pl-6 md:pl-0">
                      <div className="flex items-center">
                        Date d&apos;expiration
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

                    <th className="py-3.5 pl-4 pr-3 text-left text-sm whitespace-nowrap font-medium text-gray-500 sm:pl-6 md:pl-0">
                      Expiré
                    </th>

                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                      <span className="sr-only"> Actions </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {docs?.files
                    .slice()
                    .sort((a, b) => {
                      if (sortAsc) {
                        return a.file_name.localeCompare(b.file_name);
                      } else {
                        return b.file_name.localeCompare(a.file_name);
                      }
                    })
                    .map((doc, index) => {
                      const isPdf = doc.file_name
                        .toLowerCase()
                        .endsWith(".pdf");
                      const isImage = /\.(jpeg|jpg|png|gif)$/i.test(
                        doc.file_name.toLowerCase()
                      );
                      return (
                        <tr key={index}>
                          {viewPdfOpen === doc.file_name &&
                            (isPdf || isImage) && (
                              <ViewPdf
                                setViewOpen={setViewPdfOpen}
                                doc={doc.file_name}
                                syndicatId={syndicatId}
                                categoryId={categoryId}
                              />
                            )}
                          {deleteOpen === doc.file_name && (
                            <DeleteDoc
                              setDeleteOpen={setDeleteOpen}
                              doc={doc.file_name}
                              categoryId={categoryId}
                              syndicatId={syndicatId}
                            />
                          )}

                          {editDoc === doc.file_name && (
                            <EditExpirationDate
                              setEditDoc={setEditDoc}
                              doc={doc.file_name}
                              expirationDate={doc.expiration_date}
                              syndicatId={syndicatId}
                              categoryId={categoryId}
                              page={page}
                            />
                          )}
                          <td className="hidden py-4 pl-4 pr-3 text-sm font-medium text-gray-900 lg:table-cell whitespace-nowrap sm:pl-6 md:pl-0">
                            {doc.file_name}
                          </td>
                          <td>
                            {doc.expiration_date
                              ? (() => {
                                  const d = new Date(doc.expiration_date);
                                  const day = String(d.getDate()).padStart(
                                    2,
                                    "0"
                                  );
                                  const month = String(
                                    d.getMonth() + 1
                                  ).padStart(2, "0");
                                  const year = d.getFullYear();
                                  return `${day}-${month}-${year}`;
                                })()
                              : "-"}
                          </td>
                          <td className="text-sm font-semibold">
                            {doc.has_expired ? (
                              <span className="text-red-600">Expiré</span>
                            ) : (
                              <span className="text-green-600">Valide</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap flex space-x-3 justify-end items-center">
                            <button
                              type="button"
                              onClick={() => setEditDoc(doc.file_name)}
                              className="cursor-pointer inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                            >
                              <EditIcon className="w-6 h-6" />
                            </button>
                            {(isPdf || isImage) && (
                              <button
                                type="button"
                                onClick={() => setViewPdfOpen(doc.file_name)}
                                className="cursor-pointer inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                              >
                                <VisibilityIcon className="w-6 h-6" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                downloadFile(
                                  doc.file_name,
                                  syndicatId,
                                  categoryId
                                )
                              }
                              className="cursor-pointer inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                            >
                              <DownloadIcon className="w-6 h-6" />
                            </button>
                            {profile?.role === "admin" && (
                              <button
                                type="button"
                                onClick={() => setDeleteOpen(doc.file_name)}
                                className="cursor-pointer inline-flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-200 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                              >
                                <DeleteIcon className="w-6 h-6" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="py-6 bg-gray-50">
                  <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                    <nav className="flex items-center justify-center space-x-4">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1;
                        const isActive = page === pageNumber;

                        return (
                          <button
                            key={pageNumber}
                            type="button"
                            onClick={() => setPage(pageNumber)}
                            className={`cursor-pointer inline-flex items-center justify-center text-sm font-bold transition-all duration-200 rounded-full w-7 h-7 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
                              isActive
                                ? "text-white bg-gray-900"
                                : "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import LoadingClient from "@/components/Loading/Loading";
import useImportDocs from "@/hooks/docs/useImportDocs";
import DeleteIcon from '@mui/icons-material/Delete';

export default function ModalImportFiles({
  setImportOpen,
  syndicatId,
  selectedCategory,
}: {
  setImportOpen: Dispatch<SetStateAction<boolean>>;
  syndicatId: number;
  selectedCategory: number;
}) {
  const [filesData, setFilesData] = useState<
    { file: File; expiration: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    importDocsMutate,
    isPendingImportDocs,
    isSuccessImportDocs,
    isErrorImportDocs,
    message,
  } = useImportDocs(syndicatId, selectedCategory, setImportOpen);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleExpirationChange = (index: number, value: string) => {
    setFilesData((prev) => {
      const updated = [...prev];
      updated[index].expiration = value;
      return updated;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.map((file) => ({
      file,
      expiration: "",
    }));
    setFilesData(newFiles);
  };

  const handleImport = () => {
    importDocsMutate({
      files: filesData.map((f) => f.file),
      expirationDates: filesData.map((f) => f.expiration),
    });
  };

  const handleRemoveFile = (index: number) => {
    setFilesData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full min-h-[100vh] flex justify-center items-center bg-[rgba(255,255,255,.7)]">
      <div className="flex items-center justify-center w-full h-full px-4 py-5 sm:p-6">
        <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white shadow-lg rounded-xl">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-xl font-bold text-gray-900">
              Importer des fichiers
            </p>
            <input
              type="file"
              multiple
              ref={inputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <button
              type="button"
              onClick={handleButtonClick}
              className="mt-4 mb-2 cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Sélectionner des fichiers
            </button>

            <table className="min-w-full mt-6 divide-y divide-gray-200">
              <thead className="hidden lg:table-header-group">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-500">
                    Nom du fichier
                  </th>
                  <th className="py-3.5 px-3 text-left text-sm font-medium text-gray-500">
                    Date d&apos;expiration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filesData.map((fileData, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {fileData.file.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      <input
                        type="date"
                        value={fileData.expiration}
                        onChange={(e) =>
                          handleExpirationChange(index, e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-end mt-5 space-x-4">
              <button
                onClick={() => setImportOpen(false)}
                className="cursor-pointer inline-flex items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-gray-600 transition-all duration-200 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                Annuler
              </button>

              <button
                type="submit"
                onClick={handleImport}
                className="cursor-pointer inline-flex items-center justify-center px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-violet-custom border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-custom hover:bg-violet-custom"
              >
                Importer
              </button>
            </div>
            {isPendingImportDocs && <LoadingClient />}
            {isErrorImportDocs && message && (
              <p className="text-red-500 font-semibold">{message}</p>
            )}
            {isSuccessImportDocs && message && (
              <p className="text-green-500 font-semibold">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

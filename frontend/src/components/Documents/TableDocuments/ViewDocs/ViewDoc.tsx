import { Dispatch, SetStateAction } from "react";

export default function ViewFile({
  setViewOpen,
  doc,
  syndicatId,
  categoryId,
}: {
  setViewOpen: Dispatch<SetStateAction<string | null>>;
  doc: string;
  syndicatId: number;
  categoryId: number;
}) {
  const fileUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/view-pdf?file_name=${doc}&syndicat_id=${syndicatId}&category_id=${categoryId}`;

  const isPdf = doc.toLowerCase().endsWith(".pdf");
  const isImage = doc.toLowerCase().match(/\.(jpeg|jpg|png|gif)$/);

  return (
    <div className="fixed top-0 left-0 z-50 w-full min-h-[100vh] flex justify-center items-center bg-[rgba(0,0,0,0.7)]">
      <div className="flex flex-col items-center justify-center w-full h-full px-4 py-5 sm:p-6">
        <div className="relative w-full max-w-5xl h-[90vh] bg-white shadow-lg rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-end p-4 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setViewOpen(null)}
              className="cursor-pointer text-gray-600 hover:text-gray-900 text-2xl"
            >
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {isPdf ? (
              <iframe
                src={fileUrl}
                className="w-full h-full"
                title="PDF Viewer"
              ></iframe>
            ) : isImage ? (
              <img
                src={fileUrl}
                alt="Document preview"
                className="object-contain w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-700 text-lg mb-4">
                  Aucun aperçu disponible pour ce fichier.
                </p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Télécharger le fichier
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import ModalImportFiles from "./ModalImport/ModalImport";

export default function ImportFilesButton({
  syndicatId,
  selectedCategory,
}: {
  selectedCategory: number;
  syndicatId: number;
}) {
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="flex space-x-6 items-center">
      {importOpen && (
        <ModalImportFiles
          syndicatId={syndicatId}
          selectedCategory={selectedCategory}
          setImportOpen={setImportOpen}
        />
      )}
      <button
        type="button"
        onClick={() => setImportOpen(true)}
        className="max-w-64 transition-all duration-200 cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <DescriptionIcon />
        Importer des documents
      </button>
    </div>
  );
}

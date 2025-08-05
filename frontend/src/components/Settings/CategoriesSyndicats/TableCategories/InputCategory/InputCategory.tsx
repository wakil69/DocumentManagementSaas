import LoadingClient from "@/components/Loading/Loading";
import useAddCategory from "@/hooks/settings/useAddCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import { z } from "zod";

const validationSchemaAddCategory = z.object({
  name: z.string().min(1, "Vous devez donner un nom à la catégorie"),
});

export default function InputCategory() {
  // create a table syndicats_categories with (syndicat_id, category_name, is_hidden)
  // when creating a syndicat you add/create at least one category (by default everything is selected)
  // we can edit a syndicat to change its name or categories

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(validationSchemaAddCategory),
  });

  const {
    addCategoryMutate,
    message,
    isSuccessAddCategory,
    isErrorAddCategory,
    isPendingAddCategory,
  } = useAddCategory();

  return (
    <div className="mb-3 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
      <div className="max-w-xl mx-auto flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <input
            {...register("name")}
            className="block w-full px-4 py-3 placeholder-gray-500 border-gray-300 border rounded-lg focus:ring-lime-custom focus:border-lime-custom sm:text-sm caret-lime-curing-lime-custom"
          />

          <button
            onClick={() => handleSubmit((data) => addCategoryMutate(data))()}
            className="cursor-pointer transition-all duration-200 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-lime-custom rounded-lg hover:bg-violet-custom hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-custom focus:ring-offset-2"
          >
            <AddIcon fontSize="small" />
            Ajouter
          </button>
          
        </div>
        {errors.name && (
          <p className="font-semibold text-red-500">{errors.name.message}</p>
        )}
        {isErrorAddCategory && message && (
          <p className="font-semibold text-red-500">{message}</p>
        )}
        {isPendingAddCategory && <LoadingClient />}
        {isSuccessAddCategory && message && (
          <p className="font-semibold text-green-500">{message}</p>
        )}
      </div>
    </div>
  );
}

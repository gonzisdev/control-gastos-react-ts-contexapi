import { categories } from "../data/categories";
import { useBudget } from "../hooks/useBudget";

export const FilterByCategory = () => {

    const { dispatch } = useBudget();

    const handleChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({type: "add-filter-category", payload: {id: e.target.value}})
    };

  return (
    <div className="bg-white shadow-lg rounded-lg p-10">
        <form>
            <div className="flex flex-col md:flex-row md:items-center gap-5">
                <label htmlFor="category" className="text-sm font-bold uppercase text-slate-500">Filtrar gastos</label>
                <select 
                    id="category"
                    className="bg-slate-100 p-3 flex-1 rounded"
                    onChange={handleChange}
                >
                    <option value="">-- Todas las categorías --</option>
                    {categories.map(category => (
                        <option 
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
        </form>
    </div>
  );
};

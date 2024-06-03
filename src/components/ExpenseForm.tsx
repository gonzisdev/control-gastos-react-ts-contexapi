import { useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import { useBudget } from "../hooks/useBudget";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { ErrorMessage } from "./ErrorMessage";



export const ExpenseForm = () => {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    });
    const [error, setError] = useState('');
    const [previousAmount, setPreviousAmount] = useState(0);
    const { state, dispatch, remainingBudget } = useBudget();

    useEffect(() => {
        if (state.editingId) {
           const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]; 
           setExpense(editingExpense);
           setPreviousAmount(editingExpense.amount);
        };
    }, [state.editingId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isAmountField = ['amount'].includes(name);
        setExpense({
            ...expense,
            [name]: isAmountField ? +value : value
        });
    };

    const handleChangDate = (value : Value) => {
        setExpense({
            ...expense,
            date: value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validar
        if (Object.values(expense).includes('')) {
            setError('Todos los campos son obligatorios')
            return;
        };

        // Validar que no me pase del límite
        if ((expense.amount - previousAmount) > remainingBudget) {
            setError('El gasto supera el presupuesto disponible')
            return;
        };

        // Agregar un nuevo gasto o actualizar un existente
        if (state.editingId) {
            dispatch({type:"update-expense", payload: {expense: {id:state.editingId, ...expense}}});
        } else {
            dispatch({type:"add-expense", payload: {expense: expense}});
        };

        // Reiniciar el state
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date()
        });
        setPreviousAmount(0);
    };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
        <legend
            className="uppercase text-center text-2xl font-black border-b-4 border-blue-500"
        >{state.editingId ? 'Guardar cambios' : 'Nuevo gasto'}</legend>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="expenseName"
                className="text-xl"
            >Nombre gasto:</label>
            <input 
                type="text" 
                id="expenseName" 
                name="expenseName"
                placeholder="Añade el nombre del gasto"
                className="bg-slate-100 p-2"
                value={expense.expenseName}
                onChange={handleChange}
            />
        </div>
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="amount"
                className="text-xl"
            >Cantidad:</label>
            <input 
                type="number" 
                id="amount" 
                name="amount"
                placeholder="Añade la cantidad del gasto"
                className="bg-slate-100 p-2"
                value={expense.amount}
                onChange={handleChange}
            />
        </div>
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="category"
                className="text-xl"
            >Categoría:</label>
            <select 
                id="category" 
                name="category"
                className="bg-slate-100 p-2"
                value={expense.category}
                onChange={handleChange}
            >
                <option value="">-- Selecciona --</option>
                {categories.map(category => (
                    <option
                        key={category.id}
                        value={category.id}
                    >{category.name}</option>
                ))}
            </select>
        </div>
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="date"
                className="text-xl"
            >Fecha gasto:</label>
            <DatePicker 
                id="date"
                name="date"
                className="bg-slate-10 p-2 border-0"
                value={expense.date}
                onChange={handleChangDate}
            />
        </div>

        <input 
            className="bg-blue-600 hover:bg-blue-700 uppercase cursor-pointer w-full p-2 text-white font-bold rounded-lg"
            type="submit" 
            value={state.editingId ? 'Guardar cambios' : 'Registrar gasto'} />
    </form>
  );
};

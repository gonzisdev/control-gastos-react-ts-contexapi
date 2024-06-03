import { formatCurrency } from "../helpers";

type AmountDiplayProps = {
    label?: string;
    amount: number;
};

export const AmountDisplay = ({label, amount} : AmountDiplayProps) => {
  
  return (
    <p className="text-2xl text-blue-600 font-bold">
        {label && `${label}: `}
        <span className="font-black text-black">{formatCurrency(amount)}</span>
    </p>
  );
};

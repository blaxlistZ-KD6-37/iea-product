import "../css/style.css";
import api from "./api";
import { financial_accounting_t } from "./database_types";

export const month: number = 10;

export const acc_ob = await api.GetDB<financial_accounting_t[]>(
  "financial_account"
);

export const FilterDate = (target_month: number): financial_accounting_t[] => {
  const new_accounting_ob: financial_accounting_t[] = acc_ob.filter((acc) => {
    const account_month: number = new Date(acc.date).getMonth() + 1;
    return account_month === target_month;
  });

  return new_accounting_ob;
};

export default {
  month,
  FilterDate,
};

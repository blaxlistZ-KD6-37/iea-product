import "../css/style.css";
import api from "./api";
import { financial_accounting_t } from "./database_types";

export const month: number = 9;

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

export const CalculateItem = (type: financial_accounting_t[]): number => {
  const debit_total: number = type
    .filter((acc) => {
      return acc.is_debit === true;
    })
    .reduce((acc, curr_item) => {
      acc += curr_item.amount;
      return acc;
    }, 0);

  const credit_total: number = type
    .filter((acc) => {
      return acc.is_debit === false;
    })
    .reduce((acc, curr_item) => {
      acc += curr_item.amount;
      return acc;
    }, 0);

  const balance: number = Math.abs(debit_total - credit_total);

  return balance;
};

export default {
  month,
  FilterDate,
  CalculateItem,
};

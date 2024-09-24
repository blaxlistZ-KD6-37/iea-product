import "../css/style.css";
import api from "./api";
import { Database_Objects } from "./database_types";

type financial_accounting_t = Pick<
  Database_Objects,
  "name" | "amount" | "is_debit" | "date" | "description" | "category"
>;

const financial_accounting_ob = await api.GetDB<financial_accounting_t[]>(
  "financial_account"
);

let category: string[] = financial_accounting_ob.map((acc) => {
  return acc.category;
});

category = [...new Set(category)];

const assets: financial_accounting_t[] = financial_accounting_ob.filter(
  (acc) => {
    return acc.category === category[1];
  }
);

console.log(assets);

let accounts: string[] = assets.map((acc) => {
  return acc.name;
});

accounts = [...new Set(accounts)];

console.log(accounts);

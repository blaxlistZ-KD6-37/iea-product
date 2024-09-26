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

// Getting the Trial Balance Body
const trial_body = <HTMLTableElement>(
  document.getElementById("trial-balance-body")
);

// Row Creation

// Table Row
const account_item: HTMLTableRowElement = document.createElement("tr");
account_item.classList.add("account-items");

// Table Datas
const account_balances: HTMLElement[] = [];
for (let ndx = 0; ndx < 7; ndx++) {
  account_balances.push(document.createElement("td"));
}
account_balances.forEach((bal) => {
  account_item.appendChild(bal);
});

const account_vec: string[] = [];

// Unadjusted

// Adjustments

// Adjusted

let category: string[] = financial_accounting_ob.map((acc) => {
  return acc.category;
});

category = [...new Set(category)];

const assets: financial_accounting_t[] = financial_accounting_ob.filter(
  (acc) => {
    return acc.category === category[0];
  }
);

console.log(assets);

let accounts: string[] = assets.map((acc) => {
  return acc.name;
});

accounts = [...new Set(accounts)];

account_vec.push(accounts[0]);
account_balances[0].textContent = account_vec[0];

trial_body.appendChild(account_item);

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

type account_sig =
  | "debit_entry"
  | "debit_value_entry"
  | "credit_entry"
  | "credit_value_entry";

type account_entries = Record<account_sig, HTMLDivElement>;

// Account Container
const account_container_main = <NodeListOf<HTMLDivElement>>(
  document.querySelectorAll(".acc-container_wrapper")
);
console.log(account_container_main[0].firstElementChild);

const account_container = <HTMLDivElement>document.createElement("div");
account_container.classList.add("acc-container");

// Account Name
const account_name = <HTMLDivElement>document.createElement("div");

// Filtering Unique Names
const list_acc = financial_accounting_ob.map((acc) => {
  return acc.name;
});
const unique_acc = [...new Set(list_acc)];

account_name.classList.add("acc-name");
account_name.textContent = unique_acc[0];
account_container.appendChild(account_name);

// Debit-Credit
const account_type_wrapper = <HTMLDivElement>document.createElement("div");

const debit_doc = <HTMLDivElement>document.createElement("div");
// Debit Datas
const debit_data = <HTMLDivElement>document.createElement("div");
// Debits
const cash_debit = financial_accounting_ob.filter((acc) => {
  return acc.name === unique_acc[0] && acc.is_debit === true;
});

const debit_total = <HTMLDivElement>document.createElement("div");

const credit_doc = <HTMLDivElement>document.createElement("div");
credit_doc.classList.add("side-credit");
// Credit Datas
const credit_data = <HTMLDivElement>document.createElement("div");
credit_data.classList.add("data");
// Credits
const cash_credit = financial_accounting_ob.filter((acc) => {
  return (
    acc.category === "Asset" &&
    acc.name === unique_acc[0] &&
    acc.is_debit === false &&
    new Date(acc.date).toString() === new Date("2024-09-05").toString()
  );
});
let credit_summation = 0;
cash_credit.forEach((cash) => {
  credit_summation += cash.amount;
});

const credit_data_account = <HTMLDivElement>document.createElement("div");
credit_data_account.classList.add("d-acc_wrapper");
const credit_data_date = <HTMLTimeElement>document.createElement("time");
credit_data_date.classList.add("date");
const formatted_date = `(${new Date(cash_credit[0].date)
  .toISOString()
  .slice(5, 7)}/${new Date(cash_credit[0].date).toUTCString().slice(5, 7)})`;
credit_data_date.textContent = formatted_date;
credit_data_date.dateTime = new Date(cash_credit[0].date).toISOString();
credit_data_account.appendChild(credit_data_date);

const credit_data_amount = <HTMLDivElement>document.createElement("div");
credit_data_amount.classList.add("date-acc-amount");
credit_data_amount.innerHTML = `&#x20B1;${credit_summation.toFixed(2)}`;
credit_data_account.appendChild(credit_data_amount);

const credit_total = <HTMLDivElement>document.createElement("div");

// Balance
const balance = <HTMLDivElement>document.createElement("div");
balance.classList.add("balance-amount");
const bal_space = <HTMLDivElement>document.createElement("div");
bal_space.classList.add("balance-space");

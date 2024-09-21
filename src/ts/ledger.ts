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

const account_container = <HTMLDivElement>document.createElement("div");
account_container.classList.add("acc-container");

// Account Name
const account_name = <HTMLDivElement>document.createElement("div");
account_name.classList.add("acc-name");

// Filtering Unique Names
const filterUniqueByCategory = (category_type: string): string[] => {
  const category_acc: financial_accounting_t[] = financial_accounting_ob.filter(
    (acc) => {
      return acc.category === category_type;
    }
  );
  const listed_acc: string[] = category_acc.map((acc) => {
    return acc.name;
  });
  const unique_list: string[] = [...new Set(listed_acc)];

  return unique_list;
};

const account_debit_name = <HTMLDivElement>document.createElement("div");
account_debit_name.classList.add("name-debit");
account_debit_name.textContent = `DR`;
account_name.appendChild(account_debit_name);

const unique_acc: string[] = filterUniqueByCategory("Asset");
const account_title = <HTMLDivElement>document.createElement("div");
account_title.classList.add("name-title");
account_title.textContent = unique_acc[0];
account_name.appendChild(account_title);

const account_credit_name = <HTMLDivElement>document.createElement("div");
account_credit_name.classList.add("name-credit");
account_credit_name.textContent = `CR`;
account_name.appendChild(account_credit_name);

// Debit-Credit
type data_acc_t = Pick<
  Database_Objects,
  "name" | "category" | "date" | "is_debit"
>;

const sumForDate = (items: number[]): number => {
  let summation: number = 0;
  items.forEach((item) => {
    summation += item;
  });

  return summation;
};

const debit_obj: data_acc_t = {
  name: unique_acc[0],
  category: "Asset",
  date: new Date("2024-09-19"),
  is_debit: true,
};

const credit_obj: data_acc_t = {
  name: unique_acc[0],
  category: "Asset",
  date: new Date("2024-09-19"),
  is_debit: false,
};

const createAccountData = (data_account: data_acc_t): HTMLDivElement => {
  const data_account_doc = <HTMLDivElement>document.createElement("div");
  const data_date = <HTMLTimeElement>document.createElement("time");
  const data_amount = <HTMLDivElement>document.createElement("div");
  data_account_doc.classList.add("d-acc_wrapper");

  const cash_type = financial_accounting_ob.filter((acc) => {
    return (
      acc.category === data_account.category &&
      acc.name === data_account.name &&
      acc.is_debit === data_account.is_debit &&
      new Date(acc.date).toString() === new Date(data_account.date).toString()
    );
  });

  if (cash_type.length < 1) {
    throw new Error("Cannot find account");
  }

  const cash: number[] = cash_type.map((cash) => {
    return cash.amount;
  });
  let summation: number = sumForDate(cash);

  data_amount.classList.add("date-acc-amount");
  data_amount.innerHTML = `&#x20B1;${summation.toFixed(2)}`;
  data_account_doc.appendChild(data_amount);

  const current_date: Date = new Date(cash_type[0].date);
  const formatted_date: string = `(${current_date
    .toISOString()
    .slice(5, 7)}/${current_date.toUTCString().slice(5, 7)})`;
  data_date.classList.add("date");
  data_date.textContent = formatted_date;
  data_account_doc.appendChild(data_date);

  return data_account_doc;
};

const createMainData = (target: data_acc_t): HTMLDivElement => {
  const data = <HTMLDivElement>document.createElement("div");
  data.classList.add("data");

  const data_account: financial_accounting_t[] = financial_accounting_ob.filter(
    (acc) => {
      return acc.name === target.name && acc.is_debit === target.is_debit;
    }
  );

  const data_dates: Date[] = data_account.map((acc) => {
    return acc.date;
  });
  const unique_dates: Date[] = [...new Set(data_dates)];

  unique_dates.forEach((date) => {
    const dat_obj: data_acc_t = {
      name: target.name,
      category: target.category,
      date: date,
      is_debit: target.is_debit,
    };
    const dat_acc: HTMLDivElement = createAccountData(dat_obj);
    data.appendChild(dat_acc);
  });

  return data;
};

const createDataSum = (target: data_acc_t): HTMLDivElement => {
  const data_total = <HTMLDivElement>document.createElement("div");
  data_total.classList.add("sum");

  const data_account: financial_accounting_t[] = financial_accounting_ob.filter(
    (acc) => {
      return acc.name === target.name && acc.is_debit === target.is_debit;
    }
  );

  const amount: number[] = data_account.map((acc) => {
    return acc.amount;
  });

  const summation: number = sumForDate(amount);
  data_total.innerHTML = `&#x20B1;${summation.toFixed(2)}`;

  return data_total;
};

const account_type_wrapper = <HTMLDivElement>document.createElement("div");
account_type_wrapper.classList.add("side-wrapper");

const debit_doc = <HTMLDivElement>document.createElement("div");
debit_doc.classList.add("side-debit");
const debit_data = createMainData(debit_obj);
const debit_total: HTMLDivElement = createDataSum(debit_obj);
debit_doc.appendChild(debit_data);
debit_doc.appendChild(debit_total);
account_type_wrapper.appendChild(debit_doc);

const credit_doc = <HTMLDivElement>document.createElement("div");
credit_doc.classList.add("side-credit");
const credit_data = createMainData(credit_obj);
const credit_total: HTMLDivElement = createDataSum(credit_obj);
credit_doc.appendChild(credit_data);
credit_doc.appendChild(credit_total);
account_type_wrapper.appendChild(credit_doc);

// Balance
const balance = <HTMLDivElement>document.createElement("div");
balance.classList.add("balance");

const stringDocToNumeric = (item: HTMLDivElement): number => {
  let string_item = <string>item.textContent;
  string_item = <string>string_item.slice(1);

  const numeric_item: number = parseFloat(string_item);

  return numeric_item;
};
const balance_amount = <HTMLDivElement>document.createElement("div");
balance_amount.classList.add("balance-amount");
const numeric_debit: number = stringDocToNumeric(debit_total);
const numeric_credit: number = stringDocToNumeric(credit_total);
const account_difference: number = numeric_debit - numeric_credit;
balance_amount.innerHTML = `&#x20B1;${account_difference.toFixed(2)}`;
if (account_difference < 0) {
  balance_amount.innerHTML = `(&#x20B1;${Math.abs(account_difference).toFixed(
    2
  )})`;
}
balance.appendChild(balance_amount);

const bal_space = <HTMLDivElement>document.createElement("div");
bal_space.classList.add("balance-space");
balance.appendChild(bal_space);

account_container.appendChild(account_name);
account_container.appendChild(account_type_wrapper);
account_container.appendChild(balance);

account_container_main[0].appendChild(account_container);
console.log(account_container_main[0]);

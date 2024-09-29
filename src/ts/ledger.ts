import "../css/style.css";
import { Database_Objects, financial_accounting_t } from "./database_types";
import util from "./utils";

const financial_accounting_ob = util.FilterDate(9);

// Filtering Unique Names
const filterUniqueByCategory = (category_type: string): string[] => {
  const category_acc: financial_accounting_t[] = financial_accounting_ob.filter(
    (acc) => {
      return acc.category === category_type;
    }
  );

  category_acc.sort((a, b) => {
    return a.chart_account - b.chart_account;
  });

  const listed_acc: string[] = category_acc.map((acc) => {
    return acc.name;
  });

  const unique_list: string[] = [...new Set(listed_acc)];

  return unique_list;
};

// Account Name
const createNameElement = (current_account: string): HTMLDivElement => {
  const account_name = <HTMLDivElement>document.createElement("div");
  account_name.classList.add("acc-name");

  const account_debit_name = <HTMLDivElement>document.createElement("div");
  account_debit_name.classList.add("name-debit");
  account_debit_name.textContent = `DR`;
  account_name.appendChild(account_debit_name);

  const account_title = <HTMLDivElement>document.createElement("div");
  account_title.classList.add("name-title");
  account_title.textContent = current_account;
  account_name.appendChild(account_title);

  const account_credit_name = <HTMLDivElement>document.createElement("div");
  account_credit_name.classList.add("name-credit");
  account_credit_name.textContent = `CR`;
  account_name.appendChild(account_credit_name);

  return account_name;
};

// Debit-Credit
type data_acc_t = Pick<Database_Objects, "name" | "category" | "is_debit"> &
  Partial<Pick<Database_Objects, "date">>;

const sumForDate = (items: number[]): number => {
  let summation: number = 0;
  items.forEach((item) => {
    summation += item;
  });

  return summation;
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
      new Date(acc.date).toString() ===
        new Date(<Date>data_account.date).toString()
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

const createSideWrapperElement = (
  debit_cond: data_acc_t,
  credit_cond: data_acc_t
): HTMLDivElement => {
  const account_type_wrapper = <HTMLDivElement>document.createElement("div");
  account_type_wrapper.classList.add("side-wrapper");

  const debit_doc = <HTMLDivElement>document.createElement("div");
  debit_doc.classList.add("side-debit");
  const debit_data = createMainData(debit_cond);
  const debit_total: HTMLDivElement = createDataSum(debit_cond);
  debit_doc.appendChild(debit_data);
  debit_doc.appendChild(debit_total);
  account_type_wrapper.appendChild(debit_doc);

  const credit_doc = <HTMLDivElement>document.createElement("div");
  credit_doc.classList.add("side-credit");
  const credit_data = createMainData(credit_cond);
  const credit_total: HTMLDivElement = createDataSum(credit_cond);
  credit_doc.appendChild(credit_data);
  credit_doc.appendChild(credit_total);
  account_type_wrapper.appendChild(credit_doc);

  return account_type_wrapper;
};

// Balance
const stringDocToNumeric = (item: HTMLDivElement): number => {
  let string_item = <string>item.textContent;
  string_item = <string>string_item.slice(1);

  const numeric_item: number = parseFloat(string_item);

  return numeric_item;
};

const createBalanceElement = (
  account_type_wrapper: HTMLDivElement,
  category_type: string
): HTMLDivElement => {
  const balance = <HTMLDivElement>document.createElement("div");
  balance.classList.add("balance");
  const debit_side = <HTMLDivElement>(
    (<HTMLDivElement>account_type_wrapper.firstChild).lastChild
  );
  const credit_side = <HTMLDivElement>(
    (<HTMLDivElement>account_type_wrapper.lastChild).lastChild
  );

  const balance_amount = <HTMLDivElement>document.createElement("div");
  balance_amount.classList.add("balance-amount");
  const numeric_debit: number = stringDocToNumeric(debit_side);
  const numeric_credit: number = stringDocToNumeric(credit_side);
  const account_difference: number =
    category_type !== "Asset"
      ? numeric_credit - numeric_debit
      : numeric_debit - numeric_credit;
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
  return balance;
};

// Account Container
const account_container_main = <NodeListOf<HTMLDivElement>>(
  document.querySelectorAll(".acc-container_wrapper")
);

const createContainerElement = (
  debit_cond: data_acc_t,
  credit_cond: data_acc_t
): HTMLDivElement => {
  if (
    debit_cond.name !== credit_cond.name ||
    debit_cond.category !== credit_cond.category ||
    debit_cond.is_debit === credit_cond.is_debit
  ) {
    throw new Error("Something is wrong with the debit and credit conditions.");
  }

  const account_container = <HTMLDivElement>document.createElement("div");
  account_container.classList.add("acc-container");

  const account_name: HTMLDivElement = createNameElement(debit_cond.name);
  account_container.appendChild(account_name);

  const account_type_wrapper: HTMLDivElement = createSideWrapperElement(
    debit_cond,
    credit_cond
  );
  account_container.appendChild(account_type_wrapper);

  const balance: HTMLDivElement = createBalanceElement(
    account_type_wrapper,
    debit_cond.category
  );
  account_container.appendChild(balance);

  return account_container;
};

const appendMainContainer = (
  container: HTMLDivElement,
  target_category: string
): void => {
  const acc: string[] = filterUniqueByCategory(target_category);

  for (let ndx = 0; ndx < acc.length; ndx++) {
    const debit_obj: data_acc_t = {
      name: acc[ndx],
      category: target_category,
      is_debit: true,
    };

    const credit_obj: data_acc_t = {
      name: acc[ndx],
      category: target_category,
      is_debit: false,
    };

    const account_container: HTMLDivElement = createContainerElement(
      debit_obj,
      credit_obj
    );

    container.appendChild(account_container);
  }
};

const appendParentContainer = (): void => {
  const account_category: string[] = [
    "Asset",
    "Liability",
    "Capital",
    "Revenue",
    "Expense",
  ];
  for (let ndx = 0; ndx < account_category.length; ndx++) {
    appendMainContainer(account_container_main[ndx], account_category[ndx]);
  }
};

appendParentContainer();

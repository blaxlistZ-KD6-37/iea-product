import "../css/style.css";
import api, { GetDB, PostDB } from "./api";
import { Database_Objects } from "./database_types";

type account_t = Pick<
  Database_Objects,
  "account_id" | "name" | "category" | "chart_account"
>;

const account_ob = await api.GetDB<account_t[]>("account");

const sorted_acc = account_ob
  .sort((a, b) => {
    return a.chart_account - b.chart_account;
  })
  .filter((acc) => {
    return acc.chart_account;
  });

// FETCHING ACCOUNTS
const createChartElement = (account_name: string): HTMLOptionElement => {
  const option_element = <HTMLOptionElement>document.createElement("option");
  option_element.value = account_name;
  option_element.classList.add("acc-selection", "my-4", "p-2");
  option_element.textContent = account_name;

  return option_element;
};

const appendChartToAccount = () => {
  const dr_box = <HTMLSelectElement>document.querySelector(".account-deb");
  const cr_box = <HTMLSelectElement>document.querySelector(".account-cred");
  sorted_acc.forEach((acc) => {
    dr_box.appendChild(createChartElement(acc.name));
  });
  sorted_acc.reverse().forEach((acc) => {
    cr_box.appendChild(createChartElement(acc.name));
  });
};

appendChartToAccount();

// SELECTING ACCOUNTS
type transaction_tab_t = Pick<
  Database_Objects,
  "transaction_tab_id" | "date" | "description"
>;

const tab_ob: transaction_tab_t[] = (
  await GetDB<transaction_tab_t[]>("transaction")
).sort((a, b) => {
  return a.transaction_tab_id - b.transaction_tab_id;
});

type transaction_detail_t = Pick<
  Database_Objects,
  | "transaction_detail_id"
  | "transaction_tab_id"
  | "account_id"
  | "amount"
  | "is_debit"
>;

const trans_detail_ob: transaction_detail_t[] = (
  await GetDB<transaction_detail_t[]>("transaction_detail")
).sort((a, b) => {
  return a.transaction_detail_id - b.transaction_detail_id;
});

const account_post_doc = <HTMLFormElement>(
  document.querySelector(".account-post")
);

const debit_child_doc = <HTMLSelectElement>(
  document.querySelector(".account-deb")
);
const credit_child_doc = <HTMLSelectElement>(
  document.querySelector(".account-cred")
);

const date_DOCUMENT = <HTMLInputElement>document.querySelector(".date");
const amount_doc = <HTMLInputElement>document.querySelector(".amt");
const description_doc = <HTMLInputElement>document.querySelector(".desc");
let input_date = new Date().toISOString();

date_DOCUMENT.addEventListener("change", (e: Event) => {
  const input = <HTMLInputElement>e.currentTarget;
  const date_entered = new Date(<Date>input.valueAsDate).toISOString();
  input_date = date_entered;
});

account_post_doc.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const child_debit = debit_child_doc.value;
  const child_credit = credit_child_doc.value;

  const latest_tab: number =
    trans_detail_ob.length > 0
      ? tab_ob[tab_ob.length - 1].transaction_tab_id + 1
      : 1;
  const child_desc: string = description_doc.value;

  const trans_tab: transaction_tab_t = {
    transaction_tab_id: latest_tab,
    date: input_date,
    description: child_desc,
  };

  await PostDB<transaction_tab_t>("transaction", trans_tab);

  let child_amt: number = parseFloat(amount_doc.value);
  if (isNaN(child_amt)) {
    child_amt = 0;
  }

  const latest_tab_detail: number =
    trans_detail_ob.length > 0
      ? trans_detail_ob[trans_detail_ob.length - 1].transaction_detail_id + 1
      : 1;

  const debit_id: number = (<account_t>sorted_acc.find((acc) => {
    return acc.name === child_debit;
  })).account_id;

  type t_tab_t = Pick<
    Database_Objects,
    "transaction_tab_id" | "date" | "description"
  >;

  const getTab = await GetDB<t_tab_t[]>("transaction");

  const newest_tab = getTab[getTab.length - 1].transaction_tab_id;

  const debit_detail: transaction_detail_t = {
    account_id: debit_id,
    transaction_tab_id: newest_tab,
    transaction_detail_id: latest_tab_detail + 1,
    amount: child_amt,
    is_debit: true,
  };
  await PostDB<transaction_detail_t>("transaction_detail", debit_detail);

  const credit_id: number = (<account_t>sorted_acc.find((acc) => {
    return acc.name === child_credit;
  })).account_id;

  const credit_detail: transaction_detail_t = {
    account_id: credit_id,
    transaction_tab_id: newest_tab,
    transaction_detail_id: latest_tab_detail + 2,
    amount: child_amt,
    is_debit: false,
  };
  await PostDB<transaction_detail_t>("transaction_detail", credit_detail);

  account_post_doc.reset();
  alert("Inserted transaction submitted successfully");
});

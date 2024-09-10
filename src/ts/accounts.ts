import api from "./api";
import { Database_Objects } from "./database_types";

type account_t = Pick<Database_Objects, "name" | "category">;

const account_ob = await api.GetSupabase<account_t[]>("account");

const filterAccount = (account_type: string): account_t[] => {
  return account_ob.filter((account) => {
    return account.category === account_type;
  });
};

const asset_acc: account_t[] = filterAccount("Asset");
const liability_acc: account_t[] = filterAccount("Liability");
const capital_acc: account_t[] = filterAccount("Capital");
const withdrawal_acc: account_t[] = filterAccount("Withdrawal");
const revenue_acc: account_t[] = filterAccount("Revenue");
const expense_acc: account_t[] = filterAccount("Expense");

const sorted_acc: account_t[] = [];
const pushToSortedAccount = (accounts: account_t[]): void => {
  accounts.forEach((account) => {
    sorted_acc.push(account);
  });
};
pushToSortedAccount(asset_acc);
pushToSortedAccount(liability_acc);
pushToSortedAccount(capital_acc);
pushToSortedAccount(withdrawal_acc);
pushToSortedAccount(revenue_acc);
pushToSortedAccount(expense_acc);
sorted_acc.pop();
sorted_acc.pop();

const createChartElement = (account_name: string): HTMLOptionElement => {
  const option_element = <HTMLOptionElement>document.createElement("option");
  option_element.value = account_name;
  option_element.classList.add("acc-selection", "my-4");
  option_element.textContent = account_name;

  return option_element;
};

const appendChartToAccount = () => {
  const dr_box = <HTMLSelectElement>document.querySelector(".account-deb");
  const cr_box = <HTMLSelectElement>document.querySelector(".account-cred");
  sorted_acc.forEach((acc) => {
    dr_box.appendChild(createChartElement(acc.name));
    cr_box.appendChild(createChartElement(acc.name));
  });
};

appendChartToAccount();

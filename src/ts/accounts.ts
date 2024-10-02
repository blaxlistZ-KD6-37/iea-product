import "../css/style.css";
import api from "./api";
import { Database_Objects } from "./database_types";

type account_t = Pick<Database_Objects, "name" | "category" | "chart_account">;

const account_ob = await api.GetDB<account_t[]>("account");

const sorted_acc = account_ob
  .sort((a, b) => {
    return a.chart_account - b.chart_account;
  })
  .filter((acc) => {
    return acc.chart_account < 998;
  });

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
  });
  sorted_acc.reverse().forEach((acc) => {
    cr_box.appendChild(createChartElement(acc.name));
  });
};

appendChartToAccount();

import { acc_ob, CalculateItem } from "./utils";

const actual_capital_DOCUMENT = <HTMLSpanElement>(
  document.querySelector(".actual-capital")
);

let total_capital: number = CalculateItem(
  acc_ob.filter((account) => {
    return (
      account.category === "Revenue" ||
      account.category === "Expense" ||
      (account.category === "Capital" &&
        new Date(account.date).getMonth() === new Date(2024, 7).getMonth() + 1)
    );
  })
);

actual_capital_DOCUMENT.textContent = `₱ ${total_capital.toLocaleString()}`;

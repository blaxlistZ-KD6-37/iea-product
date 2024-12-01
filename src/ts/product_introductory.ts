import { acc_ob, CalculateItem } from "./utils";

const actual_capital_DOCUMENT = <HTMLSpanElement>(
  document.querySelector(".actual-capital")
);

let total_capital: number = CalculateItem(
  acc_ob.filter((account) => {
    return (
      (account.category === "Revenue" &&
        new Date(account.date).getMonth() ===
          new Date(2024, 9).getMonth() + 1) ||
      (account.category === "Expense" &&
        new Date(account.date).getMonth() ===
          new Date(2024, 9).getMonth() + 1) ||
      (account.category === "Capital" &&
        new Date(account.date).getMonth() === new Date(2024, 9).getMonth() + 1)
    );
  })
);

actual_capital_DOCUMENT.textContent = `₱ ${total_capital.toLocaleString(
  "en-US",
  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
)}`;

const actual_target_sales_DOCUMENT = <HTMLDivElement>(
  document.querySelectorAll(".rating-stars")[1]
);

let total_revenue: number = CalculateItem(
  acc_ob.filter((account) => {
    return account.category === "Revenue" && account.chart_account < 998;
  })
);

actual_target_sales_DOCUMENT.textContent = `₱ ${total_revenue.toLocaleString(
  "en-US",
  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
)}`;

const actual_coffee_quantity_sold = <HTMLSpanElement>(
  document.querySelector(".actual-sold")
);

actual_coffee_quantity_sold.textContent = `${Math.abs(
  Math.round(total_revenue / 45)
)}`;

import { Chart, registerables } from "chart.js";
import utils, { acc_ob } from "./utils";
import { financial_accounting_t } from "./database_types";

Chart.register(...registerables);

const daysWeekInterp = (pivot: number): number => {
  return (Math.pow(pivot, 3) - 3 * Math.pow(pivot, 2) + 16 * pivot + 14) / 2;
};

const totalWeeklyBalance = (
  category: string,
  month: number,
  pivot_week: number
): number => {
  const week_last = daysWeekInterp(pivot_week - 1);
  const week_curr = daysWeekInterp(pivot_week);

  const categorized_items = acc_ob.filter((acc) => {
    return (
      acc.category == category && new Date(acc.date).getMonth() + 1 == month
    );
  });

  const normal_items = categorized_items.filter((item) => {
    const date_item = new Date(item.date).getDate();
    return week_last <= date_item && date_item <= week_curr;
  });

  const total = utils.CalculateItem(normal_items);

  return total;
};

const weekly_revenue: number[] = [];
const weekly_expense: number[] = [];
const weekly_profit: number[] = [];
const week_date: string[] = [];

for (let ndx = 0; ndx < 5; ndx++) {
  weekly_revenue.push(totalWeeklyBalance("Revenue", 9, ndx));
  weekly_expense.push(totalWeeklyBalance("Expense", 9, ndx));
  weekly_profit.push(weekly_revenue[ndx] - weekly_expense[ndx]);
  week_date.push(`Week ${ndx + 1}`);
}

const net_chart = <HTMLCanvasElement>document.getElementById("net-income");

new Chart(net_chart, {
  type: "line",
  data: {
    labels: week_date,
    datasets: [
      {
        label: "Weekly Revenue",
        data: weekly_revenue,
      },
      {
        label: "Weekly Expense",
        data: weekly_expense,
      },
      {
        label: "Weekly Profit",
        data: weekly_profit,
      },
    ],
  },
});

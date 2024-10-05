import { Chart, registerables } from "chart.js";
import { acc_ob } from "./utils";

Chart.register(...registerables);

const sales = acc_ob.filter((sale) => {
  return sale.name === "Cash" && sale.is_debit === false;
});

const chart = <HTMLCanvasElement>document.getElementById("acquisitions");

new Chart(chart, {
  type: "line",
  data: {
    labels: sales.map((row) => new Date(row.date).toUTCString().slice(0, 11)),
    datasets: [
      {
        label: "Monthly Cash Credit",
        data: sales.map((row) => row.amount),
      },
    ],
  },
});

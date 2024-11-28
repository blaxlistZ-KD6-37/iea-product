import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

type Food_T = {
  name: string;
  cost: number;
};

const silogan: Food_T[] = [
  { name: "Beef Tapsilog", cost: 90 },
  { name: "Hungarian Silog", cost: 104 },
  { name: "Beef Meatballs Silog", cost: 60 },
  { name: "Bacon Silog", cost: 72 },
  { name: "Burgersteak Silog", cost: 61 },
  { name: "Chicken-skin Silog", cost: 66 },
  { name: "Beefloaf Silog", cost: 58 },
  { name: "Tempura Silog", cost: 54 },
  { name: "Spanish Sardine Silog", cost: 78 },
  { name: "Spam Silog", cost: 98 },
  { name: "Pork Silog", cost: 87 },
  { name: "Sardine Silog", cost: 58 },
  { name: "Long Silog", cost: 54 },
  { name: "Hot Silog", cost: 62 },
  { name: "Chosilog", cost: 71 },
  { name: "Sisig Silog", cost: 81 },
  { name: "Tosilog", cost: 74 },
  { name: "Ham Silog", cost: 55 },
  { name: "Bangus Silog", cost: 72 },
  { name: "Corned Silog", cost: 101 },
  { name: "Skinless Silog", cost: 68 },
];

const double_silog: Food_T[] = [];
const garlic_rice = 14;
const takeout_fee = 4;

for (let ndx_first = 0; ndx_first < silogan.length; ndx_first++) {
  for (let ndx_second = ndx_first; ndx_second < silogan.length; ndx_second++) {
    double_silog.push({
      name: `${silogan[ndx_first].name} & ${silogan[ndx_second].name}`,
      cost: silogan[ndx_first].cost + silogan[ndx_second].cost + takeout_fee,
    });
  }
}

double_silog.sort((a, b) => {
  return b.cost - a.cost;
});

const food_stack_CHART = <HTMLCanvasElement>(
  document.getElementById("food-stack")
);
const food_silog_name: string[] = [];
const food_silog_cost: number[] = [];

double_silog.forEach((silog) => {
  food_silog_name.push(silog.name);
  food_silog_cost.push(silog.cost);
});

new Chart(food_stack_CHART, {
  type: "bar",
  data: {
    labels: food_silog_name,
    datasets: [
      {
        label: "Food Costs",
        data: food_silog_cost,
      },
    ],
  },
});

const createFoodPermutationDOCUMENT = (food: Food_T): void => {
  const food_permuation_DOCUMENT = <HTMLDivElement>(
    document.getElementById("food-permutation")
  );

  const item = <HTMLDivElement>document.createElement("div");
  item.classList.add(
    "outline",
    "outline-1",
    "max-w-72",
    "p-5",
    "text-center",
    "bg-slate-100",
    "rounded-md"
  );

  item.innerHTML = `
  <div>${food.name}</div>
  <div>₱ ${food.cost.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}</div>
  `;

  food_permuation_DOCUMENT.appendChild(item);
};

double_silog.forEach((silog) => {
  createFoodPermutationDOCUMENT(silog);
});

const randomFoodIndex = (): number => {
  debugger;
  const minimum = 0;
  const maximum = double_silog.length;

  return Math.abs(Math.floor(Math.random() * (minimum - maximum) + minimum));
};

const food_today = <HTMLDivElement>document.querySelector(".food-container");
const food_random_index = randomFoodIndex();

food_today.innerHTML = `
<div>${double_silog[food_random_index].name}</div>
<div>₱ ${double_silog[food_random_index].cost.toLocaleString("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})}</div>
`;

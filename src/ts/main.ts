import "../css/style.css";

const frameworks = <NodeListOf<HTMLElement>>(
  document.querySelectorAll(".frameworks")
);
const framework_vec: HTMLElement[] = Array.from(frameworks);

const non_pivot_vec = framework_vec.filter((_, ndx: number): boolean => {
  return ndx !== 4;
});

const pivot_vec = <HTMLElement>framework_vec.find((_, ndx: number): boolean => {
  return ndx === 4;
});

pivot_vec.addEventListener("click", () => {
  non_pivot_vec[0].classList.toggle("-translate-x-56");
  non_pivot_vec[0].classList.toggle("-translate-y-56");
  non_pivot_vec[0].classList.toggle("z-50");

  non_pivot_vec[1].classList.toggle("translate-x-56");
  non_pivot_vec[1].classList.toggle("-translate-y-56");
  non_pivot_vec[1].classList.toggle("z-50");

  non_pivot_vec[2].classList.toggle("-translate-x-56");
  non_pivot_vec[2].classList.toggle("translate-y-56");
  non_pivot_vec[2].classList.toggle("z-50");

  non_pivot_vec[3].classList.toggle("translate-x-56");
  non_pivot_vec[3].classList.toggle("translate-y-56");
  non_pivot_vec[3].classList.toggle("z-50");
});

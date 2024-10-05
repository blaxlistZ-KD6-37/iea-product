import "../css/style.css";

const frameworks = <NodeListOf<HTMLElement>>(
  document.querySelectorAll(".frameworks")
);
const framework_vec: HTMLElement[] = Array.from(frameworks);

const non_pivot_vec = framework_vec.filter((_, ndx: number): boolean => {
  return ndx !== 2;
});

const pivot_vec = <HTMLElement>framework_vec.find((_, ndx: number): boolean => {
  return ndx === 2;
});

pivot_vec.addEventListener("click", () => {
  non_pivot_vec.forEach((frame) => {
    const frame_parent = <HTMLElement>frame.parentElement;
    frame_parent.classList.toggle("row-start-2");
    frame_parent.classList.toggle("row-end-2");
    frame_parent.classList.toggle("col-start-2");
    frame_parent.classList.toggle("col-end-2");
    frame_parent.classList.toggle("-z-50");
  });
});

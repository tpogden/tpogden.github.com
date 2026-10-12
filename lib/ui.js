// Small UI helpers for the Moving Figures posts.

// A labelled slider: label, range input and a read-only readout of its value. It is
// a valid Observable `viewof`: the element's `value` is a number, and an `input`
// event is dispatched (by the range input, bubbling up) whenever it changes.
export function slider({
  label,
  min = 0,
  max = 1,
  step = 0.01,
  value = min,
  format = (v) => String(v),
} = {}) {
  const root = document.createElement("label");
  root.className = "mf-slider";

  const text = document.createElement("span");
  text.className = "mf-slider-label";
  text.textContent = label;

  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = value;

  const output = document.createElement("output");
  const update = () => (output.textContent = format(Number(input.value)));
  input.addEventListener("input", update);
  update();

  root.append(text, input, output);
  Object.defineProperty(root, "value", {
    get: () => Number(input.value),
    set: (v) => {
      input.value = v;
      update();
    },
  });
  return root;
}

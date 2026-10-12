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

// A labelled on/off switch with the same look as slider(). `value` is a boolean
// and an `input` event bubbles when it flips. `format` maps the boolean to the
// read-only text shown beside the box.
export function toggle({
  label,
  value = false,
  format = (on) => (on ? "on" : "off"),
} = {}) {
  const root = document.createElement("label");
  root.className = "mf-slider";

  const text = document.createElement("span");
  text.className = "mf-slider-label";
  text.textContent = label;

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = value;

  const output = document.createElement("output");
  const update = () => (output.textContent = format(input.checked));
  input.addEventListener("input", update);
  update();

  root.append(text, input, output);
  Object.defineProperty(root, "value", {
    get: () => input.checked,
    set: (v) => {
      input.checked = Boolean(v);
      update();
    },
  });
  return root;
}

// A positioned wrapper for a canvas with a collapsible control panel laid over its
// top-right corner. `controls` are existing input elements (slider(), toggle(), ...);
// they are moved into the panel, and keep working because their events still fire.
// Return the result from the cell (`yield ui.stage(canvas, [...])`).
export function stage(canvas, controls = [], { title = "Controls" } = {}) {
  const root = document.createElement("div");
  root.className = "mf-stage";

  const panel = document.createElement("details");
  panel.className = "mf-controls";
  panel.open = true;
  const summary = document.createElement("summary");
  summary.textContent = title;
  panel.append(summary, ...controls);

  root.append(canvas, panel);
  return root;
}

// Style for Observable Plot charts: transparent, themed colour, and a sans-serif
// face so axis labels and legends read as chart text, not as body copy. Use as
// `Plot.plot({ style: ui.plotStyle, ... })`.
export const plotStyle = {
  background: "transparent",
  color: "currentColor",
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: "12px",
};

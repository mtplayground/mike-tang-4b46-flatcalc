(function () {
  "use strict";

  const display = document.querySelector("#calculator-display");
  const keypad = document.querySelector(".calculator-keypad");

  const state = createInitialState();

  function createInitialState() {
    return {
      currentEntry: "0",
      pendingOperator: null,
      accumulatedValue: null,
      shouldStartNewEntry: false,
    };
  }

  function render() {
    if (!display) {
      return;
    }

    display.textContent = state.currentEntry;
  }

  function inputDigit(digit) {
    if (!/^\d$/.test(digit)) {
      return;
    }

    if (state.shouldStartNewEntry) {
      state.currentEntry = digit;
      state.shouldStartNewEntry = false;
      render();
      return;
    }

    state.currentEntry = state.currentEntry === "0" ? digit : `${state.currentEntry}${digit}`;
    render();
  }

  function inputDecimal() {
    if (state.shouldStartNewEntry) {
      state.currentEntry = "0.";
      state.shouldStartNewEntry = false;
      render();
      return;
    }

    if (!state.currentEntry.includes(".")) {
      state.currentEntry = `${state.currentEntry}.`;
      render();
    }
  }

  function inputOperator(operator) {
    if (!["+", "-", "*", "/"].includes(operator)) {
      return;
    }

    state.accumulatedValue = Number(state.currentEntry);
    state.pendingOperator = operator;
    state.shouldStartNewEntry = true;
    render();
  }

  function inputEquals() {
    state.pendingOperator = null;
    state.accumulatedValue = null;
    state.shouldStartNewEntry = true;
    render();
  }

  function clear() {
    Object.assign(state, createInitialState());
    render();
  }

  function handleButtonAction(button) {
    const { action, value } = button.dataset;

    switch (action) {
      case "digit":
        inputDigit(value);
        break;
      case "decimal":
        inputDecimal();
        break;
      case "operator":
        inputOperator(value);
        break;
      case "equals":
        inputEquals();
        break;
      case "clear":
        clear();
        break;
      default:
        break;
    }
  }

  function handleKeypadClick(event) {
    const button = event.target.closest("button[data-action]");

    if (!button || !keypad.contains(button)) {
      return;
    }

    handleButtonAction(button);
  }

  function getState() {
    return { ...state };
  }

  if (keypad) {
    keypad.addEventListener("click", handleKeypadClick);
  }

  window.calculatorController = Object.freeze({
    clear,
    getState,
    inputDecimal,
    inputDigit,
    inputEquals,
    inputOperator,
    render,
  });

  document.documentElement.dataset.script = "loaded";
  render();
})();

(function () {
  "use strict";

  const display = document.querySelector("#calculator-display");
  const keypad = document.querySelector(".calculator-keypad");
  const ERROR_DIVIDE_BY_ZERO = "Cannot divide by zero";
  const ERROR_CALCULATION = "Error";

  const state = createInitialState();

  function createInitialState() {
    return {
      currentEntry: "0",
      pendingOperator: null,
      accumulatedValue: null,
      shouldStartNewEntry: false,
      error: null,
    };
  }

  function render() {
    if (!display) {
      return;
    }

    display.textContent = state.error || state.currentEntry;
  }

  function formatResult(value) {
    if (!Number.isFinite(value)) {
      return ERROR_CALCULATION;
    }

    return Number.parseFloat(value.toPrecision(12)).toString();
  }

  function setError(message) {
    state.currentEntry = "0";
    state.pendingOperator = null;
    state.accumulatedValue = null;
    state.shouldStartNewEntry = true;
    state.error = message;
  }

  function applyOperation(left, operator, right) {
    switch (operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        if (right === 0) {
          setError(ERROR_DIVIDE_BY_ZERO);
          return null;
        }

        return left / right;
      default:
        return right;
    }
  }

  function applyPendingOperation() {
    if (state.pendingOperator === null || state.accumulatedValue === null) {
      return Number(state.currentEntry);
    }

    const result = applyOperation(
      state.accumulatedValue,
      state.pendingOperator,
      Number(state.currentEntry),
    );

    if (result === null) {
      render();
      return null;
    }

    state.currentEntry = formatResult(result);
    if (state.currentEntry === ERROR_CALCULATION) {
      setError(ERROR_CALCULATION);
      render();
      return null;
    }

    state.accumulatedValue = result;
    return result;
  }

  function inputDigit(digit) {
    if (!/^\d$/.test(digit)) {
      return;
    }

    if (state.error) {
      Object.assign(state, createInitialState());
    }

    if (state.shouldStartNewEntry) {
      state.currentEntry = digit;
      state.shouldStartNewEntry = false;
      render();
      return;
    }

    if (state.currentEntry === "0") {
      state.currentEntry = digit;
      render();
      return;
    }

    state.currentEntry = `${state.currentEntry}${digit}`;
    render();
  }

  function inputDecimal() {
    if (state.error) {
      Object.assign(state, createInitialState());
    }

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
    if (state.error || !["+", "-", "*", "/"].includes(operator)) {
      render();
      return;
    }

    if (state.pendingOperator !== null && !state.shouldStartNewEntry) {
      const result = applyPendingOperation();
      if (result === null) {
        return;
      }

      state.accumulatedValue = result;
    } else {
      state.accumulatedValue = Number(state.currentEntry);
    }

    state.pendingOperator = operator;
    state.shouldStartNewEntry = true;
    render();
  }

  function inputEquals() {
    if (state.error) {
      render();
      return;
    }

    if (state.pendingOperator === null || state.shouldStartNewEntry) {
      state.pendingOperator = null;
      state.accumulatedValue = null;
      state.shouldStartNewEntry = true;
      render();
      return;
    }

    const result = applyPendingOperation();
    if (result === null) {
      return;
    }

    state.pendingOperator = null;
    state.accumulatedValue = null;
    state.shouldStartNewEntry = true;
    render();
  }

  function clear() {
    Object.assign(state, createInitialState());
    render();
  }

  function handleCalculatorAction(action, value) {
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

  function handleButtonAction(button) {
    const { action, value } = button.dataset;

    handleCalculatorAction(action, value);
  }

  function handleKeypadClick(event) {
    const button = event.target.closest("button[data-action]");

    if (!button || !keypad.contains(button)) {
      return;
    }

    handleButtonAction(button);
  }

  function mapKeyboardAction(key) {
    if (/^\d$/.test(key)) {
      return { action: "digit", value: key };
    }

    if (key === ".") {
      return { action: "decimal", value: "." };
    }

    if (["+", "-", "*", "/", "−"].includes(key)) {
      return { action: "operator", value: key === "−" ? "-" : key };
    }

    if (key === "Enter" || key === "=") {
      return { action: "equals" };
    }

    if (key === "Escape") {
      return { action: "clear" };
    }

    return null;
  }

  function handleKeyboardInput(event) {
    const mappedAction = mapKeyboardAction(event.key);

    if (!mappedAction) {
      return;
    }

    event.preventDefault();
    handleCalculatorAction(mappedAction.action, mappedAction.value);
  }

  function getState() {
    return { ...state };
  }

  if (keypad) {
    keypad.addEventListener("click", handleKeypadClick);
  }

  document.addEventListener("keydown", handleKeyboardInput);

  window.calculatorController = Object.freeze({
    clear,
    applyPendingOperation,
    getState,
    handleCalculatorAction,
    handleKeyboardInput,
    inputDecimal,
    inputDigit,
    inputEquals,
    inputOperator,
    render,
  });

  document.documentElement.dataset.script = "loaded";
  render();
})();

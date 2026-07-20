(function () {
  "use strict";

  const display = document.querySelector("#calculator-display");

  const state = {
    currentEntry: "0",
    pendingOperator: null,
    accumulatedValue: null,
    shouldStartNewEntry: false,
  };

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

  function getState() {
    return { ...state };
  }

  window.calculatorController = Object.freeze({
    getState,
    inputDecimal,
    inputDigit,
    render,
  });

  document.documentElement.dataset.script = "loaded";
  render();
})();

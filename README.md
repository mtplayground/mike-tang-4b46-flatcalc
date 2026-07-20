# Calculator

This project is a no-build static site. It is served directly from plain files:

- `index.html`
- `styles.css`
- `calculator.js`

There are no package dependencies and no build step.

## Verification checklist

The calculator was verified with lightweight DOM-mock checks against `calculator.js`:

- Addition: `12 + 7 = 19`
- Subtraction: `12 - 7 = 5`
- Multiplication: `12 * 7 = 84`
- Division: `12 / 3 = 4`
- Chained operations: `2 + 3 * 4 = 20`
- Decimal arithmetic: `1.5 + 2.25 = 3.75`
- Divide-by-zero: `8 / 0 = Cannot divide by zero`
- Clear/reset: clear after an error returns the display to `0`
- Live display updates: entering `456` shows `456` before equals
- Keyboard input: `9 - 4 Enter` shows `5`

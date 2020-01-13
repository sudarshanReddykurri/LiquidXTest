// The history object allows you to manage and handle the browser history inside your views or components.
//     length: (number), the number of entries in the history stack
//     action: (string), the current action (PUSH, REPLACE or POP)
//     location: (object), the current location
//     push(path, [state]): (function), pushes a new entry onto the history stack
//     replace(path, [state]): (function), replaces the current entry on the history stack
//     go(n): (function), moves the pointer in the history stack by n entries
//     goBack(): (function), equivalent to go(-1)
//     goForward(): (function,) equivalent to go(1)
//     block(prompt): (function), prevents navigation

let history;
export const registerNav = ref => {
console.log("TCL: ref", ref)
  history = ref.history;
};
const jumpTo = uri => {
  history.push(uri);
};
export const goTo = uri => {
  history.go(uri);
};
export default jumpTo;

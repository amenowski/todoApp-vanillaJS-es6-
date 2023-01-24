"use strict";

// SELECT ELEMENTS
const form = document.querySelector(`#todoform`);
const todoInput = document.querySelector(`#newtodo`);
const todosList = document.querySelector(`#todos-list`);
const notificationEl = document.querySelector(`.notification`);

// VARS
let todos = JSON.parse(localStorage.getItem(`todos`)) || [];
let editTodoId = -1;

// 1st render
renderTodos();

// FORM SUBMIT
form.addEventListener(`submit`, (e) => {
  e.preventDefault();
  saveTodo();
  renderTodos();
  localStorage.setItem(`todos`, JSON.stringify(todos));
});

// Save todo
const saveTodo = () => {
  const todoValue = todoInput.value;
  // check if the todo is empty
  const isEmpty = todoValue === ``;
  // check for duplicate
  const isDuplicate = todos.some(
    (todo) => todo.value.toLowerCase() === todoValue.toLowerCase()
  );

  if (isEmpty) {
    showNotification(`Todo's input is empty`);
  } else if (isDuplicate) {
    showNotification(`Todo already exists!`);
  } else {
    if (editTodoId >= 0) {
      todos = todos.map(({ value, ...rest }, index) => ({
        ...rest,
        value: index === editTodoId ? todoValue : value,
      }));
      editTodoId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
    }
    todoInput.value = ``;
  }
};
// Render todo
function renderTodos() {
  if (todos.length === 0) {
    todosList.innerHTML = `<center>Nothing to do!</center>`;
    return;
  }
  // Clear element before a re render
  todosList.innerHTML = ``;

  // Re render todos
  todos.forEach(({ value, checked, color }, index) => {
    todosList.innerHTML += `
        <div class="todo" id="${index}">
        <i class="bi ${checked ? "bi-check-circle-fill" : "bi-circle"}"
          style="color: ${color}"
          data-action="check"
          ></i>
          <p class="${
            checked ? "checked" : ""
          }" data-action="check">${value}</p>
          <i class="bi bi-pencil-square" data-action="edit"></i>
          <i class="bi bi-trash" data-action="delete"></i>
        </div>
        `;
  });
}
// CLICK EVENT LISTENER FOR ALL THE TODOS
todosList.addEventListener(`click`, (e) => {
  const target = e.target;
  const parentElement = target.parentNode;
  if (parentElement.className !== `todo`) return;
  // todo id
  const todo = parentElement;
  const todoId = Number(todo.id);
  // target action like edit or trash
  const action = target.dataset.action;

  // short circuiting
  action === `check` && checkTodo(todoId);
  action === `edit` && editTodo(todoId);
  action === `delete` && deleteTodo(todoId);
});

// Check a todo
const checkTodo = (todoId) => {
  todos = todos.map(({ checked, ...rest }, index) => ({
    ...rest,
    checked: index === todoId ? !checked : checked,
  }));
  renderTodos();
  localStorage.setItem(`todos`, JSON.stringify(todos));
};

// Edit a todo
const editTodo = (todoId) => {
  todoInput.value = todos[todoId].value;
  editTodoId = todoId;
};
// Delete a todo
const deleteTodo = (todoId) => {
  todos = todos.filter((_, index) => index !== todoId);
  editTodoId = -1;

  // re-render
  renderTodos();
  localStorage.setItem(`todos`, JSON.stringify(todos));
};

// Show a notification
const showNotification = (msg) => {
  notificationEl.innerHTML = msg;

  notificationEl.classList.add(`notif-enter`);

  setTimeout(() => {
    notificationEl.classList.remove(`notif-enter`);
  }, 2000);
};

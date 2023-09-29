const input = document.querySelector('.type');
const listHTML = document.querySelector('.tasks');
const liElemQuantityHTML = document.querySelector('.items-index');
let liElemQuantity = 0;
let list = [];

// Retrieve todos from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    list = JSON.parse(storedTodos);
    liElemQuantity = list.length;
    liElemQuantityHTML.innerHTML = liElemQuantity;

    list.forEach((todo) => {
      const newLi = createTodoElement(todo.name, todo.checked);
      listHTML.appendChild(newLi);
    });
  }

  const liELem = document.querySelectorAll('.tasks li');

  liELem.forEach((elem) => {
    if (elem.closest('.circle').getAttribute('data-checked') !== 'true') {
      elem.style.color = 'var(--very-dark-grayish-blue)';
    }
  });
});

document.addEventListener('keydown', addTodos);

function addTodos(e) {
  if (e.key === 'Enter') {
    const todo = input.value.trim();

    if (todo === '') {
      return;
    }

    const newLi = createTodoElement(todo, false);
    list.push({ name: todo, checked: false });
    listHTML.appendChild(newLi);

    liElemQuantity++;
    liElemQuantityHTML.innerHTML = liElemQuantity;

    input.value = '';

    // Save updated todos to localStorage
    saveTodosToLocalStorage();
  }
}

document.addEventListener('click', (e) => {
  const target = e.target;
  const parentLi = e.target.closest('li');

  if (!parentLi) {
    return;
  }

  const index = Array.from(listHTML.children).indexOf(parentLi);

  if (index !== -1) {
    const todo = list[index].name;

    if (
      target.classList.contains('circle') &&
      target.parentNode.classList.contains('todo')
    ) {
      const todoText = parentLi.querySelector('.task-text');

      if (target.getAttribute('data-checked') === 'false') {
        target.setAttribute('data-checked', 'true');

        target.classList.add('checked');
        todoText.innerHTML = `<s>${todo}</s>`;
        todoText.style.color = 'var(--very-dark-grayish-blue)';
        list[index].checked = true;
      } else {
        target.setAttribute('data-checked', 'false');

        target.classList.remove('checked');
        todoText.innerHTML = todo;
        todoText.style.color = 'var(--light-grayish-blue)';
        list[index].checked = false;
      }

      // Save updated todos to localStorage
      saveTodosToLocalStorage();
    }
  }
  const deletedLi = target.closest('li');

  if (target.classList.contains('xmark')) {
    listHTML.removeChild(deletedLi);
    liElemQuantity--;
    liElemQuantityHTML.innerHTML = liElemQuantity;

    // Remove deleted todo from list
    const deletedIndex = Array.from(listHTML.children).indexOf(deletedLi);
    if (deletedIndex !== -1) {
      list.splice(deletedIndex, 1);
    }

    // Save updated todos to localStorage
    saveTodosToLocalStorage();
  }

  deletedLi.addEventListener('dblclick', () => {
    try {
      listHTML.removeChild(deletedLi);
      liElemQuantity--;
      liElemQuantityHTML.innerHTML = liElemQuantity;

      // Remove deleted todo from list
      const deletedIndex = Array.from(listHTML.children).indexOf(deletedLi);
      if (deletedIndex !== -1) {
        list.splice(deletedIndex, 1);
      }

      // Save updated todos to localStorage
      saveTodosToLocalStorage();
    } catch {
      // handling DOM error message, works anyway
    }
  });
});

const clearCompleted = document.querySelector('.clear');

clearCompleted.addEventListener('click', () => {
  const liElem = document.querySelectorAll('.tasks li');

  liElem.forEach((elem) => {
    const checkbox = elem.querySelector('.circle');
    if (checkbox.getAttribute('data-checked') === 'true') {
      listHTML.removeChild(elem);
      liElemQuantity--;

      // Remove completed todo from list
      const completedIndex = Array.from(listHTML.children).indexOf(elem);
      if (completedIndex !== -1) {
        list.splice(completedIndex, 1);
      }
    }
  });

  liElemQuantityHTML.innerHTML = liElemQuantity;

  // Save updated todos to localStorage
  saveTodosToLocalStorage();
});

const filterButtons = document.querySelectorAll('.dom-steering p');

filterButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    filterButtons.forEach((btn) => btn.classList.remove('selected'));

    button.classList.add('selected');
    const liElem = document.querySelectorAll('.tasks li');

    if (e.target.classList.contains('active')) {
      liElem.forEach((elem) => {
        const checkbox = elem.querySelector('.circle');
        if (checkbox.getAttribute('data-checked') === 'true') {
          elem.style.display = 'none';
        }
        if (checkbox.getAttribute('data-checked') !== 'true') {
          elem.style.display = 'flex';
        }
      });
    }

    if (e.target.classList.contains('completed')) {
      liElem.forEach((elem) => {
        const checkbox = elem.querySelector('.circle');

        if (checkbox.getAttribute('data-checked') === 'true') {
          elem.style.display = 'flex';
        }
        if (checkbox.getAttribute('data-checked') !== 'true') {
          elem.style.display = 'none';
        }
      });
    }

    if (e.target.classList.contains('all')) {
      liElem.forEach((elem) => {
        elem.style.display = 'flex';
      });
    }
  });
});

function createTodoElement(todoName, checked) {
  const newLi = document.createElement('li');

  newLi.setAttribute('class', 'flex');
  newLi.innerHTML = `
    <div class="flex todo">
      <div class="circle" data-checked='${checked}'></div>
      <p class="task-text">${checked ? `<s>${todoName}</s>` : todoName}</p>
    </div>
    <svg
      class="xmark"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18">
      <path
        fill="#494C6B"
        fill-rule="evenodd"
        d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" />
    </svg>
  `;

  return newLi;
}

function saveTodosToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(list));
}

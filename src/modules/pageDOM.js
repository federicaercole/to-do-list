import { todos, categories, filteredTodos, toggleTodo } from "./app";
import { createButton, updatePage, createDOMElement, createForm, createFormAddCategory, removeElement } from "./helpers";
import { modal, openDialog, createTodoCard, showCategoriesModal } from "./modalDOM";

const newTodobtn = document.querySelector(".new-todo");
const newCatbtn = document.querySelector(".new-category");
export const todoContainer = document.querySelector(".todo-container");
export const ul = document.querySelector(".todo-container ul");
const editCatBtn = document.querySelector(".edit-category");
export const categoriesHTML = document.querySelector(".categories");

function resetActiveState() {
    const buttons = document.querySelectorAll(".categories button");
    buttons.forEach(button => button.classList.remove("active"));
}

export function createCategoriesBtn() {
    const allProjects = categoriesHTML.appendChild(createButton("All projects", "button", "active"));

    allProjects.addEventListener("click", () => {
        todoContainer.classList.remove("filtered");
        resetActiveState();
        allProjects.classList.add("active");
        updatePage(ul);
    })

    categories.map(category => {
        const catBtn = categoriesHTML.appendChild(createButton(`${category}`, "button", ""));

        catBtn.addEventListener("click", event => {
            filteredTodos = todos.filter(todo => {
                return todo.category === event.target.textContent;
            });
            resetActiveState();
            todoContainer.classList.add("filtered");
            event.target.classList.add("active");
            updatePage(ul);
        });
    });

}

export function renderTodosPage(newTodo) {
    const li = document.createElement("li");
    ul.appendChild(li);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    li.appendChild(checkbox);

    checkbox.checked = newTodo.status;

    if (checkbox.checked) {
        li.setAttribute("class", "checked");
    }

    checkbox.addEventListener("change", () => {
        toggleTodo(newTodo);
        updatePage(ul);
    });

    const priorityTag = li.appendChild(createDOMElement("span", `${newTodo.priority}`, "priority-tag"));
    priorityTag.setAttribute("aria-label", "priority");
    priorityTag.classList.add(newTodo.priority.toLowerCase());

    const h2 = li.appendChild(createDOMElement("h2", `${newTodo.title}`));
    h2.setAttribute("tabindex", "0");
    h2.setAttribute("type", "button");
    h2.setAttribute("aria-label", `See and edit ${newTodo.title}`);

    li.appendChild(createDOMElement("span", `${(newTodo.dueDate).toLocaleString().split(',')[0]}`));
    createRemoveBtn(li, newTodo);

    h2.addEventListener("click", event => { openDialog(event), createTodoCard(newTodo) });
}

//Buttons on page
newTodobtn.addEventListener("click", event => {
    modal.classList.add("add");
    openDialog(event);
    createForm();
});

newCatbtn.addEventListener("click", event => {
    openDialog(event);
    createFormAddCategory();
});

editCatBtn.addEventListener("click", event => {
    openDialog(event);
    modal.classList.add("edit");
    showCategoriesModal();
});

export function createRemoveBtn(li, element) {
    const removeBtn = li.appendChild(createButton("", "button", ""));
    removeBtn.appendChild(createDOMElement("span", `Delete ${element.title || element}`, "visually-hidden"));

    removeBtn.addEventListener("click", function () {
        removeElement(li, element, modal.classList.contains("edit") ? categories : todos);
    });
}
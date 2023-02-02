import { todos, filteredTodos, categories, priorites, sortTodos } from "./app";
import { createCategoriesBtn, renderTodosPage, categoriesHTML, todoContainer, ul } from "./pageDOM";
import { modal, createAddBtn, createSaveBtn, createNewCategoryBtn } from "./modalDOM";

export function createDOMElement(el, content, elClass) {
    const element = document.createElement(el);
    element.textContent = content;
    element.classList.add(elClass);
    return element;
}

export function createFormElement(textLabel, id, labelClass, inputEl, inputType, form) {
    const label = form.appendChild(createDOMElement("label", textLabel));
    label.setAttribute("for", id);
    label.setAttribute("class", labelClass);

    const input = document.createElement(inputEl);
    input.setAttribute("type", inputType);
    input.id = id;

    form.appendChild(input);
}

export function createFormAddCategory() {
    modal.appendChild(createDOMElement("h2", "Add a New Category"));

    const form = modal.appendChild(document.createElement("form"));

    createFormElement("New Category", "new-category", "visually-hidden", "input", "text", form);
    createNewCategoryBtn(form);
};

export function createForm(todo) {
    modal.appendChild(createDOMElement("h2", modal.classList.contains("add") ? "Add a New Todo" : "Edit Todo"));

    const form = modal.appendChild(createDOMElement("form"));

    createFormElement("Todo Title", "title", "", "input", "text", form);
    createFormElement("Description", "desc", "", "textarea", "", form);
    createFormElement("Due Date", "dueDate", "", "input", "date", form);
    createFormElement("Priority", "priority", "", "select", "", form);
    createFormElement("Category", "category", "", "select", "", form);

    listToOption(priorites, "#priority");
    listToOption(categories, "#category");

    modal.classList.contains("add") ? createAddBtn(form) : createSaveBtn(todo, form);
}

function listToOption(list, id) {
    list.map(element => {
        const option = document.createElement("option");
        const select = document.querySelector(id);
        option.textContent = `${element}`;
        option.value = `${element}`;
        select.appendChild(option);
    });
}

export function printExistentInputs(todo) {
    title.value = todo.title;
    desc.value = todo.desc;
    priority.value = todo.priority;
    category.value = todo.category;
    dueDate.valueAsDate = todo.dueDate;
}

export function createButton(textButton, type, btnClass) {
    const button = document.createElement("button");
    button.textContent = textButton;
    button.setAttribute("type", type);
    button.setAttribute("class", btnClass);
    return button;
}

export function renderTodos(array = todoContainer.classList.contains("filtered") ? filteredTodos : todos) {
    sortTodos(array);
    array.map(element => renderTodosPage(element));
}

export function updatePage(element) {
    element.replaceChildren();
    element === categoriesHTML ? createCategoriesBtn() : renderTodos();
}

export function removeElement(li, element, array) {
    li.remove();
    array.splice(array.indexOf(element), 1);

    if (modal.classList.contains("edit")) {
        const todosWithCategory = todos.filter(todo => {
            return todo.category === element;
        });
        for (let i = 0; i < todosWithCategory.length; i++) {
            todos = todos.filter(item => {
                return item !== todosWithCategory[i];
            });
        }
        updatePage(ul);
        updatePage(categoriesHTML);
    }
}
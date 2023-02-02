import { addTodotoArray, todos, categories, addNewCategory } from "./app";
import { createDOMElement, createButton, createForm, printExistentInputs, updatePage } from "./helpers";
import { createRemoveBtn, ul, categoriesHTML } from "./pageDOM";

const body = document.querySelector("body");
export const modal = createDOMElement("div", "", "modal");
const overlay = createDOMElement("div", "", "overlay");

export function createTodoCard(newTodo) {
    modal.appendChild(createDOMElement("h2", `${newTodo.title}`));
    modal.appendChild(createDOMElement("p", `${newTodo.desc}`));
    modal.appendChild(createDOMElement("p", `Due Date: ${(newTodo.dueDate).toLocaleString().split(',')[0]}`));
    modal.appendChild(createDOMElement("p", `Priority: ${newTodo.priority}`));
    modal.appendChild(createDOMElement("p", `Category: ${newTodo.category}`));
    createEditBtn(newTodo);
}

export function openDialog(event) {
    event.preventDefault();
    createCloseBtn();
    body.appendChild(modal);
    body.appendChild(overlay);
}

export function closeDialog(event) {
    event.preventDefault();
    modal.classList.remove("add");
    modal.classList.remove("edit");
    modal.replaceChildren();
    body.removeChild(modal);
    body.removeChild(overlay);
}

function createCloseBtn() {
    const closeBtn = modal.appendChild(createButton("", "button", "close"));

    closeBtn.appendChild(createDOMElement("span", "Close", "visually-hidden"));
    closeBtn.addEventListener("click", event => { closeDialog(event) });
}

//Modal's buttons for todos

function createEditBtn(todo) {
    const editBtn = modal.appendChild(createButton("Edit Todo", "button", ""));
    editBtn.addEventListener("click", () => {
        modal.replaceChildren();
        createCloseBtn();
        createForm(todo);
        printExistentInputs(todo);
    });
}

export function createAddBtn(form) {
    const addTodoBtn = form.appendChild(createButton("Add Todo", "submit", ""));

    addTodoBtn.addEventListener("click", event => {
        event.preventDefault();
        addTodotoArray(title.value, desc.value, dueDate.value, priority.value, category.value);
        updatePage(ul);
        closeDialog(event);
    });
}

export function createSaveBtn(array, element, cat) {
    const saveBtn = createButton(modal.classList.contains("edit") ? "" : "Save", "submit", modal.classList.contains("edit") ? "save" : "");

    if (modal.classList.contains("edit")) {
        element.insertAdjacentElement("afterend", saveBtn);
        saveBtn.appendChild(createDOMElement("span", "Save category", "visually-hidden"));
    } else {
        element.appendChild(saveBtn);
    }

    saveBtn.addEventListener("click", event => {
        if (modal.classList.contains("edit")) {
            const oldCat = cat;

            const updatedCat = element.value;

            todos.map(todo => {
                if (todo.category === oldCat) {
                    todo.category = updatedCat;
                }
            });

            const indexCat = categories.indexOf(oldCat);
            categories.splice(indexCat, 1, updatedCat);

            modal.replaceChildren();
            openDialog(event);
            modal.classList.add("edit");
            showCategoriesModal();
            updatePage(categoriesHTML);
            updatePage(ul);
        } else {
            array.editTodo(title.value, desc.value, dueDate.value, priority.value, category.value);
            closeDialog(event);
            updatePage(ul);
        }
    });
    return saveBtn;
}

export function showCategoriesModal() {
    modal.appendChild(createDOMElement("h2", "Edit or delete categories"));
    const ul = modal.appendChild(document.createElement("ul"));

    categories.map(category => {
        const li = ul.appendChild(document.createElement("li"));
        const h3 = li.appendChild(createDOMElement("h3", `${category}`));
        h3.setAttribute("tabindex", "0");
        h3.setAttribute("type", "button");
        h3.addEventListener("click", event => {
            li.replaceChildren();
            li.classList.add("edit-category-modal");
            transformCatToInput(event, h3, li);
            const input = document.querySelector(`#${category}`);
            const saveBtn = createSaveBtn(categories, input, category);
            createUndoBtn(saveBtn);
        });
        createRemoveBtn(li, category);
    });
    const p = createDOMElement("p", "Deleting a category deletes all the todos associated with the category!");
    ul.insertAdjacentElement('afterend', p);
}

export function createNewCategoryBtn(form) {
    const addCatBtn = form.appendChild(createButton("Add Category", "submit", ""));

    addCatBtn.addEventListener("click", event => {
        event.preventDefault();
        addNewCategory(document.querySelector("#new-category").value);
        closeDialog(event);
        updatePage(categoriesHTML);
    });
}

function createUndoBtn(element) {
    const undoBtn = createButton("", "button", "");
    undoBtn.appendChild(createDOMElement("span", `Undo edit category`, "visually-hidden"));
    element.insertAdjacentElement("afterend", undoBtn);

    undoBtn.addEventListener("click", event => {
        modal.replaceChildren();
        openDialog(event);
        modal.classList.add("edit");
        showCategoriesModal();
    });
}

function transformCatToInput(event, h3, li) {
    const title = h3.textContent;
    event.target.remove();

    const label = createDOMElement("label", title, "visually-hidden",);
    label.setAttribute("for", title);
    const input = document.createElement("input");
    input.type = "text";
    input.setAttribute("id", title);
    input.value = title;

    li.appendChild(label);
    li.appendChild(input);
}
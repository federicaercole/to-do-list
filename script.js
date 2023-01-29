//validazione form e messaggi di conferma

let todos = [];
let filteredTodos = [];

class FormElements {
    constructor(element, textLabel, forLabel, input, type, id) {
        this.element = element;
        this.textLabel = textLabel;
        this.forLabel = forLabel;
        this.input = input;
        this.type = type;
        this.id = id;
    }
}

// class Buttons {
//     constructor(element, textButton, type) {
//         this.element = element;
//         this.textButton = textButton;
//         this.type = type;
//     }
// }

//DOM Stuff
const newTodobtn = document.querySelector(".new-todo");
const newCatbtn = document.querySelector(".new-category");
const todoContainer = document.querySelector(".todo-container");
const ul = document.querySelector(".todo-container ul");
const body = document.querySelector("body");
const modal = document.createElement("div");
modal.setAttribute("class", "modal");
const overlay = document.createElement("div");
overlay.setAttribute("class", "overlay");


const editCatBtn = document.querySelector(".edit-category");

editCatBtn.addEventListener("click", event => {
    openDialog(event);
    modal.classList.add("edit");
    printCategories();
});

function printCategories() {
    modal.appendChild(createCardElement("h2", "Edit or delete categories"));
    const ul = modal.appendChild(document.createElement("ul"));

    categories.map(category => {
        const li = ul.appendChild(document.createElement("li"));
        const h3 = li.appendChild(createCardElement("h3", `${category}`));
        h3.setAttribute("tabindex", "0");
        h3.setAttribute("type", "button");
        h3.addEventListener("click", event => {
            li.replaceChildren();
            li.classList.add("edit-category-modal");
            transformCatToInput(event, h3, li);
            const input = document.querySelector(`#${category}`);
            const saveBtn = createSaveBtn(categories, input, category);
            createDeleteActionBtn(saveBtn);
        });
        createRemoveBtn(li, category);
    });
    const p = createCardElement("p", "Deleting a category deletes all the todos associated with the category!");
    ul.insertAdjacentElement('afterend', p);
}

function transformCatToInput(event, h3, li) {
    const title = h3.textContent;
    event.target.remove();
    const label = createCardElement("label", title);
    label.setAttribute("class", "visually-hidden");
    label.setAttribute("for", title);
    const input = document.createElement("input", title);
    input.type = "text";
    input.id = title;
    input.value = title;
    li.appendChild(label);
    li.appendChild(input);
}

const categoriesHTML = document.querySelector(".categories");

newCatbtn.addEventListener("click", event => {
    openDialog(event);
    createFormCategory();
});

function createFormCategory() {
    modal.appendChild(createCardElement("h2", "Add a New Category"));

    const form = document.createElement("form");
    modal.appendChild(form);

    const newCat = new FormElements("label", "New Category", "new-category", "input", "text", "new-category");
    createFormElement(newCat, form);
    const label = document.querySelector("label");
    label.setAttribute("class", "visually-hidden");
    createNewCategoryBtn(form);

};

function createNewCategoryBtn(form) {
    const btnAddCat = form.appendChild(createCardElement("button", "Add Category"));
    btnAddCat.type = "submit";

    btnAddCat.addEventListener("click", event => {
        event.preventDefault();
        addNewCategory(document.querySelector("#new-category").value);
        closeDialog(event);
        categoriesHTML.replaceChildren();
        showCategories();
    });

}

function addNewCategory(cat) {
    categories.push(cat);
    return categories;
}

function showCategories() {
    const allProjects = categoriesHTML.appendChild(createCardElement("button", "All projects"));
    allProjects.type = "button";
    allProjects.classList.add("active");

    allProjects.addEventListener("click", () => {
        todoContainer.classList.remove("filtered");
        resetButtonStatus();
        allProjects.classList.add("active");
        ul.replaceChildren();
        showTodos();
    })

    categories.map(category => {
        const catBtn = categoriesHTML.appendChild(createCardElement("button", `${category}`));
        catBtn.type = "button";

        catBtn.addEventListener("click", event => {
            resetButtonStatus();
            filteredTodos = todos.filter(todo => {
                return todo.category === event.target.textContent;
            });
            ul.replaceChildren();
            todoContainer.classList.add("filtered");
            event.target.classList.add("active");
            showTodos();
        });
    });

}

function resetButtonStatus() {
    const buttons = document.querySelectorAll(".categories button");
    buttons.forEach(button => button.classList.remove("active"));
}

function createCardElement(el, content) {
    const element = document.createElement(el);
    element.textContent = content;
    return element;
}

function createTodoCard(newTodo) {
    modal.appendChild(createCardElement("h2", `${newTodo.title}`));
    modal.appendChild(createCardElement("p", `${newTodo.desc}`));
    modal.appendChild(createCardElement("p", `Due Date: ${newTodo.dueDate}`));
    modal.appendChild(createCardElement("p", `Priority: ${newTodo.priority}`));
    modal.appendChild(createCardElement("p", `Category: ${newTodo.category}`));
    createEditBtn(newTodo);
}

function todoHome(newTodo) {
    const li = document.createElement("li");
    ul.appendChild(li);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    li.appendChild(checkbox);

    checkbox.checked = newTodo.status;

    if (checkbox.checked === true) {
        li.setAttribute("class", "checked");
    }

    checkbox.addEventListener("change", (event) => {
        toggleTodo(newTodo, event, li);
        ul.replaceChildren();
        showTodos();
    });

    const priorityTag = li.appendChild(createCardElement("span", `${newTodo.priority}`));
    priorityTag.setAttribute("aria-label", "priority");

    priorityTag.classList.add("priority-tag");
    priorityTag.classList.add(newTodo.priority.toLowerCase());

    const h2 = li.appendChild(createCardElement("h2", `${newTodo.title}`));
    li.appendChild(createCardElement("span", `${newTodo.dueDate}`));
    createRemoveBtn(li, newTodo);
    h2.setAttribute("tabindex", "0");
    h2.setAttribute("type", "button");

    h2.setAttribute("aria-label", `See and edit ${newTodo.title}`);
    h2.addEventListener("click", event => { openDialog(event), createTodoCard(newTodo) });
}

function toggleTodo(todo) {
    todo.toggleStatus();
    if (todoContainer.classList.contains("filtered")) {
        filteredTodos.splice(filteredTodos.indexOf(todo), 1);
        if (todo.status) {
            filteredTodos.push(todo);
        } else {
            filteredTodos.unshift(todo);
        }
    } else {
        todos.splice(todos.indexOf(todo), 1);
        if (todo.status) {
            todos.push(todo);
        } else {
            todos.unshift(todo);
        }
    }
}

function sortTodos(array) {
    array.sort((a, b) => {
        if ((a.dueDate === b.dueDate) && a.status !== true && b.status !== true) {
            return 0;
        } else if ((a.dueDate > b.dueDate) && a.status !== true && b.status !== true) {
            return 1;
        } else {
            return -1;
        }
    })
}

function createDeleteActionBtn(element) {
    const btnDelete = createCardElement("button");
    btnDelete.type = "button";
    const span = createCardElement("span", `Don't edit category`);
    btnDelete.appendChild(span);
    span.classList.add("visually-hidden");
    element.insertAdjacentElement("afterend", btnDelete);

    btnDelete.addEventListener("click", event => {
        modal.replaceChildren();
        openDialog(event);
        modal.classList.add("edit");
        printCategories();
    });
}

function createRemoveBtn(li, element) {
    const btnRemove = createCardElement("button");
    btnRemove.type = "button";
    const span = createCardElement("span", `Delete ${element.title || element}`);
    btnRemove.appendChild(span);
    span.classList.add("visually-hidden");
    li.appendChild(btnRemove);
    btnRemove.addEventListener("click", function () {
        removeElement(li, element, modal.classList.contains("edit") ? categories : todos);
    });
}

function createEditBtn(todo) {
    const btnEdit = modal.appendChild(createCardElement("button", "Edit Todo"));
    btnEdit.addEventListener("click", () => {
        modal.replaceChildren();
        createCloseBtn();
        createForm(todo);
        printExistentInputs(todo);
    });
}
function printExistentInputs(todo) {
    title.value = todo.title;
    desc.value = todo.desc;
    date.value = todo.dueDate;
    priority.value = todo.priority;
    category.value = todo.category;
}

function createSaveBtn(array, element, cat) {
    const saveBtn = document.createElement("button");

    saveBtn.type = "submit";
    if (modal.classList.contains("edit")) {
        element.insertAdjacentElement("afterend", saveBtn);
        const span = saveBtn.appendChild(createCardElement("span", "Save category"));
        span.classList.add("visually-hidden");
        saveBtn.classList.add("save");
    } else {
        element.appendChild(saveBtn);
        saveBtn.textContent = "Save";
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
            printCategories();

            categoriesHTML.replaceChildren();
            showCategories();

            ul.replaceChildren();
            showTodos();
        } else {
            const date = document.querySelector("#date");
            array.editTodo(title.value, desc.value, date.value, priority.value, category.value);
            closeDialog(event);
            ul.replaceChildren();
            showTodos();
        }
    });
    return saveBtn;
}

function createCloseBtn() {
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.setAttribute("class", "close");
    modal.appendChild(closeBtn);

    const span = closeBtn.appendChild(createCardElement("span", "Close"));
    span.setAttribute("class", "visually-hidden");

    closeBtn.addEventListener("click", event => { closeDialog(event) });
}

function removeElement(li, element, array) {
    li.remove();
    array.splice(array.indexOf(element), 1);

    if (modal.classList.contains("edit")) {
        const todosWithCategory = todos.filter(todo => {
            return todo.category === element;
        });
        for (i = 0; i < todosWithCategory.length; i++) {
            todos = todos.filter(item => {
                return item !== todosWithCategory[i];
            });
        }
        ul.replaceChildren();
        showTodos();
        categoriesHTML.replaceChildren();
        showCategories();
    }
}

function showTodos() {
    if (todoContainer.classList.contains("filtered")) {
        sortTodos(filteredTodos);
        filteredTodos.map(element => todoHome(element));
    }
    else {
        sortTodos(todos);
        todos.map(element => todoHome(element));
    }
}

//Evento al bottone per scrivere una nuova nota
newTodobtn.addEventListener("click", event => {
    modal.classList.add("add");
    openDialog(event);
    createForm();
});

function openDialog(event) {
    event.preventDefault();
    createCloseBtn();
    body.appendChild(modal);
    body.appendChild(overlay);
}

function createForm(todo) {
    const h2 = document.createElement("h2");
    modal.appendChild(h2);

    const form = document.createElement("form");
    modal.appendChild(form);

    const title = new FormElements("label", "Todo Title", "title", "input", "text", "title");
    const desc = new FormElements("label", "Description", "desc", "textarea", "", "desc");
    const date = new FormElements("label", "Due Date", "date", "input", "date", "date");
    const priority = new FormElements("label", "Priority", "priority", "select", "", "priority");
    const category = new FormElements("label", "Category", "category", "select", "", "category");

    createFormElement(title, form);
    createFormElement(desc, form);
    createFormElement(date, form);
    createFormElement(priority, form);
    createFormElement(category, form);
    listToOption(priorites, "#priority");
    listToOption(categories, "#category");

    const dateField = document.querySelector("#date");
    dateField.addEventListener('input', function () {
        let date = dateField.valueAsDate;
        return date;
    });

    if (modal.classList.contains("add")) {
        h2.textContent = "Add a New Todo";
        createAddBtn(form);
    } else {
        h2.textContent = "Edit Todo";
        createSaveBtn(todo, form);
    }
}

function createFormElement(element, form) {
    const label = form.appendChild(createCardElement(`${element.element}`, `${element.textLabel}`));
    label.setAttribute("for", `${element.forLabel}`);

    const input = document.createElement(`${element.input}`);
    input.type = `${element.type}`;
    input.id = `${element.id}`;

    form.appendChild(input);
}

function createAddBtn(form) {
    const btnAddTodo = form.appendChild(createCardElement("button", "Add Todo"));
    btnAddTodo.type = "submit";

    btnAddTodo.addEventListener("click", event => {
        event.preventDefault();
        const date = document.querySelector("#date");
        const newTodo = addTodotoArray(title.value, desc.value, date.value, priority.value, category.value);
        todoHome(newTodo);

        ul.replaceChildren();

        showTodos();
        closeDialog(event);
    });
}

function closeDialog(event) {
    event.preventDefault();
    modal.classList.remove("add");
    modal.classList.remove("edit");
    modal.replaceChildren();
    body.removeChild(modal);
    body.removeChild(overlay);
}

//Struttura di un todo
class Todo {
    constructor(title, desc, dueDate, priority, category) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate || "No Due Date";
        this.priority = priority;
        this.category = category;
        this.status = false;
    }

    toggleStatus() {
        this.status = !this.status;
        return this.status;
    }

    editTodo(title, desc, dueDate, priority, category) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate || "No Due Date";
        this.priority = priority;
        this.category = category;
    }
}

let categories = ["Personal", "Work"]
const priorites = ["None", "Low", "Medium", "High"]

function addTodotoArray(title, desc, dueDate, priority, category) {
    const newTodo = new Todo(title, desc, dueDate, priority, category);
    todos.push(newTodo);
    return newTodo;
}

function listToOption(list, id) {
    list.map(element => {
        const option = document.createElement("option");
        const select = document.querySelector(`${id}`);
        option.textContent = `${element}`;
        option.value = `${element}`;
        select.appendChild(option);
    });
}
const date = new Date();
//Elemento di prova
addTodotoArray("Click on todo title to see it and edit it", "This is the description of the todo. Try to edit this todo clicking the 'Edit todo' button", `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, "High", "Personal");
addTodotoArray("Click on the X button to delete it", "If you delete a todo it is gone forever!", `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, "High", "Personal");
addTodotoArray("How to navigate the interface", "On the top of the page you have buttons to add a new todo, add a new category and edit categories. With the buttons in the next row you can filter your todos from different categories.", `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, "High", "Personal");
addTodotoArray("Click on the checkbox to mark a todo done", "Congratulations, you finished this tutorial!", `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, "High", "Personal");

showTodos();
showCategories();
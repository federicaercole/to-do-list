//filtra i todo per categorie
//Possibilità di editare un todo
//editare o cancellare categorie
//validazione form

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

class Buttons {
    constructor(element, textButton, type) {
        this.element = element;
        this.textButton = textButton;
        this.type = type;
    }

}

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
    createNewCategoryBtn(form);

};

function createNewCategoryBtn(form) {
    const btnAddCat = form.appendChild(createCardElement("button", "Add Category"));
    btnAddCat.type = "submit";

    btnAddCat.addEventListener("click", event => {
        event.preventDefault();
        addNewCategory(document.querySelector("#new-category").value);
    });

}

function addNewCategory(cat) {
    categories.push(cat);
    return categories;
}

function showCategories() {
    const categoriesHTML = document.querySelector(".categories");

    const allProjects = categoriesHTML.appendChild(createCardElement("button", "All projects"));
    allProjects.type = "button";

    allProjects.addEventListener("click", () => {
        todoContainer.classList.remove("filtered");
        ul.replaceChildren();
        showTodos();
    })

    categories.map(category => {
        const catBtn = categoriesHTML.appendChild(createCardElement("button", `${category}`));
        catBtn.type = "button";

        catBtn.addEventListener("click", event => {
            filteredTodos = todos.filter(todo => {
                return todo.category === event.target.textContent;
            });
            ul.replaceChildren();
            todoContainer.classList.add("filtered");
            showTodos();
        });
    });

}

function createCardElement(el, content) {
    const element = document.createElement(el);
    element.textContent = content;
    return element;
}

function createTodoCard(newTodo) {
    const article = document.createElement("article");
    todoContainer.appendChild(article);

    article.appendChild(createCardElement("h2", `${newTodo.title}`));
    article.appendChild(createCardElement("p", `${newTodo.desc}`));
    article.appendChild(createCardElement("p", `${newTodo.dueDate}`));
    article.appendChild(createCardElement("p", `${newTodo.priority}`));
    article.appendChild(createCardElement("p", `${newTodo.category}`));
    return article;
}

function todoHome(newTodo) {
    const li = document.createElement("li");
    ul.appendChild(li);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    li.appendChild(checkbox);

    checkbox.checked = newTodo.status;

    checkbox.addEventListener("change", () => {
        toggleTodo(newTodo);
        ul.replaceChildren();
        showTodos();
    });

    li.appendChild(createCardElement("span", `${newTodo.title}`));
    li.appendChild(createCardElement("span", `${newTodo.dueDate}`));
    createRemoveBtn(li, newTodo);
    createEditBtn(li);
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

function createRemoveBtn(li, todo) {
    const btnRemove = createCardElement("button", "Remove Todo");
    li.appendChild(btnRemove);
    btnRemove.addEventListener("click", function () { removeTodo(li, todo) });
}

function createEditBtn(li) {
    const btnEdit = createCardElement("button", "Edit Todo");
    li.appendChild(btnEdit);
    // btnEdit.addEventListener("click", function () { removeTodo(li, todo) });
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

function removeTodo(li, todo) {
    li.remove();
    todos.splice(todos.indexOf(todo), 1);
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
    openDialog(event);
    createForm();
});

function openDialog(event) {
    event.preventDefault();
    createCloseBtn();
    body.appendChild(modal);
    body.appendChild(overlay);
}

function createForm() {
    modal.appendChild(createCardElement("h2", "Add a New Todo"));

    const form = document.createElement("form");
    modal.appendChild(form);

    const title = new FormElements("label", "Todo Title", "title", "input", "text", "title");
    const desc = new FormElements("label", "Description", "desc", "input", "text", "desc");
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
    createAddBtn(form);
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
        const newTodo = addTodotoArray(title.value, desc.value, date.value, priority.value, category.value);
        todoHome(newTodo);

        ul.replaceChildren();

        showTodos();
    });
}

function closeDialog(event) {
    event.preventDefault();
    body.removeChild(modal);
    modal.innerHTML = "";
    body.removeChild(overlay);
}

//Struttura di un todo
class Todo {
    constructor(title, desc, dueDate, priority, category, status) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.category = category || "Personal";
        this.status = status || false;
    }

    toggleStatus() {
        this.status = !this.status;
        return this.status;
    }

    //funzione che tiene conto dello status fatto/non fatto
}
let categories = ["Personal", "Work"]
const priorites = ["No priority", "Low", "Medium", "High"]

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

//Elemento di prova
addTodotoArray("Prova", "descrizione", "2023-12-01", "alta", "Personal");
addTodotoArray("Prova3", "descrizione", "2023-10-25", "alta", "Work");
addTodotoArray("Prova3", "descrizione", "2023-10-23", "alta", "Work");
addTodotoArray("Prova5", "descrizione", "", "alta", "Personal");

showTodos();
showCategories();
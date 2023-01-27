//"aggiungi categoria" solo nella pagina, non nel singolo todo
//filtra i todo per categorie
//Possibilità di editare un todo
//Segnare un todo come fatto/non fatto
//Spostare todo fatto dietro a quelli da fare, se si toggla un todo già fatto in non fatto si sposta sotto quelli da fare (vedi app promemoria)
//Aprire finestra con un todo-->secondo me il modal bisognerebbe farlo interamente in javascript! modal per vedere dettagli e modal inserisci todo
//validazione form

let todos = [];

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

//DOM Stuff
const newTodobtn = document.querySelector(".new-todo");
const todoContainer = document.querySelector(".todo-container");
const ul = document.querySelector(".todo-container ul");
const body = document.querySelector("body");
const modal = document.createElement("div");
modal.setAttribute("class", "modal");
const overlay = document.createElement("div");
overlay.setAttribute("class", "overlay");

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

    li.appendChild(createCardElement("span", `${newTodo.title}`));
    li.appendChild(createCardElement("span", `${newTodo.dueDate}`));
    createRemoveBtn(li, newTodo);
    createEditBtn(li);

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
    li.remove(`li`);
    todos.splice(todos.indexOf(todo), 1);
}

function showTodos() {
    todos.map(element => todoHome(element));
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

function addNewCategory(cat) {
    categories.push(cat);
    return categories;
}

//Elemento di prova
addTodotoArray("Prova", "descrizione", "domani", "alta");

showTodos();
// showCategories();
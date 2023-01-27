//"aggiungi categoria" solo nella pagina, non nel singolo todo
//filtra i todo per categorie
//Possibilità di editare un todo
//Segnare un todo come fatto/non fatto
//Spostare todo fatto dietro a quelli da fare, se si toggla un todo già fatto in non fatto si sposta sotto quelli da fare (vedi app promemoria)
//Aprire finestra con un todo-->secondo me il modal bisognerebbe farlo interamente in javascript! modal per vedere dettagli e modal inserisci todo
//validazione form

let todos = [];


//DOM Stuff
const newTodobtn = document.querySelector(".new-todo");
const todoContainer = document.querySelector(".todo-container");
const ul = document.querySelector(".todo-container ul")
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close");
const btnAddTodo = document.querySelector(".add-todo");

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


}

function createRemoveBtn(li, todo) {
    const btnRemove = createCardElement("button", "Remove Todo");
    li.appendChild(btnRemove);
    btnRemove.addEventListener("click", function () { removeTodo(li, todo) });
}

function removeTodo(li, todo) {
    li.remove(`li`);
    todos.splice(todos.indexOf(todo), 1);
}

function showTodos() {
    todos.map(element => todoHome(element));
}

//Evento al bottone per scrivere una nuova nota
newTodobtn.addEventListener("click", openNewTodoDialog);

function openNewTodoDialog(event) {
    event.preventDefault();
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

btnCloseModal.addEventListener("click", closeTodoDialog);

function closeTodoDialog(event) {
    event.preventDefault();
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
}

btnAddTodo.addEventListener("click", event => {
    event.preventDefault();
    const newTodo = addTodotoArray(title.value, desc.value, date.value, priority.value, category.value);
    createTodoCard(newTodo);
});

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

function addTodotoArray(title, desc, dueDate, priority, category) {
    const newTodo = new Todo(title, desc, dueDate, priority, category);
    todos.push(newTodo);
    return newTodo;
}

function showCategories() {
    categories.map(element => {
        const option = document.createElement("option");
        const selectCategory = document.querySelector("#category");
        option.textContent = `${element}`;
        option.value = `${element}`;
        selectCategory.appendChild(option);
    })
}

function addNewCategory(cat) {
    categories.push(cat);
    return categories;
}

//Elemento di prova
addTodotoArray("Prova", "descrizione", "domani", "alta");

showTodos();
showCategories();
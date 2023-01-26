//DOM Stuff
let todos = [];
const newTodobtn = document.querySelector(".new-note");
const todoContainer = document.querySelector(".todo-container");

//Evento al bottone pr scrivere una nuova nota
//newTodobtn.addEventListener("click", openNewTodoDialog);

//Struttura di un todo
class Todo {
    constructor(title, desc, dueDate, priority) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        //this.list = list;
    }
}

//Helper function creare elementi delle carte
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
}

function addTodotoArray(title, desc, dueDate, priority) {
    const newTodo = new Todo(title, desc, dueDate, priority);
    todos.push(newTodo);
    return newTodo;
}

addTodotoArray("Prova", "descrizione", "domani", "alta");

function showTodos() {
    todos.map(element => createTodoCard(element));
}

showTodos();
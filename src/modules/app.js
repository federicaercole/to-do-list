import { todoContainer } from "./pageDOM";

export let todos = [];
export let filteredTodos = [];
export let categories = ["Personal", "Work"];
export const priorites = ["None", "Low", "Medium", "High"];
export class Todo {
    constructor(title, desc, dueDate, priority, category) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate ? new Date(dueDate) : "No Due Date";
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
        this.dueDate = dueDate ? new Date(dueDate) : "No Due Date";
        this.priority = priority;
        this.category = category;
    }
}

export function addTodotoArray(title, desc, dueDate, priority, category) {
    const newTodo = new Todo(title, desc, dueDate, priority, category);
    todos.push(newTodo);
    return newTodo;
}

export function sortTodos(array) {
    array.sort((a, b) => {
        if ((a.dueDate === b.dueDate) && a.status !== true && b.status !== true) {
            return 0;
        } else if ((a.dueDate > b.dueDate) && a.status !== true && b.status !== true) {
            return 1;
        } else {
            return -1;
        }
    });
    return array;
}

export function toggleTodo(todo, array = todoContainer.classList.contains("filtered") ? filteredTodos : todos) {
    todo.toggleStatus();
    array.splice(array.indexOf(todo), 1);
    if (todo.status) {
        array.push(todo);
    } else {
        array.unshift(todo);
    }
}

export function addNewCategory(cat) {
    categories.push(cat);
    return categories;
}

//Elementi di prova
const date = new Date();
addTodotoArray("Click on todo title to see it and edit it", "This is the description of the todo. Try to edit this todo clicking the 'Edit todo' button", date, "High", "Personal");
addTodotoArray("Click on the X button to delete it", "If you delete a todo it is gone forever!", date, "High", "Personal");
addTodotoArray("How to navigate the interface", "On the top of the page you have buttons to add a new todo, add a new category and edit categories. With the buttons in the next row you can filter your todos from different categories.", date, "High", "Personal");
addTodotoArray("Click on the checkbox to mark a todo done", "Congratulations, you finished this tutorial!", date, "High", "Personal");
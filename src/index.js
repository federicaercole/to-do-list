//validazione form e messaggi di conferma

const categoriesHTML = document.querySelector(".categories");

const todoApp = (function () {
    let todos = [];
    let filteredTodos = [];
    let categories = ["Personal", "Work"];
    const priorites = ["None", "Low", "Medium", "High"];
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

    function addTodotoArray(title, desc, dueDate, priority, category) {
        const newTodo = new Todo(title, desc, dueDate, priority, category);
        todos.push(newTodo);
        return newTodo;
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
        });
        return array;
    }

    function toggleTodo(todo, array = pageDOM.todoContainer.classList.contains("filtered") ? filteredTodos : todos) {
        todo.toggleStatus();
        array.splice(array.indexOf(todo), 1);
        if (todo.status) {
            array.push(todo);
        } else {
            array.unshift(todo);
        }
    }

    function addNewCategory(cat) {
        categories.push(cat);
        return categories;
    }

    //Elementi di prova
    const date = new Date();
    addTodotoArray("Click on todo title to see it and edit it", "This is the description of the todo. Try to edit this todo clicking the 'Edit todo' button", `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, "High", "Personal");
    addTodotoArray("Click on the X button to delete it", "If you delete a todo it is gone forever!", `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, "High", "Personal");
    addTodotoArray("How to navigate the interface", "On the top of the page you have buttons to add a new todo, add a new category and edit categories. With the buttons in the next row you can filter your todos from different categories.", `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, "High", "Personal");
    addTodotoArray("Click on the checkbox to mark a todo done", "Congratulations, you finished this tutorial!", `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, "High", "Personal");

    return { todos, filteredTodos, categories, priorites, addTodotoArray, Todo, toggleTodo, addNewCategory, sortTodos }
})();

const helperFunctions = (function () {
    function createDOMElement(el, content, elClass) {
        const element = document.createElement(el);
        element.textContent = content;
        element.classList.add(elClass);
        return element;
    }

    function createFormElement(textLabel, id, labelClass, inputEl, inputType, form) {
        const label = form.appendChild(createDOMElement("label", textLabel));
        label.setAttribute("for", id);
        label.setAttribute("class", labelClass);

        const input = document.createElement(inputEl);
        input.type = inputType;
        input.id = id;

        form.appendChild(input);
    }

    function createFormAddCategory() {
        modalDOM.modal.appendChild(createDOMElement("h2", "Add a New Category"));

        const form = modalDOM.modal.appendChild(document.createElement("form"));

        createFormElement("New Category", "new-category", "visually-hidden", "input", "text", form);
        modalDOM.createNewCategoryBtn(form);
    };

    function createForm(todo) {
        modalDOM.modal.appendChild(createDOMElement("h2", modalDOM.modal.classList.contains("add") ? "Add a New Todo" : "Edit Todo"));

        const form = modalDOM.modal.appendChild(createDOMElement("form"));

        createFormElement("Todo Title", "title", "", "input", "text", form);
        createFormElement("Description", "desc", "", "textarea", "", form);
        createFormElement("Due Date", "dueDate", "", "input", "date", form);
        createFormElement("Priority", "priority", "", "select", "", form);
        createFormElement("Category", "category", "", "select", "", form);

        listToOption(todoApp.priorites, "#priority");
        listToOption(todoApp.categories, "#category");

        const date = document.querySelector("#dueDate");
        date.addEventListener("input", function () {
            return date.valueAsDate;
        });

        modalDOM.modal.classList.contains("add") ? modalDOM.createAddBtn(form) : modalDOM.createSaveBtn(todo, form);
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

    function printExistentInputs(todo) {
        title.value = todo.title;
        desc.value = todo.desc;
        dueDate.value = todo.dueDate;
        priority.value = todo.priority;
        category.value = todo.category;
    }

    function createButton(textButton, type, btnClass) {
        const button = document.createElement("button");
        button.textContent = textButton;
        button.type = type;
        button.setAttribute("class", btnClass);
        return button;
    }

    function renderTodos(array = pageDOM.todoContainer.classList.contains("filtered") ? todoApp.filteredTodos : todoApp.todos) {
        todoApp.sortTodos(array);
        array.map(element => pageDOM.renderTodosPage(element));
    }

    function updatePage(element) {
        element.replaceChildren();
        element === categoriesHTML ? pageDOM.createCategoriesBtn() : renderTodos();
    }

    function removeElement(li, element, array) {
        li.remove();
        array.splice(array.indexOf(element), 1);

        if (modalDOM.modal.classList.contains("edit")) {
            const todosWithCategory = todoApp.todos.filter(todo => {
                return todo.category === element;
            });
            for (i = 0; i < todosWithCategory.length; i++) {
                todoApp.todos = todoApp.todos.filter(item => {
                    return item !== todosWithCategory[i];
                });
            }
            helperFunctions.updatePage(pageDOM.ul);
            helperFunctions.updatePage(categoriesHTML);
        }
    }

    return { createDOMElement, createFormElement, createFormAddCategory, createForm, printExistentInputs, createButton, renderTodos, updatePage, removeElement }
})();

const modalDOM = (function () {
    const body = document.querySelector("body");
    const modal = helperFunctions.createDOMElement("div", "", "modal");
    const overlay = helperFunctions.createDOMElement("div", "", "overlay");

    function createTodoCard(newTodo) {
        modal.appendChild(helperFunctions.createDOMElement("h2", `${newTodo.title}`));
        modal.appendChild(helperFunctions.createDOMElement("p", `${newTodo.desc}`));
        modal.appendChild(helperFunctions.createDOMElement("p", `Due Date: ${newTodo.dueDate}`));
        modal.appendChild(helperFunctions.createDOMElement("p", `Priority: ${newTodo.priority}`));
        modal.appendChild(helperFunctions.createDOMElement("p", `Category: ${newTodo.category}`));
        createEditBtn(newTodo);
    }

    function openDialog(event) {
        event.preventDefault();
        createCloseBtn();
        body.appendChild(modal);
        body.appendChild(overlay);
    }

    function closeDialog(event) {
        event.preventDefault();
        modal.classList.remove("add");
        modal.classList.remove("edit");
        modal.replaceChildren();
        body.removeChild(modal);
        body.removeChild(overlay);
    }

    function createCloseBtn() {
        const closeBtn = modal.appendChild(helperFunctions.createButton("", "button", "close"));

        closeBtn.appendChild(helperFunctions.createDOMElement("span", "Close", "visually-hidden"));
        closeBtn.addEventListener("click", event => { closeDialog(event) });
    }

    //Modal's buttons for todos

    function createEditBtn(todo) {
        const editBtn = modal.appendChild(helperFunctions.createButton("Edit Todo", "button", ""));
        editBtn.addEventListener("click", () => {
            modal.replaceChildren();
            createCloseBtn();
            helperFunctions.createForm(todo);
            helperFunctions.printExistentInputs(todo);
        });
    }

    function createAddBtn(form) {
        const addTodoBtn = form.appendChild(helperFunctions.createButton("Add Todo", "submit", ""));

        addTodoBtn.addEventListener("click", event => {
            event.preventDefault();
            todoApp.addTodotoArray(title.value, desc.value, dueDate.value, priority.value, category.value);
            helperFunctions.updatePage(pageDOM.ul);
            closeDialog(event);
        });
    }

    function createSaveBtn(array, element, cat) {
        const saveBtn = helperFunctions.createButton(modal.classList.contains("edit") ? "" : "Save", "submit", modal.classList.contains("edit") ? "save" : "");

        if (modal.classList.contains("edit")) {
            element.insertAdjacentElement("afterend", saveBtn);
            saveBtn.appendChild(helperFunctions.createDOMElement("span", "Save category", "visually-hidden"));
        } else {
            element.appendChild(saveBtn);
        }

        saveBtn.addEventListener("click", event => {
            if (modal.classList.contains("edit")) {
                const oldCat = cat;

                const updatedCat = element.value;

                todoApp.todos.map(todo => {
                    if (todo.category === oldCat) {
                        todo.category = updatedCat;
                    }
                });

                const indexCat = todoApp.categories.indexOf(oldCat);
                todoApp.categories.splice(indexCat, 1, updatedCat);

                modal.replaceChildren();
                openDialog(event);
                modal.classList.add("edit");
                showCategoriesModal();
                helperFunctions.updatePage(categoriesHTML);
                helperFunctions.updatePage(pageDOM.ul);
            } else {
                array.editTodo(title.value, desc.value, dueDate.value, priority.value, category.value);
                closeDialog(event);
                helperFunctions.updatePage(pageDOM.ul);
            }
        });
        return saveBtn;
    }

    function showCategoriesModal() {
        modal.appendChild(helperFunctions.createDOMElement("h2", "Edit or delete categories"));
        const ul = modal.appendChild(document.createElement("ul"));

        todoApp.categories.map(category => {
            const li = ul.appendChild(document.createElement("li"));
            const h3 = li.appendChild(helperFunctions.createDOMElement("h3", `${category}`));
            h3.setAttribute("tabindex", "0");
            h3.setAttribute("type", "button");
            h3.addEventListener("click", event => {
                li.replaceChildren();
                li.classList.add("edit-category-modal");
                transformCatToInput(event, h3, li);
                const input = document.querySelector(`#${category}`);
                const saveBtn = createSaveBtn(todoApp.categories, input, category);
                createUndoBtn(saveBtn);
            });
            pageDOM.createRemoveBtn(li, category);
        });
        const p = helperFunctions.createDOMElement("p", "Deleting a category deletes all the todos associated with the category!");
        ul.insertAdjacentElement('afterend', p);
    }

    function createNewCategoryBtn(form) {
        const addCatBtn = form.appendChild(helperFunctions.createButton("Add Category", "submit", ""));

        addCatBtn.addEventListener("click", event => {
            event.preventDefault();
            todoApp.addNewCategory(document.querySelector("#new-category").value);
            modalDOM.closeDialog(event);
            helperFunctions.updatePage(categoriesHTML);
        });
    }

    function createUndoBtn(element) {
        const undoBtn = helperFunctions.createButton("", "button", "");
        undoBtn.appendChild(helperFunctions.createDOMElement("span", `Undo edit category`, "visually-hidden"));
        element.insertAdjacentElement("afterend", undoBtn);

        undoBtn.addEventListener("click", event => {
            modal.replaceChildren();
            modalDOM.openDialog(event);
            modal.classList.add("edit");
            showCategoriesModal();
        });
    }

    function transformCatToInput(event, h3, li) {
        const title = h3.textContent;
        event.target.remove();

        const label = helperFunctions.createDOMElement("label", title, "visually-hidden",);
        label.setAttribute("for", title);
        const input = document.createElement("input");
        input.type = "text";
        input.setAttribute("id", title);
        input.value = title;

        li.appendChild(label);
        li.appendChild(input);
    }

    return { modal, openDialog, closeDialog, createTodoCard, createAddBtn, createSaveBtn, createNewCategoryBtn, showCategoriesModal };
})();

const pageDOM = (function () {
    const newTodobtn = document.querySelector(".new-todo");
    const newCatbtn = document.querySelector(".new-category");
    const todoContainer = document.querySelector(".todo-container");
    const ul = document.querySelector(".todo-container ul");
    const editCatBtn = document.querySelector(".edit-category");

    function resetActiveState() {
        const buttons = document.querySelectorAll(".categories button");
        buttons.forEach(button => button.classList.remove("active"));
    }

    function createCategoriesBtn() {
        const allProjects = categoriesHTML.appendChild(helperFunctions.createButton("All projects", "button", "active"));

        allProjects.addEventListener("click", () => {
            todoContainer.classList.remove("filtered");
            resetActiveState();
            allProjects.classList.add("active");
            helperFunctions.updatePage(ul);
        })

        todoApp.categories.map(category => {
            const catBtn = categoriesHTML.appendChild(helperFunctions.createButton(`${category}`, "button", ""));

            catBtn.addEventListener("click", event => {
                todoApp.filteredTodos = todoApp.todos.filter(todo => {
                    return todo.category === event.target.textContent;
                });
                resetActiveState();
                todoContainer.classList.add("filtered");
                event.target.classList.add("active");
                helperFunctions.updatePage(ul);
            });
        });

    }

    function renderTodosPage(newTodo) {
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
            todoApp.toggleTodo(newTodo);
            helperFunctions.updatePage(ul);
        });

        const priorityTag = li.appendChild(helperFunctions.createDOMElement("span", `${newTodo.priority}`, "priority-tag"));
        priorityTag.setAttribute("aria-label", "priority");
        priorityTag.classList.add(newTodo.priority.toLowerCase());

        const h2 = li.appendChild(helperFunctions.createDOMElement("h2", `${newTodo.title}`));
        h2.setAttribute("tabindex", "0");
        h2.setAttribute("type", "button");
        h2.setAttribute("aria-label", `See and edit ${newTodo.title}`);

        li.appendChild(helperFunctions.createDOMElement("span", `${newTodo.dueDate}`));
        createRemoveBtn(li, newTodo);

        h2.addEventListener("click", event => { modalDOM.openDialog(event), modalDOM.createTodoCard(newTodo) });
    }

    //Buttons on page
    newTodobtn.addEventListener("click", event => {
        modalDOM.modal.classList.add("add");
        modalDOM.openDialog(event);
        helperFunctions.createForm();
    });

    newCatbtn.addEventListener("click", event => {
        modalDOM.openDialog(event);
        helperFunctions.createFormAddCategory();
    });

    editCatBtn.addEventListener("click", event => {
        modalDOM.openDialog(event);
        modalDOM.modal.classList.add("edit");
        modalDOM.showCategoriesModal();
    });

    function createRemoveBtn(li, element) {
        const removeBtn = li.appendChild(helperFunctions.createButton("", "button", ""));
        removeBtn.appendChild(helperFunctions.createDOMElement("span", `Delete ${element.title || element}`, "visually-hidden"));

        removeBtn.addEventListener("click", function () {
            helperFunctions.removeElement(li, element, modalDOM.modal.classList.contains("edit") ? todoApp.categories : todoApp.todos);
        });
    }

    return { todoContainer, renderTodosPage, createCategoriesBtn, createRemoveBtn, ul };

})();

helperFunctions.renderTodos();
pageDOM.createCategoriesBtn();
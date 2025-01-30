class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.filter = 'all';
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Form submission for new todos
        document.getElementById('todo-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('todo-input');
            const text = input.value.trim();
            if (text) {
                this.addTodo(text);
                input.value = '';
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.filter-btn.active').classList.remove('active');
                btn.classList.add('active');
                this.filter = btn.dataset.filter;
                this.render();
            });
        });

        // Clear completed
        document.getElementById('clear-completed').addEventListener('click', () => {
            this.clearCompleted();
        });
    }

    addTodo(text) {
        this.todos.push({
            id: Date.now(),
            text,
            completed: false
        });
        this.saveTodos();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    getFilteredTodos() {
        switch (this.filter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const todoList = document.getElementById('todo-list');
        const filteredTodos = this.getFilteredTodos();
        
        // Clear current list
        todoList.innerHTML = '';
        
        // Render todos
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            
            const span = document.createElement('span');
            span.textContent = todo.text;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });

        // Update items left count
        const activeCount = this.todos.filter(t => !t.completed).length;
        document.getElementById('items-left').textContent = 
            `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    }
}

// Initialize the app
new TodoApp();

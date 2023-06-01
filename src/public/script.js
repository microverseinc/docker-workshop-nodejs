const todoForm = document.getElementById("todo-form")
const todoInput = document.getElementById("todo-input")
const todoList = document.getElementById("todo-list")

function renderTodos(todos) {
  todoList.innerHTML = ""

  todos.forEach((todo) => {
    const listItem = document.createElement("li")
    if (todo.completed) {
      listItem.classList.add(`item${todo.id}`)
    }

    const div = document.createElement("div")
    div.classList.add("title")
    div.classList.add(todo.isCompleted ? "completed" : "not-completed")
    div.textContent = `${todo.title}`
    div.addEventListener("click", async function toggleCompleted() {
      try {
        const response = await fetch(`/tasks/${todo.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: todo.title,
            isCompleted: !todo.isCompleted,
          }),
        })

        if (response.ok) {
          const todos = await response.json()
          renderTodos(todos)
        }
      } catch (error) {
        console.error(error)
      }
    })

    const span = document.createElement("span")
    span.classList.add("delete")
    span.textContent = "❌"
    span.addEventListener("click", async function deleteTodo() {
      try {
        const response = await fetch(`/tasks/${todo.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          const todos = await response.json()
          renderTodos(todos)
        }
      } catch (error) {
        console.error(error)
      }
    })

    listItem.appendChild(div)
    listItem.appendChild(span)

    todoList.appendChild(listItem)
  })
}

async function fetchTodos() {
  try {
    const response = await fetch("/tasks")
    const todos = await response.json()
    renderTodos(todos)
  } catch (error) {
    console.error(error)
  }
}

async function createTodo() {
  const title = todoInput.value.trim()
  if (title === "") return

  try {
    const response = await fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, isCompleted: false }),
    })

    if (response.ok) {
      const todos = await response.json()

      renderTodos(todos)
      todoInput.value = ""
    }
  } catch (error) {
    console.error(error)
  }
}

async function toggleCompleted(id, isCompleted) {
  try {
    const response = await fetch(`/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !isCompleted }),
    })

    if (response.ok) {
      const todo = await response.json()
      const listItem = document.querySelector(`.title${id}`)
    }
  } catch (error) {
    console.error(error)
  }
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault()
  createTodo()
})

fetchTodos()

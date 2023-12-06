const tasksBlock = document.querySelector(".bottomBlock")
const todoTitleInput = document.querySelector(".todoTitleInput")
const todoDescInput = document.querySelector(".todoDescInput")
const topBlockForm = document.querySelector(".topBlockForm")
const editModal = document.querySelector(".editModalWindow")
const editModalTitleInput = document.querySelector(".editModalTitleInput")
const editModalDescInput = document.querySelector(".editModalDescInput")
const editModalForm = document.querySelector(".editModalWindowForm")
const editModalCloseBtn = document.querySelector(".editModalCloseBtn")
const logoutBtn = document.querySelector(".logoutBtn")
const wrapper = document.querySelector(".wrapper")
const headerUsername = document.querySelector(".headerUsername")


const allBtn = document.querySelector(".all")
const completedBtn = document.querySelector(".completed")
const uncompletedBtn = document.querySelector(".uncompleted")
const allFilterButtons = document.querySelectorAll(".filterButton")

// Get a user id from the local storage
const userId = JSON.parse(localStorage.getItem("user"))?.id

// Redirect to login page if not logged in
window.onload = () => {
    if (userId) {
        headerUsername.innerHTML = JSON.parse(localStorage.getItem("user"))?.username
    }
    setTimeout(() => {
        if (!userId) {
            window.location.replace("../pages/loginPage.html")
        }
    }, 1)
}

//  Fetch the data from a data base
const fetchData = async () => {
    try {
        const response = await fetch(`https://656b57f0dac3630cf728038c.mockapi.io/todo/users/${userId}/todotasks`)
        const data = await response.json()

        // Client side error handler
        if (response.status >= 400 && response.status <= 499) {
            return "error"
        }
        // If there is at least a single task
        if (data.length > 0) {
            return data
        }
        // If there are no tasks
        else if (data.length === 0) {
            return false
        }

    } catch (e) {
        return "error"
    }
}

// Filter the tasks
const getFilteredTasks = async (completed) => {
    try {
        const response = await fetch(`https://656b57f0dac3630cf728038c.mockapi.io/todo/users/${userId}/todotasks?completed=${completed}`)
        return await response.json()

    } catch (e) {
        console.log(e)
    }
}

// Pop the "No tasks" message
const popNoTasksMessage = () => {
    const noTasks = document.createElement("p")
    noTasks.setAttribute("class", "noTasksMessage")
    noTasks.innerHTML = "No tasks..."
    tasksBlock.append(noTasks)
}

// Change the appearance of the filter buttons
const changeActiveBtn = (index) => {
    allFilterButtons.forEach(btn => {
        btn.style.backgroundColor = "#2f2f2f"
        btn.style.color = "#ffffff"
    })
    allFilterButtons[index].style.backgroundColor = "#FF8A56"
    allFilterButtons[index].style.color = "#000000"
}

// Show the completed tasks
completedBtn.onclick = async () => {
    const tasks = await getFilteredTasks(true)
    tasksBlock.innerHTML = null
    await tasks.forEach(task => createElements(task))
    changeActiveBtn(1)
    if (tasksBlock.children.length === 0) {
        popNoTasksMessage()
    }
}

// Show all tasks
allBtn.onclick = async () => {
    const tasks = await getFilteredTasks("")
    tasksBlock.innerHTML = null
    await tasks.forEach(task => createElements(task))
    changeActiveBtn(0)
    if (tasksBlock.children.length === 0) {
        popNoTasksMessage()
    }
}

// Show uncompleted tasks
uncompletedBtn.onclick = async () => {
    const tasks = await getFilteredTasks(false)
    tasksBlock.innerHTML = null
    await tasks.forEach(task => createElements(task))
    changeActiveBtn(2)
    if (tasksBlock.children.length === 0) {
        popNoTasksMessage()
    }
}

// Remove task
const deleteTask = async (id) => {
    try {
        const response = await fetch(`https://656b57f0dac3630cf728038c.mockapi.io/todo/users/${userId}/todotasks/${id}`, {method: "DELETE"})
        console.log(response)
    } catch (e) {
        console.log(e)
    }

}

// Check or uncheck a task
const checkTask = async (id, completed) => {
    const options = {
        method: "PUT",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({completed})
    }

    try {
        const response = await fetch(`https://656b57f0dac3630cf728038c.mockapi.io/todo/users/${userId}/todotasks/${id}`, options)
        console.log(response)
    } catch (e) {
        console.log(e)
    }

}

// Edit task
const editTask = async (id, title, desc) => {
    const options = {
        method: "PUT",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({title, description: desc})
    }

    try {
        const response = await fetch(`https://656b57f0dac3630cf728038c.mockapi.io/todo/users/${userId}/todotasks/${id}`, options)
        return await response.json()
    } catch (e) {
        console.log(e)
    }

}

// Post a new task
const postTask = async (title, desc) => {
    const options = {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({title, description: desc, completed: false})
    }

    try {
        const response = await fetch(`https://656b57f0dac3630cf728038c.mockapi.io/todo/users/${userId}/todotasks/`, options)
        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

// Create new tags for the new tasks
const createElements = (task) => {

    // If there is a "No tasks" message, remove it
    const noTasks = document.querySelector(".noTasksMessage")
    if (noTasks) noTasks.remove()

    // Creating the tags
    const div = document.createElement("div")
    div.classList.add("taskBlock")

    const taskTitleDescCheckbox = document.createElement("div")
    taskTitleDescCheckbox.classList.add("taskTitleDescCheckbox")

    const taskTitleDesc = document.createElement("div")
    taskTitleDesc.classList.add("taskTitleDesc")

    const taskBlockLine = document.createElement("div")
    taskBlockLine.classList.add("taskBlockLine")

    const taskButtons = document.createElement("div")
    taskButtons.classList.add("taskButtons")

    const checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    checkbox.setAttribute("class", "taskCheckbox")
    checkbox.checked = task.completed
    checkbox.onclick = async (e) => {
        const check = e.target.checked
        await checkTask(task.id, check)
    }

    const title = document.createElement("h2")
    title.classList.add("taskTitle")

    // Fancy title appearing animation
    const titleToPrint = task.title.split("")
    const intervalTitle = setInterval(() => {
        title.innerHTML = title.innerHTML + titleToPrint.shift()
        if (titleToPrint.length < 1) {
            clearInterval(intervalTitle)
        }
    }, 7)


    const desc = document.createElement("p")
    desc.classList.add("taskDesc")

    // Fancy description appearing animation
    const descToPrint = task.description.split("")
    const intervalDesc = setInterval(() => {
        desc.innerHTML = desc.innerHTML + descToPrint.shift()

        if (descToPrint.length < 1) {
            clearInterval(intervalDesc)
        }
    }, 5)

    const editBtn = document.createElement("button")
    editBtn.classList.add("taskEdit")
    editBtn.innerHTML = "EDIT"
    editBtn.onclick = async () => {
        // Showing a modal window
        editModal.classList.remove("hide")
        wrapper.style.filter = "blur(2px)"
        // Submitting the edited tasks
        editModalForm.onsubmit = async (e) => {
            e.preventDefault()
            const editedTask = await editTask(task.id, editModalTitleInput.value, editModalDescInput.value)
            title.innerHTML = editedTask.title
            desc.innerHTML = editedTask.description
            editModalTitleInput.value = ""
            editModalDescInput.value = ""
            editModal.classList.add("hide")
            wrapper.style.filter = "none"
        }
    }

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("taskDelete")
    deleteBtn.innerHTML = "DELETE"
    deleteBtn.onclick = async () => {
        await deleteTask(task.id)
        await div.remove()
        // Showing the "No tasks" message if there are no tasks
        if (tasksBlock.children.length === 0) {
            popNoTasksMessage()
        }
    }

    // Appending all tags into main block
    taskTitleDesc.append(title, desc)
    taskTitleDescCheckbox.append(checkbox, taskTitleDesc)
    taskButtons.append(editBtn, deleteBtn)
    div.append(taskTitleDescCheckbox, taskBlockLine, taskButtons)
    tasksBlock.insertBefore(div, tasksBlock.firstChild)


}

// Post a new task
topBlockForm.onsubmit = async (e) => {
    e.preventDefault()
    const title = todoTitleInput.value
    const desc = todoDescInput.value
    const task = await postTask(title, desc)
    todoTitleInput.value = ""
    todoDescInput.value = ""
    createElements(task)

}

// Create tasks
const createTasks = async () => {
    const tasks = await fetchData()
    if (typeof tasks === "object") {
        tasks.forEach(task => {
            createElements(task)
        })
    } else if (tasks === "error") {
        const error = document.createElement("p")
        error.setAttribute("class", "noTasksMessage")
        error.innerHTML = "Error..."
        tasksBlock.append(error)
    } else if (!tasks) {
        popNoTasksMessage()
    }
}

// Modal close button
editModalCloseBtn.onclick = () => {
    wrapper.style.filter = "none"
    editModal.classList.add("hide")
    editModalTitleInput.value = ""
    editModalDescInput.value = ""
}

// Logout button
logoutBtn.onclick = () => {
    localStorage.removeItem("user");
    window.location.replace("../index.html")
}

// Creating the tasks when loaded
createTasks().then()


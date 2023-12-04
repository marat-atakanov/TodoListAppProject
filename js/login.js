const loginForm = document.querySelector(".loginForm")
const loginEmailInput = document.querySelector(".loginEmailInput")
const loginPasswordInput = document.querySelector(".loginPasswordInput")
const errorMessage = document.querySelector(".errorMessage")

const userId = JSON.parse(localStorage.getItem("user"))?.id

window.onload = () => {
    if (userId) {
        window.location.replace("../pages/todoListPage.html")
    }
}

const fetchAllUsers = async () => {
    try {
        const response = await fetch("https://656b57f0dac3630cf728038c.mockapi.io/todo/users")
        const users = await response.json()
        return users.find(item => item.email === loginEmailInput.value && item.password === loginPasswordInput.value)

    } catch (e) {
        console.log(e)
    }
}

loginForm.onsubmit = async (e) => {
    e.preventDefault()
    const user = await fetchAllUsers()
    if (user) {
        localStorage.setItem("user", JSON.stringify(user))
        window.location.replace("../pages/todoListPage.html")
    } else {
        errorMessage.innerHTML = "Invalid login or password"
    }
}

loginEmailInput.oninput = () => {
    errorMessage.innerHTML = ""
}

loginPasswordInput.oninput = () => {
    errorMessage.innerHTML = ""
}
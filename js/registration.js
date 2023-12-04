const regForm = document.querySelector(".regForm")
const regEmailInput = document.querySelector(".regEmailInput")
const regUsernameInput = document.querySelector(".regUsernameInput")
const regPasswordInput = document.querySelector(".regPasswordInput")
const regConfirmPasswordInput = document.querySelector(".regConfirmPasswordInput")
const errorMessage = document.querySelector(".errorMessage")

const userId = JSON.parse(localStorage.getItem("user"))?.id

window.onload = () => {
    if (userId) {
        window.location.replace("/TodoProject/pages/todoListPage.html")
    }
}

const registerUser = async (email, username, password) => {
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            email, username, password
        })
    }

    try {
        const response = await fetch("https://656b57f0dac3630cf728038c.mockapi.io/todo/users", options)
        const userData = await response.json()
        if (response.status >= 200 && response.status <= 299) {
            localStorage.setItem("user", JSON.stringify(userData))
            window.location.replace("../pages/todoListPage.html")
        }
    } catch (e) {
        console.log(e)
    }
}

regForm.onsubmit = (e) => {
    e.preventDefault()
    if (regPasswordInput.value === regConfirmPasswordInput.value) {
        registerUser(regEmailInput.value, regUsernameInput.value, regPasswordInput.value).then()
    } else {
        errorMessage.innerHTML = "Passwords must match!"
    }
}

regPasswordInput.oninput = () => {
    errorMessage.innerHTML = ""
}

regConfirmPasswordInput.oninput = () => {
    errorMessage.innerHTML = ""
}
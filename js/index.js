const getStartedBtn = document.querySelector(".getStartedBtn")
const headerLoggedIn = document.querySelector(".headerLoggedIn")
const headerLoggedOut = document.querySelector(".headerLoggedOut")
const logoutBtn = document.querySelector(".logoutBtn")
const headerUsername = document.querySelector(".headerUsername")

const userId = JSON.parse(localStorage.getItem("user"))?.id

window.onload = () => {
    if (userId) {
        headerLoggedIn.classList.remove("hide")
        headerLoggedOut.classList.add("hide")
        headerUsername.innerHTML = JSON.parse(localStorage.getItem("user"))?.username
    }
}

getStartedBtn.onclick = () => {
    if (userId) {
        window.location.href = "pages/todoListPage.html"
    } else {
        window.location.href = "pages/loginPage.html"
    }
}

logoutBtn.onclick = () => {
    localStorage.removeItem("user");
    window.location.reload()
}
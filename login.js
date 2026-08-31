document.addEventListener("DOMContentLoaded", function () {

    const loginForm =
        document.getElementById("loginForm");

    const username =
        document.getElementById("username");

    const password =
        document.getElementById("password");

    const loginMessage =
        document.getElementById("loginMessage");

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (
            username.value === "admin" &&
            password.value === "1234"
        ) {

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            window.location.href = "index.html";

        } else {

            loginMessage.textContent =
                "Invalid username or password.";

        }

    });

});
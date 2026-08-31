document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("isLoggedIn") !== "true") {

        window.location.href = "login.html";

        return;
    }


    const logoutBtn =
        document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            localStorage.removeItem("isLoggedIn");

            window.location.href = "login.html";

        });

    }

});
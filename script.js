// ======================================================
// LOGOUT + MOBILE / BROWSER BACK BUTTON PROTECTION
// ======================================================


// ======================================================
// FORCE LOGIN PAGE AFTER LOGOUT
// ======================================================

function forceLoginPage() {

    const user =
        localStorage.getItem("userName");

    const role =
        localStorage.getItem("userRole");


    // If user is logged out
    if (!user || !role) {

        // Replace current history entry
        window.history.replaceState(
            null,
            "",
            "index.html"
        );

        // Go to login page
        window.location.replace(
            "index.html"
        );
    }
}


// ======================================================
// LOGOUT
// ======================================================

function logoutUser() {

    // ----------------------------------------------
    // CLEAR ALL LOGIN DATA
    // ----------------------------------------------

    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("loginId");


    // ----------------------------------------------
    // PREVENT OLD PAGE FROM BEING RESTORED
    // ----------------------------------------------

    sessionStorage.setItem(
        "loggedOut",
        "true"
    );


    // ----------------------------------------------
    // REPLACE HISTORY
    // ----------------------------------------------

    window.history.replaceState(
        null,
        "",
        "index.html"
    );


    // ----------------------------------------------
    // GO TO LOGIN PAGE
    // ----------------------------------------------

    window.location.replace(
        "index.html"
    );
}


// ======================================================
// LOGOUT BUTTON
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const logoutButton =
            document.querySelector(".logout-btn");


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    logoutUser();

                }
            );
        }

    }
);


// ======================================================
// BACK BUTTON PROTECTION
// ======================================================

window.addEventListener(
    "pageshow",
    function (event) {

        const user =
            localStorage.getItem("userName");

        const role =
            localStorage.getItem("userRole");


        const currentPage =
            window.location.pathname
                .split("/")
                .pop();


        const protectedPages = [

            "dashboard.html",
            "my-schedule.html",
            "profile.html",

            "manager-dashboard.html",
            "employees.html",
            "employee-details.html",
            "schedule2.html",
            "manager-profile.html"

        ];


        // ------------------------------------------
        // USER IS LOGGED OUT
        // ------------------------------------------

        if (
            protectedPages.includes(currentPage) &&
            (!user || !role)
        ) {

            window.history.replaceState(
                null,
                "",
                "index.html"
            );


            window.location.replace(
                "index.html"
            );

            return;
        }


        // ------------------------------------------
        // BROWSER RESTORED CACHED PAGE
        // ------------------------------------------

        if (
            event.persisted &&
            protectedPages.includes(currentPage) &&
            (!user || !role)
        ) {

            window.location.replace(
                "index.html"
            );
        }

    }
);


// ======================================================
// BROWSER BACK BUTTON
// ======================================================

window.addEventListener(
    "popstate",
    function () {

        const user =
            localStorage.getItem("userName");

        const role =
            localStorage.getItem("userRole");


        const currentPage =
            window.location.pathname
                .split("/")
                .pop();


        const protectedPages = [

            "dashboard.html",
            "my-schedule.html",
            "profile.html",

            "manager-dashboard.html",
            "employees.html",
            "employee-details.html",
            "schedule2.html",
            "manager-profile.html"

        ];


        // ------------------------------------------
        // NO LOGIN = NEVER ALLOW PROTECTED PAGE
        // ------------------------------------------

        if (
            protectedPages.includes(currentPage) &&
            (!user || !role)
        ) {

            window.location.replace(
                "index.html"
            );
        }

    }
);


// ======================================================
// LOGIN PAGE - CLEAR OLD LOGOUT STATE
// ======================================================

if (isLoginPage) {

    sessionStorage.removeItem(
        "loggedOut"
    );

    // Prevent browser from keeping an old
    // login page snapshot

    window.history.replaceState(
        null,
        "",
        "index.html"
    );
}

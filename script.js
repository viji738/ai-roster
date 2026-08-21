// ======================================================
// LOGOUT + MOBILE / BROWSER BACK BUTTON PROTECTION
// ======================================================


// ======================================================
// PROTECTED PAGES
// ======================================================

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


// ======================================================
// CHECK LOGIN STATUS
// ======================================================

function isLoggedIn() {

    const user =
        localStorage.getItem("userName");

    const role =
        localStorage.getItem("userRole");

    return (
        user &&
        role
    );
}


// ======================================================
// CURRENT PAGE
// ======================================================

function getCurrentPage() {

    return window.location.pathname
        .split("/")
        .pop();

}


// ======================================================
// FORCE LOGIN PAGE
// ======================================================

function forceLoginPage() {

    // Clear login data

    localStorage.removeItem(
        "userName"
    );

    localStorage.removeItem(
        "userRole"
    );

    localStorage.removeItem(
        "loginId"
    );


    // Mark logged out

    sessionStorage.setItem(
        "loggedOut",
        "true"
    );


    // Replace current history

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


// ======================================================
// LOGOUT
// ======================================================

function logoutUser() {

    // ----------------------------------------------
    // CLEAR LOGIN SESSION
    // ----------------------------------------------

    localStorage.removeItem(
        "userName"
    );

    localStorage.removeItem(
        "userRole"
    );

    localStorage.removeItem(
        "loginId"
    );


    // ----------------------------------------------
    // MARK USER AS LOGGED OUT
    // ----------------------------------------------

    sessionStorage.setItem(
        "loggedOut",
        "true"
    );


    // ----------------------------------------------
    // REMOVE OLD HISTORY ENTRY
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
            document.querySelector(
                ".logout-btn"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    logoutUser();

                }
            );

        }

    }
);


// ======================================================
// PAGE ACCESS CHECK
// ======================================================

function checkProtectedPage() {

    const currentPage =
        getCurrentPage();


    const loggedIn =
        isLoggedIn();


    // ----------------------------------------------
    // PROTECTED PAGE WITHOUT LOGIN
    // ----------------------------------------------

    if (
        protectedPages.includes(
            currentPage
        ) &&
        !loggedIn
    ) {

        forceLoginPage();

        return false;
    }


    return true;
}


// ======================================================
// RUN PAGE CHECK IMMEDIATELY
// ======================================================

checkProtectedPage();


// ======================================================
// MOBILE / BROWSER PAGESHOW
// ======================================================

window.addEventListener(
    "pageshow",
    function (event) {

        const currentPage =
            getCurrentPage();


        const loggedIn =
            isLoggedIn();


        // ------------------------------------------
        // DASHBOARD RESTORED FROM CACHE
        // AFTER LOGOUT
        // ------------------------------------------

        if (
            protectedPages.includes(
                currentPage
            ) &&
            !loggedIn
        ) {

            forceLoginPage();

            return;
        }


        // ------------------------------------------
        // BFCACHE RESTORED PAGE
        // ------------------------------------------

        if (
            event.persisted &&
            protectedPages.includes(
                currentPage
            ) &&
            !loggedIn
        ) {

            forceLoginPage();

            return;
        }

    }
);


// ======================================================
// MOBILE BACK BUTTON
// ======================================================

window.addEventListener(
    "popstate",
    function () {

        const currentPage =
            getCurrentPage();


        const loggedIn =
            isLoggedIn();


        // ------------------------------------------
        // LOGGED OUT USER
        // ------------------------------------------

        if (
            protectedPages.includes(
                currentPage
            ) &&
            !loggedIn
        ) {

            forceLoginPage();

            return;
        }

    }
);


// ======================================================
// PAGE VISIBILITY CHECK
// ======================================================

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            checkProtectedPage();

        }

    }
);


// ======================================================
// LOGIN PAGE PROTECTION
// ======================================================

const currentPageName =
    getCurrentPage();


const isLoginPageNow =
    currentPageName ===
        "index.html" ||
    currentPageName === "";


// ======================================================
// LOGIN PAGE HISTORY CONTROL
// ======================================================

if (isLoginPageNow) {

    // ----------------------------------------------
    // USER IS LOGGED OUT
    // ----------------------------------------------

    if (!isLoggedIn()) {

        window.history.replaceState(
            null,
            "",
            "index.html"
        );

    }

}


// ======================================================
// PREVENT OLD DASHBOARD FROM BEING RESTORED
// ======================================================

window.addEventListener(
    "beforepageshow",
    function () {

        checkProtectedPage();

    }
);

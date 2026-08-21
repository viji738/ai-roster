// ======================================================
// AI AUTOMATIC ROSTER SYSTEM
// BACKEND LOGIN + LOGOUT + ROLE PROTECTION
// PROFILE + CALENDAR + CHANGE PASSWORD
// MOBILE LOGIN + LOGOUT FIX
// ======================================================


// ======================================================
// CURRENT PAGE
// ======================================================

const currentPage =
    window.location.pathname.split("/").pop();


// ======================================================
// LOGIN STATUS FUNCTIONS
// ======================================================

function getLoggedInUser() {

    return localStorage.getItem("userName");
}


function getLoggedInRole() {

    return localStorage.getItem("userRole");
}


function getLoggedInId() {

    return localStorage.getItem("loginId");
}


// ======================================================
// PUBLIC PAGE
// ======================================================

const isLoginPage =
    currentPage === "index.html" ||
    currentPage === "";


// ======================================================
// PROTECTED PAGES
// ======================================================

const associatePages = [

    "dashboard.html",
    "my-schedule.html",
    "profile.html"

];


const managerPages = [

    "manager-dashboard.html",
    "employees.html",
    "employee-details.html",
    "schedule2.html",
    "manager-profile.html"

];


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
// REDIRECT USER TO CORRECT DASHBOARD
// ======================================================

function redirectToDashboard(role) {

    if (role === "Associate") {

        window.location.replace(
            "dashboard.html"
        );

        return true;
    }


    if (role === "Manager") {

        window.location.replace(
            "manager-dashboard.html"
        );

        return true;
    }


    return false;
}


// ======================================================
// PAGE ACCESS CONTROL
// ======================================================

function checkPageAccess() {

    const user =
        getLoggedInUser();

    const role =
        getLoggedInRole();


    const loggedOut =
        sessionStorage.getItem(
            "loggedOut"
        );


    // ==================================================
    // LOGIN PAGE
    // ==================================================

    if (isLoginPage) {

        // If logout just happened,
        // stay on login page.

        if (loggedOut === "true") {

            return;
        }


        // Already logged in

        if (
            user &&
            role
        ) {

            redirectToDashboard(
                role
            );

            return;
        }


        return;
    }


    // ==================================================
    // PROTECTED PAGE WITHOUT LOGIN
    // ==================================================

    if (
        !user ||
        !role
    ) {

        window.location.replace(
            "index.html"
        );

        return;
    }


    // ==================================================
    // ASSOCIATE PAGE PROTECTION
    // ==================================================

    if (
        associatePages.includes(
            currentPage
        ) &&
        role !== "Associate"
    ) {

        window.location.replace(
            "index.html"
        );

        return;
    }


    // ==================================================
    // MANAGER PAGE PROTECTION
    // ==================================================

    if (
        managerPages.includes(
            currentPage
        ) &&
        role !== "Manager"
    ) {

        window.location.replace(
            "index.html"
        );

        return;
    }
}


// ======================================================
// RUN PAGE PROTECTION
// ======================================================

checkPageAccess();


// ======================================================
// LOGOUT
// FIXED
// ======================================================

function logoutUser() {

    // ==========================================
    // IMPORTANT:
    // SET LOGGED OUT FLAG FIRST
    // ==========================================

    sessionStorage.setItem(
        "loggedOut",
        "true"
    );


    // ==========================================
    // CLEAR LOGIN DATA
    // ==========================================

    localStorage.removeItem(
        "userName"
    );

    localStorage.removeItem(
        "userRole"
    );

    localStorage.removeItem(
        "loginId"
    );


    sessionStorage.removeItem(
        "userName"
    );

    sessionStorage.removeItem(
        "userRole"
    );

    sessionStorage.removeItem(
        "loginId"
    );


    // ==========================================
    // CLEAR LOGIN FORM
    // ==========================================

    const nameInput =
        document.getElementById(
            "name"
        );


    const loginIdInput =
        document.getElementById(
            "loginId"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


    const roleInput =
        document.getElementById(
            "role"
        );


    if (nameInput) {

        nameInput.value = "";
    }


    if (loginIdInput) {

        loginIdInput.value = "";
    }


    if (passwordInput) {

        passwordInput.value = "";
    }


    if (roleInput) {

        roleInput.value = "";
    }


    // ==========================================
    // REMOVE CURRENT PAGE FROM CURRENT HISTORY
    // ==========================================

    window.history.replaceState(
        null,
        "",
        "index.html"
    );


    // ==========================================
    // GO TO LOGIN PAGE
    // ==========================================

    window.location.replace(
        "index.html"
    );
}


// ======================================================
// LOGOUT BUTTON
// ======================================================

// Delegated click works on mobile also.

document.addEventListener(
    "click",
    function (event) {

        const logoutButton =
            event.target.closest(
                ".logout-btn"
            );


        if (!logoutButton) {

            return;
        }


        event.preventDefault();

        event.stopPropagation();


        logoutUser();

    }
);


// ======================================================
// LOGIN FORM
// ======================================================

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==========================================
            // GET VALUES
            // ==========================================

            const name =
                document.getElementById(
                    "name"
                )
                .value
                .trim();


            const loginId =
                document.getElementById(
                    "loginId"
                )
                .value
                .trim();


            const password =
                document.getElementById(
                    "password"
                )
                .value
                .trim();


            const role =
                document.getElementById(
                    "role"
                )
                .value;


            const message =
                document.getElementById(
                    "message"
                );


            // ==========================================
            // EMPTY VALIDATION
            // ==========================================

            if (
                name === "" ||
                loginId === "" ||
                password === "" ||
                role === ""
            ) {

                message.textContent =
                    "Please fill all the fields.";

                message.style.color =
                    "red";

                return;
            }


            // ==========================================
            // CHECK BACKEND
            // ==========================================

            message.textContent =
                "Checking login...";

            message.style.color =
                "blue";


            try {

                console.log(
                    "LOGIN REQUEST STARTED"
                );


                const response =
                    await fetch(
                        "https://ai-roster-backend.onrender.com/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    name:
                                        name,

                                    loginId:
                                        loginId,

                                    password:
                                        password,

                                    role:
                                        role

                                })
                        }
                    );


                // ======================================
                // SERVER RESPONSE
                // ======================================

                const data =
                    await response.json();


                console.log(
                    "LOGIN RESPONSE:",
                    data
                );


                // ======================================
                // LOGIN FAILED
                // ======================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    message.textContent =
                        data.message ||
                        "Login failed.";

                    message.style.color =
                        "red";

                    return;
                }


                // ======================================
                // CHECK USER DATA
                // ======================================

                if (
                    !data.user ||
                    !data.user.name ||
                    !data.user.role ||
                    !data.user.loginId
                ) {

                    message.textContent =
                        "Invalid login response from server.";

                    message.style.color =
                        "red";

                    return;
                }


                // ======================================
                // GET USER DATA
                // ======================================

                const loggedUser =
                    String(
                        data.user.name
                    );


                const loggedRole =
                    String(
                        data.user.role
                    );


                const loggedLoginId =
                    String(
                        data.user.loginId
                    );


                // ======================================
                // SAVE LOCAL STORAGE
                // ======================================

                localStorage.setItem(
                    "userName",
                    loggedUser
                );


                localStorage.setItem(
                    "userRole",
                    loggedRole
                );


                localStorage.setItem(
                    "loginId",
                    loggedLoginId
                );


                // ======================================
                // CLEAR LOGOUT FLAG
                // ======================================

                sessionStorage.removeItem(
                    "loggedOut"
                );


                // ======================================
                // SAVE SESSION STORAGE
                // ======================================

                sessionStorage.setItem(
                    "userName",
                    loggedUser
                );


                sessionStorage.setItem(
                    "userRole",
                    loggedRole
                );


                sessionStorage.setItem(
                    "loginId",
                    loggedLoginId
                );


                // ======================================
                // VERIFY STORAGE
                // ======================================

                const savedUser =
                    getLoggedInUser();


                const savedRole =
                    getLoggedInRole();


                const savedLoginId =
                    getLoggedInId();


                console.log(
                    "SAVED USER:",
                    savedUser
                );


                console.log(
                    "SAVED ROLE:",
                    savedRole
                );


                console.log(
                    "SAVED LOGIN ID:",
                    savedLoginId
                );


                if (
                    !savedUser ||
                    !savedRole ||
                    !savedLoginId
                ) {

                    message.textContent =
                        "Login session could not be saved. Please try again.";

                    message.style.color =
                        "red";

                    return;
                }


                // ======================================
                // SUCCESS MESSAGE
                // ======================================

                message.textContent =
                    "Login successful!";

                message.style.color =
                    "green";


                // ======================================
                // ROLE BASED REDIRECT
                // ======================================

                setTimeout(
                    function () {

                        redirectToDashboard(
                            savedRole
                        );

                    },
                    300
                );

            }


            // ==========================================
            // BACKEND CONNECTION ERROR
            // ==========================================

            catch (error) {

                console.error(
                    "Backend connection error:",
                    error
                );


                message.textContent =
                    "Cannot connect to server. Please try again.";

                message.style.color =
                    "red";
            }

        }
    );
}


// ======================================================
// MOBILE / BROWSER BACK BUTTON PROTECTION
// FIXED
// ======================================================

window.addEventListener(
    "pageshow",
    function (event) {

        const user =
            getLoggedInUser();


        const role =
            getLoggedInRole();


        const loggedOut =
            sessionStorage.getItem(
                "loggedOut"
            );


        const page =
            window.location.pathname
                .split("/")
                .pop();


        // ==================================================
        // IF LOGGED OUT
        // ==================================================

        if (
            loggedOut === "true"
        ) {

            // Remove any remaining login data

            localStorage.removeItem(
                "userName"
            );

            localStorage.removeItem(
                "userRole"
            );

            localStorage.removeItem(
                "loginId"
            );


            sessionStorage.removeItem(
                "userName"
            );

            sessionStorage.removeItem(
                "userRole"
            );

            sessionStorage.removeItem(
                "loginId"
            );


            // If browser tries to show old dashboard
            // send user back to login page.

            if (
                protectedPages.includes(page)
            ) {

                window.location.replace(
                    "index.html"
                );

                return;
            }


            // If already on login page,
            // stay here.

            return;
        }


        // ==================================================
        // PROTECTED PAGE WITHOUT LOGIN
        // ==================================================

        if (
            protectedPages.includes(page) &&
            (!user || !role)
        ) {

            window.location.replace(
                "index.html"
            );

            return;
        }


        // ==================================================
        // BF CACHE / MOBILE CACHE
        // ==================================================

        if (
            event.persisted &&
            protectedPages.includes(page) &&
            (!user || !role)
        ) {

            window.location.replace(
                "index.html"
            );

            return;
        }

    }
);


// ======================================================
// BROWSER BACK BUTTON
// FIXED
// ======================================================

window.addEventListener(
    "popstate",
    function () {

        const user =
            getLoggedInUser();


        const role =
            getLoggedInRole();


        const loggedOut =
            sessionStorage.getItem(
                "loggedOut"
            );


        const page =
            window.location.pathname
                .split("/")
                .pop();


        // ==================================================
        // LOGGED OUT USER
        // ==================================================

        if (
            loggedOut === "true"
        ) {

            if (
                protectedPages.includes(page)
            ) {

                window.location.replace(
                    "index.html"
                );

                return;
            }
        }


        // ==================================================
        // PROTECTED PAGE WITHOUT LOGIN
        // ==================================================

        if (
            protectedPages.includes(page) &&
            (!user || !role)
        ) {

            window.location.replace(
                "index.html"
            );

            return;
        }


        // ==================================================
        // LOGIN PAGE WITH VALID SESSION
        // ==================================================

        if (
            isLoginPage &&
            user &&
            role &&
            loggedOut !== "true"
        ) {

            redirectToDashboard(
                role
            );

        }

    }
);


// ======================================================
// LOGIN PAGE LOAD PROTECTION
// ======================================================

window.addEventListener(
    "DOMContentLoaded",
    function () {

        if (!isLoginPage) {

            return;
        }


        const loggedOut =
            sessionStorage.getItem(
                "loggedOut"
            );


        // If logout happened,
        // keep user on login page.

        if (
            loggedOut === "true"
        ) {

            const loginForm =
                document.getElementById(
                    "loginForm"
                );


            if (loginForm) {

                loginForm.reset();

            }

            return;
        }

    }
);


// ======================================================
// USER DETAILS
// ======================================================

const userName =
    getLoggedInUser();


const userRole =
    getLoggedInRole();


const userNameElement =
    document.getElementById(
        "userName"
    );


const userRoleElement =
    document.getElementById(
        "userRole"
    );


if (
    userNameElement &&
    userName
) {

    userNameElement.textContent =
        userName;
}


if (
    userRoleElement &&
    userRole
) {

    userRoleElement.textContent =
        userRole;
}


// ======================================================
// PROFILE DETAILS
// ======================================================

const profileNameElement =
    document.getElementById(
        "profileName"
    );


const profileFullNameElement =
    document.getElementById(
        "profileFullName"
    );


const profileLoginIdElement =
    document.getElementById(
        "profileLoginId"
    );


const profileRoleElement =
    document.getElementById(
        "profileRole"
    );


const profileRoleInfoElement =
    document.getElementById(
        "profileRoleInfo"
    );


const profileInitialElement =
    document.getElementById(
        "profileInitial"
    );


const savedName =
    getLoggedInUser();


const savedRole =
    getLoggedInRole();


const savedLoginId =
    getLoggedInId();


if (
    profileNameElement &&
    savedName
) {

    profileNameElement.textContent =
        savedName;
}


if (
    profileFullNameElement &&
    savedName
) {

    profileFullNameElement.textContent =
        savedName;
}


if (
    profileLoginIdElement &&
    savedLoginId
) {

    profileLoginIdElement.textContent =
        savedLoginId;
}


if (
    profileRoleElement &&
    savedRole
) {

    profileRoleElement.textContent =
        savedRole;
}


if (
    profileRoleInfoElement &&
    savedRole
) {

    profileRoleInfoElement.textContent =
        savedRole;
}


if (
    profileInitialElement &&
    savedName
) {

    profileInitialElement.textContent =
        savedName
            .charAt(0)
            .toUpperCase();
}


// ======================================================
// CALENDAR
// ======================================================

const calendar =
    document.getElementById(
        "calendar"
    );


if (calendar) {

    let navigationYear = 2026;

    let navigationMonth = 7;


    const currentMonthElement =
        document.getElementById(
            "currentMonth"
        );


    const prevMonthButton =
        document.getElementById(
            "prevMonth"
        );


    const nextMonthButton =
        document.getElementById(
            "nextMonth"
        );


    const todayShiftElement =
        document.getElementById(
            "todayShift"
        );


    const currentRotationElement =
        document.getElementById(
            "currentRotation"
        );


    const workingDaysElement =
        document.getElementById(
            "workingDays"
        );


    const weekOffElement =
        document.getElementById(
            "weekOff"
        );


    const nextShiftElement =
        document.getElementById(
            "nextShift"
        );


    const nextShiftDateElement =
        document.getElementById(
            "nextShiftDate"
        );


    const nextShiftTimeElement =
        document.getElementById(
            "nextShiftTime"
        );


    const upcomingSchedule =
        document.getElementById(
            "upcomingSchedule"
        );


    const monthNames = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];


    // ==================================================
    // SHIFT CALCULATION
    // ==================================================

    function getShift(
        year,
        month,
        date
    ) {

        const baseDate =
            new Date(
                2026,
                7,
                1
            );


        const currentDate =
            new Date(
                year,
                month,
                date
            );


        const difference =
            Math.floor(
                (
                    currentDate -
                    baseDate
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        const cycleDay =
            (
                (difference % 14) +
                14
            ) % 14;


        if (
            cycleDay < 5
        ) {

            return {

                shift:
                    "Day Shift",

                shortName:
                    "DAY",

                timing:
                    "9:00 AM - 6:00 PM",

                status:
                    "Working",

                className:
                    "day-shift"

            };
        }


        if (
            cycleDay < 7
        ) {

            return {

                shift:
                    "Week Off",

                shortName:
                    "WEEK OFF",

                timing:
                    "-",

                status:
                    "Off",

                className:
                    "week-off"

            };
        }


        if (
            cycleDay < 12
        ) {

            return {

                shift:
                    "Night Shift",

                shortName:
                    "NIGHT",

                timing:
                    "9:00 PM - 6:00 AM",

                status:
                    "Working",

                className:
                    "night-shift"

            };
        }


        return {

            shift:
                "Week Off",

            shortName:
                "WEEK OFF",

            timing:
                "-",

            status:
                "Off",

            className:
                "week-off"

        };
    }


    // ==================================================
    // CREATE CALENDAR
    // ==================================================

    function createCalendar(
        year,
        month
    ) {

        calendar.innerHTML =
            "";


        if (
            currentMonthElement
        ) {

            currentMonthElement.textContent =
                monthNames[month] +
                " " +
                year;
        }


        const dayNames = [

            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"

        ];


        dayNames.forEach(
            function (day) {

                const dayName =
                    document.createElement(
                        "div"
                    );


                dayName.classList.add(
                    "day-name"
                );


                dayName.textContent =
                    day;


                calendar.appendChild(
                    dayName
                );

            }
        );


        const firstDay =
            new Date(
                year,
                month,
                1
            ).getDay();


        const totalDays =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const emptyBox =
                document.createElement(
                    "div"
                );


            emptyBox.classList.add(
                "empty"
            );


            calendar.appendChild(
                emptyBox
            );
        }


        for (
            let date = 1;
            date <= totalDays;
            date++
        ) {

            const dateBox =
                document.createElement(
                    "div"
                );


            dateBox.classList.add(
                "date"
            );


            const dateNumber =
                document.createElement(
                    "span"
                );


            dateNumber.textContent =
                date;


            dateBox.appendChild(
                dateNumber
            );


            const shift =
                document.createElement(
                    "small"
                );


            const shiftInfo =
                getShift(
                    year,
                    month,
                    date
                );


            shift.textContent =
                shiftInfo.shortName;


            dateBox.classList.add(
                shiftInfo.className
            );


            const today =
                new Date();


            if (
                year ===
                    today.getFullYear() &&
                month ===
                    today.getMonth() &&
                date ===
                    today.getDate()
            ) {

                dateBox.classList.add(
                    "today"
                );
            }


            dateBox.appendChild(
                shift
            );


            calendar.appendChild(
                dateBox
            );
        }
    }


    // ==================================================
    // TODAY'S SHIFT
    // ==================================================

    function updateTodayShift() {

        const today =
            new Date();


        const todayInfo =
            getShift(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );


        if (
            todayShiftElement
        ) {

            todayShiftElement.textContent =
                todayInfo.shift;
        }


        if (
            currentRotationElement
        ) {

            currentRotationElement.textContent =
                todayInfo.shift;
        }


        if (
            workingDaysElement
        ) {

            workingDaysElement.textContent =
                "5 Days";
        }


        if (
            weekOffElement
        ) {

            weekOffElement.textContent =
                "2 Days";
        }
    }


    // ==================================================
    // NEXT SHIFT
    // ==================================================

    function updateNextShift() {

        if (
            !nextShiftElement ||
            !nextShiftDateElement ||
            !nextShiftTimeElement
        ) {

            return;
        }


        const today =
            new Date();


        let nextDate =
            new Date(today);


        nextDate.setDate(
            nextDate.getDate() + 1
        );


        while (true) {

            const shiftInfo =
                getShift(
                    nextDate.getFullYear(),
                    nextDate.getMonth(),
                    nextDate.getDate()
                );


            if (
                shiftInfo.status ===
                "Working"
            ) {

                nextShiftElement.textContent =
                    shiftInfo.shift;


                nextShiftDateElement.textContent =
                    nextDate.toLocaleDateString(
                        "en-US",
                        {
                            weekday:
                                "long",

                            month:
                                "long",

                            day:
                                "numeric",

                            year:
                                "numeric"
                        }
                    );


                nextShiftTimeElement.textContent =
                    shiftInfo.timing;


                break;
            }


            nextDate.setDate(
                nextDate.getDate() + 1
            );
        }
    }


    // ==================================================
    // UPCOMING 7 DAYS
    // ==================================================

    function updateUpcomingSchedule() {

        if (
            !upcomingSchedule
        ) {

            return;
        }


        upcomingSchedule.innerHTML =
            "";


        const today =
            new Date();


        for (
            let i = 1;
            i <= 7;
            i++
        ) {

            const scheduleDate =
                new Date(today);


            scheduleDate.setDate(
                today.getDate() + i
            );


            const shiftInfo =
                getShift(
                    scheduleDate.getFullYear(),
                    scheduleDate.getMonth(),
                    scheduleDate.getDate()
                );


            const scheduleCard =
                document.createElement(
                    "div"
                );


            scheduleCard.classList.add(
                "schedule-item"
            );


            const dateElement =
                document.createElement(
                    "div"
                );


            dateElement.classList.add(
                "schedule-date"
            );


            dateElement.textContent =
                scheduleDate.toLocaleDateString(
                    "en-US",
                    {
                        weekday:
                            "short",

                        month:
                            "short",

                        day:
                            "numeric"
                    }
                );


            const shiftElement =
                document.createElement(
                    "div"
                );


            shiftElement.classList.add(
                "schedule-shift"
            );


            shiftElement.textContent =
                shiftInfo.shift;


            const timingElement =
                document.createElement(
                    "div"
                );


            timingElement.classList.add(
                "schedule-time"
            );


            timingElement.textContent =
                shiftInfo.timing;


            const statusElement =
                document.createElement(
                    "div"
                );


            statusElement.classList.add(
                "schedule-status"
            );


            statusElement.textContent =
                shiftInfo.status;


            scheduleCard.appendChild(
                dateElement
            );


            scheduleCard.appendChild(
                shiftElement
            );


            scheduleCard.appendChild(
                timingElement
            );


            scheduleCard.appendChild(
                statusElement
            );


            upcomingSchedule.appendChild(
                scheduleCard
            );
        }
    }


    // ==================================================
    // PREVIOUS MONTH
    // ==================================================

    if (
        prevMonthButton
    ) {

        prevMonthButton.addEventListener(
            "click",
            function () {

                navigationMonth--;


                if (
                    navigationMonth < 0
                ) {

                    navigationMonth = 11;

                    navigationYear--;
                }


                createCalendar(
                    navigationYear,
                    navigationMonth
                );

            }
        );
    }


    // ==================================================
    // NEXT MONTH
    // ==================================================

    if (
        nextMonthButton
    ) {

        nextMonthButton.addEventListener(
            "click",
            function () {

                navigationMonth++;


                if (
                    navigationMonth > 11
                ) {

                    navigationMonth = 0;

                    navigationYear++;
                }


                createCalendar(
                    navigationYear,
                    navigationMonth
                );

            }
        );
    }


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    createCalendar(
        navigationYear,
        navigationMonth
    );


    updateTodayShift();

    updateNextShift();

    updateUpcomingSchedule();
}


// ======================================================
// CHANGE PASSWORD
// ======================================================

const changePasswordForm =
    document.getElementById(
        "changePasswordForm"
    );


if (
    changePasswordForm
) {

    changePasswordForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const currentPassword =
                document.getElementById(
                    "currentPassword"
                )
                .value
                .trim();


            const newPassword =
                document.getElementById(
                    "newPassword"
                )
                .value
                .trim();


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                )
                .value
                .trim();


            const passwordMessage =
                document.getElementById(
                    "passwordMessage"
                );


            const loginId =
                getLoggedInId();


            // ==================================================
            // CHECK LOGIN ID
            // ==================================================

            if (
                !loginId
            ) {

                passwordMessage.textContent =
                    "User login information not found.";

                passwordMessage.style.color =
                    "red";

                return;
            }


            // ==================================================
            // CHECK EMPTY FIELDS
            // ==================================================

            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {

                passwordMessage.textContent =
                    "Please fill all the fields.";

                passwordMessage.style.color =
                    "red";

                return;
            }


            // ==================================================
            // PASSWORD LENGTH
            // ==================================================

            if (
                newPassword.length < 8
            ) {

                passwordMessage.textContent =
                    "New password must be at least 8 characters.";

                passwordMessage.style.color =
                    "red";

                return;
            }


            // ==================================================
            // PASSWORD MATCH
            // ==================================================

            if (
                newPassword !==
                confirmPassword
            ) {

                passwordMessage.textContent =
                    "New passwords do not match.";

                passwordMessage.style.color =
                    "red";

                return;
            }


            // ==================================================
            // CONNECT TO BACKEND
            // ==================================================

            passwordMessage.textContent =
                "Changing password...";

            passwordMessage.style.color =
                "blue";


            try {

                const response =
                    await fetch(
                        "https://ai-roster-backend.onrender.com/change-password",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    loginId:
                                        loginId,

                                    currentPassword:
                                        currentPassword,

                                    newPassword:
                                        newPassword,

                                    confirmPassword:
                                        confirmPassword

                                })
                        }
                    );


                const data =
                    await response.json();


                // ==================================================
                // PASSWORD CHANGE FAILED
                // ==================================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    passwordMessage.textContent =
                        data.message ||
                        "Password change failed.";

                    passwordMessage.style.color =
                        "red";

                    return;
                }


                // ==================================================
                // PASSWORD CHANGE SUCCESS
                // ==================================================

                passwordMessage.textContent =
                    "Password changed successfully!";

                passwordMessage.style.color =
                    "green";


                document.getElementById(
                    "currentPassword"
                ).value = "";


                document.getElementById(
                    "newPassword"
                ).value = "";


                document.getElementById(
                    "confirmPassword"
                ).value = "";

            }


            // ==================================================
            // CONNECTION ERROR
            // ==================================================

            catch (error) {

                console.error(
                    "Change password error:",
                    error
                );


                passwordMessage.textContent =
                    "Cannot connect to server.";

                passwordMessage.style.color =
                    "red";
            }

        }
    );
}

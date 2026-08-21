// ======================================================
// AI AUTOMATIC ROSTER SYSTEM
// LOGIN + LOGOUT + ROLE PROTECTION
// PROFILE + CALENDAR + CHANGE PASSWORD
// MOBILE BACK BUTTON PROTECTION
// ======================================================


// ======================================================
// CURRENT PAGE
// ======================================================

const currentPage =
    window.location.pathname.split("/").pop() || "index.html";


// ======================================================
// LOGIN STATUS
// ======================================================

function getLoggedInUser() {
    return localStorage.getItem("userName");
}

function getLoggedInRole() {
    return localStorage.getItem("userRole");
}

function getLoginId() {
    return localStorage.getItem("loginId");
}


// ======================================================
// PUBLIC PAGE
// ======================================================

const isLoginPage =
    currentPage === "index.html" ||
    currentPage === "";


// ======================================================
// PAGE LISTS
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
    "manager-profile.html",
    "create-associate.html"
];

const protectedPages = [
    ...associatePages,
    ...managerPages
];


// ======================================================
// NORMALIZE ROLE
// ======================================================

function normalizeRole(role) {

    if (!role) {
        return "";
    }

    return role
        .toString()
        .trim()
        .toLowerCase();

}


// ======================================================
// PAGE ACCESS PROTECTION
// ======================================================

function checkPageAccess() {

    const user =
        getLoggedInUser();

    const role =
        normalizeRole(
            getLoggedInRole()
        );


    // ------------------------------------------
    // NOT LOGGED IN
    // ------------------------------------------

    if (
        protectedPages.includes(currentPage) &&
        (!user || !role)
    ) {

        window.location.replace(
            "index.html"
        );

        return;
    }


    // ------------------------------------------
    // ASSOCIATE PAGE
    // ------------------------------------------

    if (
        associatePages.includes(currentPage) &&
        role !== "associate"
    ) {

        window.location.replace(
            "index.html"
        );

        return;
    }


    // ------------------------------------------
    // MANAGER PAGE
    // ------------------------------------------

    if (
        managerPages.includes(currentPage) &&
        role !== "manager"
    ) {

        window.location.replace(
            "index.html"
        );

        return;
    }

}


// Run protection

checkPageAccess();


// ======================================================
// LOGOUT
// ======================================================

function logoutUser() {

    // Clear session

    localStorage.removeItem(
        "userName"
    );

    localStorage.removeItem(
        "userRole"
    );

    localStorage.removeItem(
        "loginId"
    );


    // Clear login fields if available

    const nameInput =
        document.getElementById("name");

    const loginIdInput =
        document.getElementById("loginId");

    const passwordInput =
        document.getElementById("password");

    const roleInput =
        document.getElementById("role");


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


    // Go to login page

    window.location.replace(
        "index.html"
    );
}


// ======================================================
// LOGOUT BUTTON
// ======================================================

const logoutButton =
    document.querySelector(
        ".logout-btn"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logoutUser();

        }
    );

}


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
            // GET INPUT VALUES
            // ==========================================

            const name =
                document.getElementById(
                    "name"
                ).value.trim();


            const loginId =
                document.getElementById(
                    "loginId"
                ).value.trim();


            const password =
                document.getElementById(
                    "password"
                ).value.trim();


            const role =
                document.getElementById(
                    "role"
                ).value.trim();


            const message =
                document.getElementById(
                    "message"
                );


            // ==========================================
            // EMPTY VALIDATION
            // ==========================================

            if (
                !name ||
                !loginId ||
                !password ||
                !role
            ) {

                if (message) {

                    message.textContent =
                        "Please fill all the fields.";

                    message.style.color =
                        "red";

                }

                return;
            }


            // ==========================================
            // LOGIN START
            // ==========================================

            if (message) {

                message.textContent =
                    "Checking login...";

                message.style.color =
                    "blue";
            }


            try {

                console.log(
                    "LOGIN REQUEST STARTED"
                );


                // ======================================
                // BACKEND LOGIN
                // ======================================

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
                // READ RESPONSE
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
                    !data.success ||
                    !data.user
                ) {

                    if (message) {

                        message.textContent =
                            data.message ||
                            "Invalid login details.";

                        message.style.color =
                            "red";
                    }

                    return;
                }


                // ======================================
                // GET USER DATA
                // ======================================

                const userName =
                    data.user.name;

                const userLoginId =
                    data.user.loginId;

                const userRole =
                    data.user.role;


                const normalizedRole =
                    normalizeRole(
                        userRole
                    );


                console.log(
                    "USER ROLE:",
                    userRole
                );

                console.log(
                    "NORMALIZED ROLE:",
                    normalizedRole
                );


                // ======================================
                // CHECK VALID ROLE
                // ======================================

                if (
                    normalizedRole !== "associate" &&
                    normalizedRole !== "manager"
                ) {

                    if (message) {

                        message.textContent =
                            "Invalid user role received from server.";

                        message.style.color =
                            "red";
                    }

                    return;
                }


                // ======================================
                // SAVE LOGIN SESSION
                // ======================================

                localStorage.setItem(
                    "userName",
                    userName
                );

                localStorage.setItem(
                    "userRole",
                    userRole
                );

                localStorage.setItem(
                    "loginId",
                    userLoginId
                );


                // ======================================
                // SUCCESS MESSAGE
                // ======================================

                if (message) {

                    message.textContent =
                        "Login successful!";

                    message.style.color =
                        "green";
                }


                // ======================================
                // REDIRECT
                // ======================================

                setTimeout(
                    function () {

                        if (
                            normalizedRole ===
                            "associate"
                        ) {

                            window.location.replace(
                                "dashboard.html"
                            );

                            return;
                        }


                        if (
                            normalizedRole ===
                            "manager"
                        ) {

                            window.location.replace(
                                "manager-dashboard.html"
                            );

                            return;
                        }

                    },
                    300
                );

            }


            // ==========================================
            // BACKEND ERROR
            // ==========================================

            catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                if (message) {

                    message.textContent =
                        "Cannot connect to server. Please try again.";

                    message.style.color =
                        "red";
                }

            }

        }
    );

}


// ======================================================
// USER DETAILS
// ======================================================

const userNameElement =
    document.getElementById(
        "userName"
    );

const userRoleElement =
    document.getElementById(
        "userRole"
    );


const savedUserName =
    getLoggedInUser();

const savedUserRole =
    getLoggedInRole();


if (
    userNameElement &&
    savedUserName
) {

    userNameElement.textContent =
        savedUserName;
}


if (
    userRoleElement &&
    savedUserRole
) {

    userRoleElement.textContent =
        savedUserRole;
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
    getLoginId();


// ======================================================
// PROFILE NAME
// ======================================================

if (
    profileNameElement &&
    savedName
) {

    profileNameElement.textContent =
        savedName;
}


// ======================================================
// FULL NAME
// ======================================================

if (
    profileFullNameElement &&
    savedName
) {

    profileFullNameElement.textContent =
        savedName;
}


// ======================================================
// LOGIN ID
// ======================================================

if (
    profileLoginIdElement &&
    savedLoginId
) {

    profileLoginIdElement.textContent =
        savedLoginId;
}


// ======================================================
// PROFILE ROLE
// ======================================================

if (
    profileRoleElement &&
    savedRole
) {

    profileRoleElement.textContent =
        savedRole;
}


// ======================================================
// ROLE INFORMATION
// ======================================================

if (
    profileRoleInfoElement &&
    savedRole
) {

    profileRoleInfoElement.textContent =
        savedRole;
}


// ======================================================
// PROFILE INITIAL
// ======================================================

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


        // DAY SHIFT

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


        // WEEK OFF

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


        // NIGHT SHIFT

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


        // WEEK OFF

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


        if (currentMonthElement) {

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
    // TODAY SHIFT
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


        if (todayShiftElement) {

            todayShiftElement.textContent =
                todayInfo.shift;
        }


        if (currentRotationElement) {

            currentRotationElement.textContent =
                todayInfo.shift;
        }


        if (workingDaysElement) {

            workingDaysElement.textContent =
                "5 Days";
        }


        if (weekOffElement) {

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

        if (!upcomingSchedule) {

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

    if (prevMonthButton) {

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

    if (nextMonthButton) {

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


if (changePasswordForm) {

    changePasswordForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const currentPassword =
                document.getElementById(
                    "currentPassword"
                ).value.trim();


            const newPassword =
                document.getElementById(
                    "newPassword"
                ).value.trim();


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value.trim();


            const passwordMessage =
                document.getElementById(
                    "passwordMessage"
                );


            const loginId =
                getLoginId();


            // CHECK LOGIN ID

            if (!loginId) {

                passwordMessage.textContent =
                    "User login information not found.";

                passwordMessage.style.color =
                    "red";

                return;
            }


            // EMPTY

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


            // PASSWORD LENGTH

            if (
                newPassword.length < 8
            ) {

                passwordMessage.textContent =
                    "New password must be at least 8 characters.";

                passwordMessage.style.color =
                    "red";

                return;
            }


            // PASSWORD MATCH

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


// ======================================================
// MOBILE / BROWSER BACK BUTTON PROTECTION
// ======================================================

window.addEventListener(
    "pageshow",
    function () {

        const page =
            window.location.pathname
                .split("/")
                .pop() || "index.html";


        const user =
            getLoggedInUser();


        const role =
            normalizeRole(
                getLoggedInRole()
            );


        // ------------------------------------------
        // LOGGED OUT USER
        // ------------------------------------------

        if (
            protectedPages.includes(page) &&
            (!user || !role)
        ) {

            window.location.replace(
                "index.html"
            );

            return;
        }


        // ------------------------------------------
        // ASSOCIATE
        // ------------------------------------------

        if (
            associatePages.includes(page) &&
            role !== "associate"
        ) {

            window.location.replace(
                "index.html"
            );

            return;
        }


        // ------------------------------------------
        // MANAGER
        // ------------------------------------------

        if (
            managerPages.includes(page) &&
            role !== "manager"
        ) {

            window.location.replace(
                "index.html"
            );

            return;
        }

    }
);


// ======================================================
// PREVENT BROWSER CACHE AFTER LOGOUT
// ======================================================

window.addEventListener(
    "load",
    function () {

        if (
            "navigation" in performance
        ) {

            const navigation =
                performance.getEntriesByType(
                    "navigation"
                )[0];


            if (
                navigation &&
                navigation.type ===
                "back_forward"
            ) {

                checkPageAccess();

            }

        }

    }
);

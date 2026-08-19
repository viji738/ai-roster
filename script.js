// ================================
// LOGOUT
// ================================

const logoutButton =
    document.querySelector(".logout-btn");

if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("loginId");

        window.location.href = "index.html";

    });
}


// ================================
// LOGIN PROTECTION
// ================================

const currentPage =
    window.location.pathname.split("/").pop();

const loggedInUser =
    localStorage.getItem("userName");

const loggedInRole =
    localStorage.getItem("userRole");

if (
    (
        currentPage === "dashboard.html" ||
        currentPage === "manager-dashboard.html" ||
        currentPage === "profile.html" ||
        currentPage === "my-schedule.html"
    )
    &&
    (
        !loggedInUser ||
        !loggedInRole
    )
) {

    window.location.href = "index.html";
}


// ================================
// LOGIN
// ================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();


        // ================================
        // GET INPUT VALUES
        // ================================

        const name =
            document.getElementById("name").value.trim();

        const loginId =
            document.getElementById("loginId").value.trim();

        const password =
            document.getElementById("password").value.trim();

        const role =
            document.getElementById("role").value;

        const message =
            document.getElementById("message");


        // ================================
        // EMPTY FIELD VALIDATION
        // ================================

        if (
            name === "" ||
            loginId === "" ||
            password === "" ||
            role === ""
        ) {

            message.textContent =
                "Please fill all the fields.";

            message.style.color = "red";

            return;
        }


        // ================================
        // LOGIN CREDENTIALS
        // ================================

        const accounts = {

            Associate: {
                loginId: "ASSOC001",
                password: "Assoc@123"
            },

            Manager: {
                loginId: "MAN001",
                password: "Manager@123"
            }

        };


        // ================================
        // CHECK ROLE
        // ================================

        if (!accounts[role]) {

            message.textContent =
                "Invalid role selected.";

            message.style.color = "red";

            return;
        }


        // ================================
        // CHECK LOGIN ID
        // ================================

        if (
            loginId !== accounts[role].loginId
        ) {

            message.textContent =
                "Invalid Login ID.";

            message.style.color = "red";

            return;
        }


        // ================================
        // CHECK PASSWORD
        // ================================

        if (
            password !== accounts[role].password
        ) {

            message.textContent =
                "Incorrect password.";

            message.style.color = "red";

            return;
        }


        // ================================
        // LOGIN SUCCESS
        // ================================

        localStorage.setItem(
            "userName",
            name
        );

        localStorage.setItem(
            "userRole",
            role
        );

        localStorage.setItem(
            "loginId",
            loginId
        );


        message.textContent =
            "Login successful!";

        message.style.color = "green";


        // ================================
        // ROLE BASED REDIRECT
        // ================================

        setTimeout(function() {

            if (role === "Associate") {

                window.location.href =
                    "dashboard.html";

            }

            else if (role === "Manager") {

                window.location.href =
                    "manager-dashboard.html";

            }

        }, 1000);

    });
}


// ================================
// USER DETAILS
// ================================

const userName =
    localStorage.getItem("userName");

const userRole =
    localStorage.getItem("userRole");

const userNameElement =
    document.getElementById("userName");

const userRoleElement =
    document.getElementById("userRole");

if (userNameElement && userName) {

    userNameElement.textContent =
        userName;
}

if (userRoleElement && userRole) {

    userRoleElement.textContent =
        userRole;
}


// ================================
// PROFILE DETAILS
// ================================

const profileNameElement =
    document.getElementById("profileName");

const profileFullNameElement =
    document.getElementById("profileFullName");

const profileLoginIdElement =
    document.getElementById("profileLoginId");

const profileRoleElement =
    document.getElementById("profileRole");

const profileRoleInfoElement =
    document.getElementById("profileRoleInfo");

const profileInitialElement =
    document.getElementById("profileInitial");

const savedName =
    localStorage.getItem("userName");

const savedRole =
    localStorage.getItem("userRole");

const savedLoginId =
    localStorage.getItem("loginId");


// Profile Name

if (profileNameElement && savedName) {

    profileNameElement.textContent =
        savedName;
}


// Full Name

if (profileFullNameElement && savedName) {

    profileFullNameElement.textContent =
        savedName;
}


// Login ID

if (profileLoginIdElement && savedLoginId) {

    profileLoginIdElement.textContent =
        savedLoginId;
}


// Profile Role

if (profileRoleElement && savedRole) {

    profileRoleElement.textContent =
        savedRole;
}


// Role Information

if (profileRoleInfoElement && savedRole) {

    profileRoleInfoElement.textContent =
        savedRole;
}


// Profile Initial

if (profileInitialElement && savedName) {

    profileInitialElement.textContent =
        savedName.charAt(0).toUpperCase();
}


// ================================
// CALENDAR
// 5 DAYS DAY
// 2 DAYS OFF
// 5 DAYS NIGHT
// 2 DAYS OFF
// ================================

const calendar =
    document.getElementById("calendar");

if (calendar) {

    let navigationYear = 2026;
    let navigationMonth = 7; // August


    // ================================
    // ELEMENTS
    // ================================

    const currentMonthElement =
        document.getElementById("currentMonth");

    const prevMonthButton =
        document.getElementById("prevMonth");

    const nextMonthButton =
        document.getElementById("nextMonth");

    const todayShiftElement =
        document.getElementById("todayShift");

    const currentRotationElement =
        document.getElementById("currentRotation");

    const workingDaysElement =
        document.getElementById("workingDays");

    const weekOffElement =
        document.getElementById("weekOff");

    const nextShiftElement =
        document.getElementById("nextShift");

    const nextShiftDateElement =
        document.getElementById("nextShiftDate");

    const nextShiftTimeElement =
        document.getElementById("nextShiftTime");

    const upcomingSchedule =
        document.getElementById("upcomingSchedule");


    // ================================
    // MONTH NAMES
    // ================================

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


    // ================================
    // SHIFT CALCULATION
    // ================================

    function getShift(year, month, date) {

        const baseDate =
            new Date(2026, 7, 1);

        const currentDate =
            new Date(year, month, date);

        const difference =
            Math.floor(
                (
                    currentDate - baseDate
                ) /
                (1000 * 60 * 60 * 24)
            );

        const cycleDay =
            ((difference % 14) + 14) % 14;


        // Day Shift

        if (cycleDay < 5) {

            return {
                shift: "Day Shift",
                shortName: "DAY",
                timing: "9:00 AM - 6:00 PM",
                status: "Working",
                className: "day-shift"
            };
        }


        // Week Off

        if (cycleDay < 7) {

            return {
                shift: "Week Off",
                shortName: "WEEK OFF",
                timing: "-",
                status: "Off",
                className: "week-off"
            };
        }


        // Night Shift

        if (cycleDay < 12) {

            return {
                shift: "Night Shift",
                shortName: "NIGHT",
                timing: "9:00 PM - 6:00 AM",
                status: "Working",
                className: "night-shift"
            };
        }


        // Week Off

        return {
            shift: "Week Off",
            shortName: "WEEK OFF",
            timing: "-",
            status: "Off",
            className: "week-off"
        };
    }


    // ================================
    // CREATE CALENDAR
    // ================================

    function createCalendar(year, month) {

        calendar.innerHTML = "";


        if (currentMonthElement) {

            currentMonthElement.textContent =
                monthNames[month] + " " + year;
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


        dayNames.forEach(function(day) {

            const dayName =
                document.createElement("div");

            dayName.classList.add("day-name");

            dayName.textContent = day;

            calendar.appendChild(dayName);
        });


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
                document.createElement("div");

            emptyBox.classList.add("empty");

            calendar.appendChild(emptyBox);
        }


        for (
            let date = 1;
            date <= totalDays;
            date++
        ) {

            const dateBox =
                document.createElement("div");

            dateBox.classList.add("date");


            const dateNumber =
                document.createElement("span");

            dateNumber.textContent =
                date;

            dateBox.appendChild(dateNumber);


            const shift =
                document.createElement("small");

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
                year === today.getFullYear() &&
                month === today.getMonth() &&
                date === today.getDate()
            ) {

                dateBox.classList.add("today");
            }


            dateBox.appendChild(shift);

            calendar.appendChild(dateBox);
        }
    }


    // ================================
    // TODAY'S SHIFT
    // ================================

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


    // ================================
    // NEXT SHIFT
    // ================================

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


            if (shiftInfo.status === "Working") {

                nextShiftElement.textContent =
                    shiftInfo.shift;

                nextShiftDateElement.textContent =
                    nextDate.toLocaleDateString(
                        "en-US",
                        {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric"
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


    // ================================
    // UPCOMING 7 DAYS
    // ================================

    function updateUpcomingSchedule() {

        if (!upcomingSchedule) {
            return;
        }


        upcomingSchedule.innerHTML = "";


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
                document.createElement("div");

            scheduleCard.classList.add(
                "schedule-item"
            );


            const dateElement =
                document.createElement("div");

            dateElement.classList.add(
                "schedule-date"
            );

            dateElement.textContent =
                scheduleDate.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                    }
                );


            const shiftElement =
                document.createElement("div");

            shiftElement.classList.add(
                "schedule-shift"
            );

            shiftElement.textContent =
                shiftInfo.shift;


            const timingElement =
                document.createElement("div");

            timingElement.classList.add(
                "schedule-time"
            );

            timingElement.textContent =
                shiftInfo.timing;


            const statusElement =
                document.createElement("div");

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


    // ================================
    // PREVIOUS MONTH
    // ================================

    if (prevMonthButton) {

        prevMonthButton.addEventListener(
            "click",
            function() {

                navigationMonth--;

                if (navigationMonth < 0) {

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


    // ================================
    // NEXT MONTH
    // ================================

    if (nextMonthButton) {

        nextMonthButton.addEventListener(
            "click",
            function() {

                navigationMonth++;

                if (navigationMonth > 11) {

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


    // ================================
    // INITIAL LOAD
    // ================================

    createCalendar(
        navigationYear,
        navigationMonth
    );

    updateTodayShift();

    updateNextShift();

    updateUpcomingSchedule();
}

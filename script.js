// =====================================
// ELEMENTOS
// =====================================

const greeting =
    document.getElementById("greeting");

const currentDate =
    document.getElementById("currentDate");

const totalActivities =
    document.getElementById("totalActivities");

const pendingActivities =
    document.getElementById("pendingActivities");

const completedActivities =
    document.getElementById("completedActivities");

const nextActivityTitle =
    document.getElementById("nextActivityTitle");

const nextActivityTime =
    document.getElementById("nextActivityTime");

const nextActivityCategory =
    document.getElementById("nextActivityCategory");

const activitiesContainer =
    document.getElementById("activitiesContainer");

const addActivityBtn =
    document.getElementById("addActivityBtn");

const activityModal =
    document.getElementById("activityModal");

const closeModal =
    document.getElementById("closeModal");

const activityForm =
    document.getElementById("activityForm");

// =====================================
// LOCAL STORAGE
// =====================================

let activities =
    JSON.parse(
        localStorage.getItem("activities")
    ) || [];

// =====================================
// INICIO
// =====================================

initialize();

function initialize() {

    updateGreeting();

    updateCurrentDate();

    renderActivities();

    updateDashboard();
}

// =====================================
// SALUDO
// =====================================

function updateGreeting() {

    const hour =
        new Date().getHours();

    let message =
        "👋 Hola Jose";

    if (hour < 12) {

        message =
            "☀️ Buenos días, Jose";

    } else if (hour < 19) {

        message =
            "🌤️ Buenas tardes, Jose";

    } else {

        message =
            "🌙 Buenas noches, Jose";
    }

    greeting.textContent =
        message;
}

// =====================================
// FECHA
// =====================================

function updateCurrentDate() {

    const today =
        new Date();

    const options = {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric"
    };

    currentDate.textContent =
        today.toLocaleDateString(
            "es-ES",
            options
        );
}

// =====================================
// MODAL
// =====================================

addActivityBtn.addEventListener(
    "click",
    () => {

        activityModal.classList.add(
            "active"
        );
    }
);

closeModal.addEventListener(
    "click",
    () => {

        activityModal.classList.remove(
            "active"
        );
    }
);

// =====================================
// CREAR ACTIVIDAD
// =====================================

activityForm.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();

        const activity = {

            id: Date.now(),

            title:
                document.getElementById(
                    "title"
                ).value,

            date:
                document.getElementById(
                    "date"
                ).value,

            startTime:
                document.getElementById(
                    "startTime"
                ).value,

            endTime:
                document.getElementById(
                    "endTime"
                ).value,

            category:
                document.getElementById(
                    "category"
                ).value,

            completed: false
        };

        activities.push(
            activity
        );

        saveActivities();

        renderActivities();

        updateDashboard();

        activityForm.reset();

        activityModal.classList.remove(
            "active"
        );
    }
);

// =====================================
// GUARDAR
// =====================================

function saveActivities() {

    localStorage.setItem(
        "activities",
        JSON.stringify(
            activities
        )
    );
}

// =====================================
// ACTIVIDADES
// =====================================

function renderActivities() {

    activitiesContainer.innerHTML =
        "";

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    const todaysActivities =
        activities.filter(
            activity =>
                activity.date === today
        );

    if (
        todaysActivities.length === 0
    ) {

        activitiesContainer.innerHTML =

        `
        <div class="message-card">
            <p>
                🎉 No tienes actividades para hoy
            </p>
        </div>
        `;

        return;
    }

    todaysActivities.sort(
        (a, b) =>
            a.startTime.localeCompare(
                b.startTime
            )
    );

    todaysActivities.forEach(
        activity => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "activity-card";

            card.innerHTML =

            `
            <h3>
                ${activity.title}
            </h3>

            <p>
                🕒
                ${activity.startTime}
                -
                ${activity.endTime}
            </p>

            <p>
                📌
                ${activity.category}
            </p>

            <button
                onclick="deleteActivity(${activity.id})"
                style="
                    margin-top:10px;
                    padding:8px 12px;
                    border:none;
                    border-radius:8px;
                    background:#ef4444;
                    color:white;
                    cursor:pointer;
                "
            >
                Eliminar
            </button>
            `;

            activitiesContainer.appendChild(
                card
            );
        }
    );
}

// =====================================
// ELIMINAR
// =====================================

function deleteActivity(id) {

    activities =
        activities.filter(
            activity =>
                activity.id !== id
        );

    saveActivities();

    renderActivities();

    updateDashboard();
}

// =====================================
// DASHBOARD
// =====================================

function updateDashboard() {

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    const todaysActivities =
        activities.filter(
            activity =>
                activity.date === today
        );

    totalActivities.textContent =
        todaysActivities.length;

    pendingActivities.textContent =
        todaysActivities.length;

    completedActivities.textContent =
        0;

    updateNextActivity(
        todaysActivities
    );
}

// =====================================
// PROXIMA ACTIVIDAD
// =====================================

function updateNextActivity(
    todaysActivities
) {

    if (
        todaysActivities.length === 0
    ) {

        nextActivityTitle.textContent =
            "🎉 No tienes actividades";

        nextActivityTime.textContent =
            "Sin eventos programados";

        nextActivityCategory.textContent =
            "Disfruta tu día";

        return;
    }

    todaysActivities.sort(
        (a, b) =>
            a.startTime.localeCompare(
                b.startTime
            )
    );

    const next =
        todaysActivities[0];

    nextActivityTitle.textContent =
        next.title;

    nextActivityTime.textContent =
        `${next.startTime} - ${next.endTime}`;

    nextActivityCategory.textContent =
        next.category;
}
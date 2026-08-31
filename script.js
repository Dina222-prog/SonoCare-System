document.addEventListener("DOMContentLoaded", function () {

    flatpickr("#appointmentDate", {
        dateFormat: "d/m/Y",
        altInput: true,
        altFormat: "F j, Y",
        allowInput: true
    });

    flatpickr("#appointmentTime", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
        time_24hr: false,
        allowInput: true
    });

    const form = document.getElementById("appointmentForm");

    const patientName = document.getElementById("patientName");
    const patientId = document.getElementById("patientId");
    const examType = document.getElementById("examType");
    const appointmentDate = document.getElementById("appointmentDate");
    const appointmentTime = document.getElementById("appointmentTime");
    const appointmentStatus = document.getElementById("appointmentStatus");

    const tableBody = document.getElementById("appointmentsTableBody");
    const searchInput = document.getElementById("searchInput");

    const totalAppointments = document.getElementById("totalAppointments");
    const scheduledAppointments = document.getElementById("scheduledAppointments");
    const completedAppointments = document.getElementById("completedAppointments");
    const cancelledAppointments = document.getElementById("cancelledAppointments");

    const messageBox = document.getElementById("messageBox");

    let appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    let editIndex = null;


    function saveAppointments() {

        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );
    }


    function showMessage(message) {

        messageBox.textContent = message;

        messageBox.className =
            "message-box message-success";

        setTimeout(function () {

            messageBox.className = "message-box";
            messageBox.textContent = "";

        }, 2500);
    }


    function updateDashboard() {

        totalAppointments.textContent =
            appointments.length;

        scheduledAppointments.textContent =
            appointments.filter(
                appointment =>
                    appointment.status === "Scheduled"
            ).length;

        completedAppointments.textContent =
            appointments.filter(
                appointment =>
                    appointment.status === "Completed"
            ).length;

        cancelledAppointments.textContent =
            appointments.filter(
                appointment =>
                    appointment.status === "Cancelled"
            ).length;
    }


    function displayAppointments(data = appointments) {

        tableBody.innerHTML = "";

        data.forEach(function (appointment) {

            const realIndex =
                appointments.indexOf(appointment);

            const row =
                document.createElement("tr");

            let statusClass =
                "status-scheduled";

            if (appointment.status === "Completed") {
                statusClass =
                    "status-completed";
            }

            if (appointment.status === "Cancelled") {
                statusClass =
                    "status-cancelled";
            }

            row.innerHTML = `
                <td>${appointment.name}</td>
                <td>${appointment.id}</td>
                <td>${appointment.exam}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>

                <td>
                    <span class="status ${statusClass}">
                        ${appointment.status}
                    </span>
                </td>

                <td>
                    <button
                        class="edit-btn"
                        onclick="editAppointment(${realIndex})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteAppointment(${realIndex})">
                        Delete
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        updateDashboard();
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const newAppointment = {

            name:
                patientName.value.trim(),

            id:
                patientId.value.trim(),

            exam:
                examType.value,

            date:
                appointmentDate.value,

            time:
                appointmentTime.value,

            status:
                appointmentStatus.value
        };


        if (editIndex === null) {

            appointments.push(newAppointment);

            showMessage(
                "Appointment saved successfully."
            );

        } else {

            appointments[editIndex] =
                newAppointment;

            editIndex = null;

            form.querySelector(
                "button[type='submit']"
            ).textContent =
                "Save Appointment";

            showMessage(
                "Appointment updated successfully."
            );
        }


        saveAppointments();

        form.reset();

        displayAppointments();

    });


    window.deleteAppointment =
        function (index) {

            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this appointment?"
                );

            if (confirmDelete) {

                appointments.splice(
                    index,
                    1
                );

                saveAppointments();

                displayAppointments();

                showMessage(
                    "Appointment deleted successfully."
                );
            }
        };


    window.editAppointment =
        function (index) {

            const appointment =
                appointments[index];

            patientName.value =
                appointment.name;

            patientId.value =
                appointment.id;

            examType.value =
                appointment.exam;

            appointmentDate.value =
                appointment.date;

            appointmentTime.value =
                appointment.time;

            appointmentStatus.value =
                appointment.status;

            editIndex =
                index;

            form.querySelector(
                "button[type='submit']"
            ).textContent =
                "Update Appointment";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };


    searchInput.addEventListener(
        "input",
        function () {

            const searchValue =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const filteredAppointments =
                appointments.filter(
                    function (appointment) {

                        return (

                            appointment.name
                                .toLowerCase()
                                .includes(searchValue)

                            ||

                            appointment.id
                                .toLowerCase()
                                .includes(searchValue)

                        );
                    }
                );

            displayAppointments(
                filteredAppointments
            );
        }
    );


    displayAppointments();

});
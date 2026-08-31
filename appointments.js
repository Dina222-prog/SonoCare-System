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

    const appointmentForm =
        document.getElementById("appointmentForm");

    const patientIdSearch =
        document.getElementById("patientIdSearch");

    const selectedPatientName =
        document.getElementById("selectedPatientName");

    const findPatientBtn =
        document.getElementById("findPatientBtn");

    const patientSelect =
        document.getElementById("patientSelect");

    const examType =
        document.getElementById("examType");

    const appointmentDate =
        document.getElementById("appointmentDate");

    const appointmentTime =
        document.getElementById("appointmentTime");

    const appointmentStatus =
        document.getElementById("appointmentStatus");

    const appointmentSubmitButton =
        document.getElementById("appointmentSubmitButton");

    const appointmentSearch =
        document.getElementById("appointmentSearch");

    const appointmentsTableBody =
        document.getElementById("appointmentsTableBody");

    const appointmentMessage =
        document.getElementById("appointmentMessage");


    let patients =
        JSON.parse(localStorage.getItem("patients")) || [];

    let appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    let editIndex = null;


    function loadPatients() {

        patientSelect.innerHTML =
            '<option value="">Select Patient</option>';

        patients.forEach(function (patient, index) {

            const option =
                document.createElement("option");

            option.value = index;

            option.textContent =
                `${patient.name} - ${patient.id}`;

            patientSelect.appendChild(option);
        });
    }


    function findPatientById() {

        const enteredId =
            patientIdSearch.value
                .trim()
                .toLowerCase();

        if (enteredId === "") {

            alert("Please enter a Patient ID.");

            return;
        }


        const patientIndex =
            patients.findIndex(function (patient) {

                return patient.id
                    .toLowerCase() === enteredId;
            });


        if (patientIndex === -1) {

            selectedPatientName.value = "";

            patientSelect.value = "";

            alert("Patient not found.");

            return;
        }


        const patient =
            patients[patientIndex];

        selectedPatientName.value =
            patient.name;

        patientSelect.value =
            patientIndex;
    }


    findPatientBtn.addEventListener(
        "click",
        findPatientById
    );


    patientIdSearch.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                findPatientById();
            }
        }
    );


    patientSelect.addEventListener(
        "change",
        function () {

            if (patientSelect.value === "") {

                selectedPatientName.value = "";
                patientIdSearch.value = "";

                return;
            }

            const patient =
                patients[patientSelect.value];

            selectedPatientName.value =
                patient.name;

            patientIdSearch.value =
                patient.id;
        }
    );


    function saveAppointments() {

        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );
    }


    function showMessage(message) {

        appointmentMessage.textContent =
            message;

        appointmentMessage.className =
            "message-box message-success";

        setTimeout(function () {

            appointmentMessage.className =
                "message-box";

            appointmentMessage.textContent =
                "";

        }, 2500);
    }


    function displayAppointments(data = appointments) {

        appointmentsTableBody.innerHTML = "";


        if (data.length === 0) {

            appointmentsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-message">
                        No appointments found.
                    </td>
                </tr>
            `;

            return;
        }


        data.forEach(function (appointment) {

            const realIndex =
                appointments.indexOf(appointment);

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


            const row =
                document.createElement("tr");


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


            appointmentsTableBody.appendChild(row);
        });
    }


    appointmentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            let selectedPatient = null;


            if (patientSelect.value !== "") {

                selectedPatient =
                    patients[patientSelect.value];

            } else {

                const enteredId =
                    patientIdSearch.value
                        .trim()
                        .toLowerCase();


                selectedPatient =
                    patients.find(function (patient) {

                        return patient.id
                            .toLowerCase() === enteredId;
                    });
            }


            if (!selectedPatient) {

                alert(
                    "Please find or select a patient first."
                );

                return;
            }


            const newAppointment = {

                name:
                    selectedPatient.name,

                id:
                    selectedPatient.id,

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

                appointments.push(
                    newAppointment
                );

                showMessage(
                    "Appointment saved successfully."
                );

            } else {

                appointments[editIndex] =
                    newAppointment;

                editIndex = null;

                appointmentSubmitButton.textContent =
                    "Save Appointment";

                showMessage(
                    "Appointment updated successfully."
                );
            }


            saveAppointments();

            appointmentForm.reset();

            selectedPatientName.value = "";

            patientIdSearch.value = "";

            patientSelect.value = "";

            displayAppointments();

        }
    );


    window.editAppointment =
        function (index) {

            const appointment =
                appointments[index];


            const patientIndex =
                patients.findIndex(
                    function (patient) {

                        return patient.id ===
                            appointment.id;
                    }
                );


            if (patientIndex !== -1) {

                patientSelect.value =
                    patientIndex;

                selectedPatientName.value =
                    patients[patientIndex].name;

                patientIdSearch.value =
                    patients[patientIndex].id;
            }


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


            appointmentSubmitButton.textContent =
                "Update Appointment";


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };


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


    appointmentSearch.addEventListener(
        "input",
        function () {

            const searchValue =
                appointmentSearch.value
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


    loadPatients();

    displayAppointments();

});
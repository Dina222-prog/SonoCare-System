document.addEventListener("DOMContentLoaded", function () {

    const patientForm =
        document.getElementById("patientForm");

    const patientId =
        document.getElementById("patientId");

    const patientName =
        document.getElementById("patientName");

    const patientAge =
        document.getElementById("patientAge");

    const patientGender =
        document.getElementById("patientGender");

    const patientPhone =
        document.getElementById("patientPhone");

    const patientSearch =
        document.getElementById("patientSearch");

    const patientsTableBody =
        document.getElementById("patientsTableBody");

    const patientMessage =
        document.getElementById("patientMessage");

    const patientSubmitButton =
        document.getElementById("patientSubmitButton");


    let patients =
        JSON.parse(localStorage.getItem("patients")) || [];

    let editIndex = null;


    function savePatients() {

        localStorage.setItem(
            "patients",
            JSON.stringify(patients)
        );
    }


    function showPatientMessage(message) {

        patientMessage.textContent = message;

        patientMessage.className =
            "message-box message-success";

        setTimeout(function () {

            patientMessage.className =
                "message-box";

            patientMessage.textContent = "";

        }, 2500);
    }


    function displayPatients(data = patients) {

        patientsTableBody.innerHTML = "";

        if (data.length === 0) {

            patientsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-message">
                        No patients found.
                    </td>
                </tr>
            `;

            return;
        }


        data.forEach(function (patient) {

            const realIndex =
                patients.indexOf(patient);

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.phone}</td>

                <td>
                    <button
                        class="edit-btn"
                        onclick="editPatient(${realIndex})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deletePatient(${realIndex})">
                        Delete
                    </button>
                </td>
            `;

            patientsTableBody.appendChild(row);
        });
    }


    patientForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const newPatient = {

                id:
                    patientId.value.trim(),

                name:
                    patientName.value.trim(),

                age:
                    patientAge.value,

                gender:
                    patientGender.value,

                phone:
                    patientPhone.value.trim()
            };


            const duplicatePatient =
                patients.some(function (patient, index) {

                    return (
                        patient.id.toLowerCase() ===
                            newPatient.id.toLowerCase()

                        &&

                        index !== editIndex
                    );
                });


            if (duplicatePatient) {

                alert(
                    "A patient with this ID already exists."
                );

                return;
            }


            if (editIndex === null) {

                patients.push(newPatient);

                showPatientMessage(
                    "Patient saved successfully."
                );

            } else {

                patients[editIndex] =
                    newPatient;

                editIndex = null;

                patientSubmitButton.textContent =
                    "Save Patient";

                showPatientMessage(
                    "Patient updated successfully."
                );
            }


            savePatients();

            patientForm.reset();

            displayPatients();

        }
    );


    window.editPatient =
        function (index) {

            const patient =
                patients[index];

            patientId.value =
                patient.id;

            patientName.value =
                patient.name;

            patientAge.value =
                patient.age;

            patientGender.value =
                patient.gender;

            patientPhone.value =
                patient.phone;

            editIndex =
                index;

            patientSubmitButton.textContent =
                "Update Patient";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };


    window.deletePatient =
        function (index) {

            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this patient?"
                );

            if (confirmDelete) {

                patients.splice(
                    index,
                    1
                );

                savePatients();

                displayPatients();

                showPatientMessage(
                    "Patient deleted successfully."
                );
            }
        };


    patientSearch.addEventListener(
        "input",
        function () {

            const searchValue =
                patientSearch.value
                    .trim()
                    .toLowerCase();

            const filteredPatients =
                patients.filter(
                    function (patient) {

                        return (

                            patient.name
                                .toLowerCase()
                                .includes(searchValue)

                            ||

                            patient.id
                                .toLowerCase()
                                .includes(searchValue)

                        );
                    }
                );

            displayPatients(
                filteredPatients
            );
        }
    );


    displayPatients();

});
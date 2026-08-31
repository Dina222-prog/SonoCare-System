document.addEventListener("DOMContentLoaded", function () {

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];


    const totalAppointments =
        document.getElementById("totalAppointments");

    const scheduledAppointments =
        document.getElementById("scheduledAppointments");

    const completedAppointments =
        document.getElementById("completedAppointments");

    const cancelledAppointments =
        document.getElementById("cancelledAppointments");

    const dashboardAppointments =
        document.getElementById("dashboardAppointments");


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


    const recentAppointments =
        appointments.slice(-5).reverse();


    dashboardAppointments.innerHTML = "";


    if (recentAppointments.length === 0) {

        dashboardAppointments.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No appointments available.
                </td>
            </tr>
        `;

        return;
    }


    recentAppointments.forEach(function (appointment) {

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

        `;


        dashboardAppointments.appendChild(row);

    });

});
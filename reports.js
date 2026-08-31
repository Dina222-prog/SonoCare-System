document.addEventListener("DOMContentLoaded", function () {

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    const reportTotal =
        document.getElementById("reportTotal");

    const reportScheduled =
        document.getElementById("reportScheduled");

    const reportCompleted =
        document.getElementById("reportCompleted");

    const reportCancelled =
        document.getElementById("reportCancelled");

    const examReportBody =
        document.getElementById("examReportBody");

    const chartCanvas =
        document.getElementById("appointmentsChart");

    const pdfButton =
        document.getElementById("downloadPdf");


    // Counts
    const scheduledCount =
        appointments.filter(
            appointment => appointment.status === "Scheduled"
        ).length;

    const completedCount =
        appointments.filter(
            appointment => appointment.status === "Completed"
        ).length;

    const cancelledCount =
        appointments.filter(
            appointment => appointment.status === "Cancelled"
        ).length;


    // Dashboard
    reportTotal.textContent =
        appointments.length;

    reportScheduled.textContent =
        scheduledCount;

    reportCompleted.textContent =
        completedCount;

    reportCancelled.textContent =
        cancelledCount;


    // Examination summary
    const examCounts = {};

    appointments.forEach(function (appointment) {

        if (!appointment.exam) {
            return;
        }

        if (examCounts[appointment.exam]) {

            examCounts[appointment.exam]++;

        } else {

            examCounts[appointment.exam] = 1;
        }

    });


    const exams =
        Object.keys(examCounts);

    examReportBody.innerHTML = "";


    if (exams.length === 0) {

        examReportBody.innerHTML = `
            <tr>
                <td colspan="2" class="empty-message">
                    No report data available.
                </td>
            </tr>
        `;

    } else {

        exams.forEach(function (exam) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${exam}</td>
                <td>${examCounts[exam]}</td>
            `;

            examReportBody.appendChild(row);

        });

    }


    // Chart
    let appointmentsChart = null;

    if (chartCanvas && typeof Chart !== "undefined") {

        appointmentsChart =
            new Chart(chartCanvas, {

                type: "bar",

                data: {

                    labels: [
                        "Scheduled",
                        "Completed",
                        "Cancelled"
                    ],

                    datasets: [{
                        label: "Appointments",

                        data: [
                            scheduledCount,
                            completedCount,
                            cancelledCount
                        ],

                        backgroundColor: [
                            "#ffc107",
                            "#198754",
                            "#dc3545"
                        ],

                        borderRadius: 8
                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    animation: false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {
                                precision: 0
                            }

                        }

                    }

                }

            });

    }


    // PDF
    if (pdfButton) {

        pdfButton.addEventListener("click", function () {

            if (!window.jspdf) {

                alert("PDF library could not be loaded.");

                return;
            }


            const { jsPDF } =
                window.jspdf;

            const pdf =
                new jsPDF();


            // Title
            pdf.setFontSize(20);

            pdf.text(
                "SonoCare Report",
                20,
                20
            );


            pdf.setFontSize(11);

            pdf.text(
                "Ultrasound Information Management System",
                20,
                28
            );


            // Statistics
            pdf.setFontSize(12);

            pdf.text(
                "Total Appointments: " + appointments.length,
                20,
                45
            );

            pdf.text(
                "Scheduled: " + scheduledCount,
                20,
                55
            );

            pdf.text(
                "Completed: " + completedCount,
                20,
                65
            );

            pdf.text(
                "Cancelled: " + cancelledCount,
                20,
                75
            );


            // Examinations
            pdf.setFontSize(14);

            pdf.text(
                "Examinations Summary",
                20,
                92
            );


            pdf.setFontSize(11);

            let y = 104;


            if (exams.length === 0) {

                pdf.text(
                    "No examination data available.",
                    20,
                    y
                );

            } else {

                exams.forEach(function (exam) {

                    pdf.text(
                        exam + ": " + examCounts[exam],
                        20,
                        y
                    );

                    y += 8;

                });

            }


            // Chart
            if (chartCanvas) {

                const chartImage =
                    chartCanvas.toDataURL(
                        "image/png",
                        1.0
                    );


                // New page for chart
                pdf.addPage();


                pdf.setFontSize(16);

                pdf.text(
                    "Appointments Chart",
                    20,
                    20
                );


                pdf.addImage(
                    chartImage,
                    "PNG",
                    20,
                    30,
                    170,
                    90
                );

            }


            pdf.save(
                "SonoCare_Report.pdf"
            );

        });

    }

});
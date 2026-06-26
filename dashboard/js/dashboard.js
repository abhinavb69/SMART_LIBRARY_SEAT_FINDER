// ===============================
// Smart Library Seat Finder
// dashboard.js
// ===============================

// References
const seatsRef = firebase.database().ref("librarySeats");
const summaryRef = firebase.database().ref("summary");

// -----------------------------
// Update Summary Cards
// -----------------------------
summaryRef.on("value", (snapshot) => {

    const data = snapshot.val();

    if (!data) return;

    document.getElementById("totalSeats").innerHTML = data.totalSeats;
    document.getElementById("availableSeats").innerHTML = data.availableSeats;
    document.getElementById("occupiedSeats").innerHTML = data.occupiedSeats;

    let percent = 0;

    if (data.totalSeats > 0) {
        percent = Math.round((data.occupiedSeats / data.totalSeats) * 100);
    }

    document.getElementById("occupancy").innerHTML = percent + "%";

    updateTime();

});

// -----------------------------
// Update Seat Status
// -----------------------------
seatsRef.on("value", (snapshot) => {

    const seats = snapshot.val();

    if (!seats) return;

    updateSeat("A1", seats.A1);
    updateSeat("A2", seats.A2);
    updateSeat("A3", seats.A3);
    updateSeat("A4", seats.A4);

});

// -----------------------------
// Update Individual Seat
// -----------------------------
function updateSeat(id, status) {

    const seat = document.getElementById(id);
    const text = document.getElementById(id + "status");

    // Remove previous classes
    seat.classList.remove(
        "available",
        "occupied",
        "maintenance",
        "reserved"
    );

    if (status === "occupied") {

        seat.classList.add("occupied");
        text.innerHTML = "Occupied";

    }

    else if (status === "maintenance") {

        seat.classList.add("maintenance");
        text.innerHTML = "Maintenance";

    }

    else if (status === "reserved") {

        seat.classList.add("reserved");
        text.innerHTML = "Reserved";

    }

    else {

        seat.classList.add("available");
        text.innerHTML = "Available";

    }

}

// -----------------------------
// Last Updated Time
// -----------------------------
function updateTime() {

    const now = new Date();

    document.getElementById("lastUpdated").innerHTML =
        now.toLocaleTimeString();

}

// -----------------------------
// Firebase Connection Status
// -----------------------------
firebase.database().ref(".info/connected").on("value", function(snapshot) {

    const connected = snapshot.val();

    const dot = document.getElementById("connectionDot");
    const text = document.getElementById("connectionText");
    const status = document.getElementById("firebaseStatus");

    if (connected) {

        dot.style.background = "#2ecc71";

        text.innerHTML = "Connected";

        status.innerHTML = "🟢 Connected";

    }

    else {

        dot.style.background = "#e74c3c";

        text.innerHTML = "Disconnected";

        status.innerHTML = "🔴 Disconnected";

    }

});
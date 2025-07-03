// select all Dom documents
const logBtn = document.getElementById("logTab");
const dashboardBtn = document.getElementById("dashboardTab");
const historyBtn = document.getElementById("historyTab");
const logSection = document.getElementById("logSection");
const dashboardSection = document.getElementById("dashboardSection");
const historySection = document.getElementById("historySection");
const logForm = document.getElementById("logForm");
const toast = document.getElementById("toast");
const formError = document.getElementById("formError");
const submitBtn = document.getElementById("submitBtn");

// select all input fields
const machineInput = document.getElementById("machine");
const reasonInput = document.getElementById("reason");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
const notesInput = document.getElementById("notes");
const searchInput = document.getElementById("searchInput");

// handel event and switch between tabs

const  showToast = function(message = "Information successfully submitted.") {
  toast.textContent = "✅ " + message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  // Auto-hide the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 500); // fades out before hiding
  }, 3000);
}





const showSection = function (activeSection, activeButton) {
  logSection.hidden = true;
  dashboardSection.hidden = true;
  historySection.hidden = true;

  // Remove active class from all buttons
  logBtn.classList.remove("active");
  dashboardBtn.classList.remove("active");
  historyBtn.classList.remove("active");

  // Show the active section
  activeSection.hidden = false;

  // Add active class to clicked button
  activeButton.classList.add("active");
};
logBtn.addEventListener("click", () => showSection(logSection, logBtn));
dashboardBtn.addEventListener("click", () =>
  showSection(dashboardSection, dashboardBtn)
);
historyBtn.addEventListener("click", () =>
  showSection(historySection, historyBtn)
);

// validate form inputs and enable/disable submit button
// const validateForm = function() {
//   const machine = machineInput.value.trim();
//   const reason = reasonInput.value.trim();
//   const startTime = new Date(startTimeInput.value);
//   const endTime = new Date(endTimeInput.value);

//   // Basic checks
//   if (!machine || !reason || !startTimeInput.value || !endTimeInput.value) {
//     submitBtn.disabled = true;
//     return;
//   }

//   // Time logic
//   if (startTime >= endTime) {
//     submitBtn.disabled = true;
//     return;
//   }

//   // ✅ Everything is valid
//   submitBtn.disabled = false;
// }
// // Add event listeners to inputs to validate form
// // console.log(machineInput, reasonInput, startTimeInput, endTimeInput);
// const inputs = [machineInput, reasonInput, startTimeInput, endTimeInput];
// inputs.forEach(input => { 
//   input.addEventListener("input", validateForm);
// });










logForm.addEventListener("submit", function (e) {
  e.preventDefault(); // prevents reload

  
  // 1. Get input values
  const machine = machineInput.value.trim();
  const reason = reasonInput.value.trim();
  const startTime = new Date(startTimeInput.value);
  const endTime = new Date(endTimeInput.value);
  const notes = notesInput.value.trim();

  // 2. VALIDATION — check for empty fields
  if (!machine || !reason || !startTimeInput.value || !endTimeInput.value) {
    formError.textContent = "🚫 Please fill in all required fields.";
    formError.classList.remove("hidden");
    return; // ⛔ stop everything
  }

  // 3. VALIDATION — start must be before end
  if (startTime >= endTime) {
    formError.textContent = "⏱️ Start time must be before end time.";
    formError.classList.remove("hidden");
    return; // ⛔ stop everything
  }

  // 4. VALIDATION PASSED — hide error
  formError.textContent = "";
  formError.classList.add("hidden");

  // 5. Calculate duration
  const durationMinutes = Math.round((endTime - startTime) / 60000); // in minutes
  if (durationMinutes <= 0) {
    formError.textContent = "⏱️ Duration must be greater than 0 minutes.";
    formError.classList.remove("hidden");
    return;
  }




















    // ✅ Validation Logic
  // if (!machine || !reason || !startTimeInput.value || !endTimeInput.value) {
  //   formError.textContent = "Please fill in all required fields.";
  //   return;
  // }

  // if (startTime >= endTime) {
  //   formError.textContent = "Start time must be before end time.";
  //   return;
  // }

  // // If passed all checks, clear any error
  // formError.textContent = "";
  // // 2. Calculate duration from start & end

  // const durationMinutes = Math.round((endTime - startTime) / 60000); // in minutes
  // // Check if duration is valid
  // if (durationMinutes <= 0) {
  //   alert("Duration must be greater than 0 minutes.");
  //   return; // stop the function
  // }
  // 3. Create a downtime object
  const entry = {
    machine,
    reason,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    duration: durationMinutes,
    notes,
    createdAt: new Date().toISOString(),
  };

  // 4. Save it to an array or localStorage
  let downtimeHistory =
    JSON.parse(localStorage.getItem("downtimeHistory")) || [];
  downtimeHistory.push(entry);

  // 5. Render it as a card inside #historyCards
  localStorage.setItem("downtimeHistory", JSON.stringify(downtimeHistory));

  renderHistory();

 

  logForm.reset();
   showToast(); 
  // 7. Show the history section
//   showSection(historySection, historyBtn);
});
const renderHistory = function (filterText = "") {
  const historyCards = document.getElementById("historyCards");
  historyCards.innerHTML = ""; // Clear existing cards

  let downtimeHistory =
    JSON.parse(localStorage.getItem("downtimeHistory")) || [];

//   if (downtimeHistory.length === 0) {
//     historyCards.innerHTML = "<p>No downtime entries found.</p>";
//     return;
//   }
    // Filter entries based on search input
     const filteredHistory = downtimeHistory.filter(entry =>
    entry.machine.toLowerCase().includes(filterText.toLowerCase())
  );

  if (filteredHistory.length === 0) {
    historyCards.innerHTML = "<p>No downtime entries found.</p>";
    return;
  }


  filteredHistory.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
  <h3><i class="fa fa-tools"></i>${entry.machine}</h3>
  <span class="tag">${entry.reason}</span>
    <div class="text-container">
  <div class="icon-text"><i class="fa fa-calendar"></i> <span><strong>Start:</strong> ${new Date(
    entry.startTime
  ).toLocaleString()}</span></div>
  <div class="icon-text"><i class="fa fa-calendar"></i> <span><strong>End:</strong> ${new Date(
    entry.endTime
  ).toLocaleString()}</span></div>
  <div class="icon-text"><i class="fa fa-clock"></i> <span class="duration">Duration: ${
    entry.duration
  }m</span></div>
  </div>
  <div class="icon-text"><i class="fa fa-sticky-note"></i> <span>${
    entry.notes || "No notes"
  }</span></div>
  <p class="timestamp">Logged on ${new Date(
    entry.createdAt
  ).toLocaleString()}</p>
  <button class="delete-btn" data-createdat="${entry.createdAt}">
  <i class="fa fa-trash"></i>
</button>

`;

    historyCards.appendChild(card);
  });
};
searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value;
  renderHistory(searchValue);
});

// Add event listener to delete button
// document.addEventListener("click", function (event) {
//   if (event.target.classList.contains("delete-btn")) {
//     const createdAt = event.target.getAttribute("data-createdat");
//     let downtimeHistory =
//       JSON.parse(localStorage.getItem("downtimeHistory")) || [];
//     downtimeHistory = downtimeHistory.filter(
//       (entry) => entry.createdAt !== createdAt
//     );
//     localStorage.setItem("downtimeHistory", JSON.stringify(downtimeHistory));
//     renderHistory();
//   }
// });
document.addEventListener("click", function (e) {
  if (e.target.closest(".delete-btn")) {
    const btn = e.target.closest(".delete-btn");
    const createdAt = btn.dataset.createdat;

    let downtimeHistory =
      JSON.parse(localStorage.getItem("downtimeHistory")) || [];
    const updatedHistory = downtimeHistory.filter(
      (entry) => entry.createdAt !== createdAt
    );
    localStorage.setItem("downtimeHistory", JSON.stringify(updatedHistory));
    renderHistory(searchInput.value); // update the screen
  }
});
renderHistory(); // Initial render
const mood = document.querySelectorAll("[data-mood]");
const selectionButton = document.querySelectorAll("[data-selection]");
const recordButton = document.getElementById("recordButton");
const messageLabel = document.getElementById("messageLabel");
const selectedTrendLabel = document.getElementById("selectedTrendLabel");
const dataViewDiv = document.getElementById("dataView");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const showTimelineDiv = document.getElementById("showTimelineDiv");

let selectedTrend;
let currentDate;

// let data = loadData();
let data = [
  { emoji: "😐", mood: "neutral", date: "2025-01-17" },
  { emoji: "😀", mood: "happy", date: "2025-01-18" },
  { emoji: "😟", mood: "worried", date: "2025-01-19" },
  { emoji: "😀", mood: "happy", date: "2025-01-20" },
  { emoji: "😞", mood: "sad", date: "2025-01-21" },
  { emoji: "🥳", mood: "party", date: "2025-01-22" },
  { emoji: "😐", mood: "neutral", date: "2025-01-23" },
  { emoji: "😀", mood: "happy", date: "2025-01-24" },
  { emoji: "😞", mood: "sad", date: "2025-01-25" },
  { emoji: "😟", mood: "worried", date: "2025-01-26" },
  { emoji: "😀", mood: "happy", date: "2025-01-27" },
  { emoji: "🥳", mood: "party", date: "2025-01-28" },
  { emoji: "😐", mood: "neutral", date: "2025-01-29" },
  { emoji: "😀", mood: "happy", date: "2025-01-30" },
  { emoji: "😞", mood: "sad", date: "2025-01-31" },
  { emoji: "😐", mood: "neutral", date: "2025-02-01" },
  { emoji: "😟", mood: "worried", date: "2025-02-02" },
  { emoji: "😀", mood: "happy", date: "2025-02-03" },
  { emoji: "😞", mood: "sad", date: "2025-02-04" },
  { emoji: "🥳", mood: "party", date: "2025-02-05" },
  { emoji: "😐", mood: "neutral", date: "2025-02-06" },
  { emoji: "😀", mood: "happy", date: "2025-02-07" },
  { emoji: "😟", mood: "worried", date: "2025-02-08" },
  { emoji: "😞", mood: "sad", date: "2025-02-09" },
  { emoji: "😀", mood: "happy", date: "2025-02-10" },
  { emoji: "😐", mood: "neutral", date: "2025-02-11" },
  { emoji: "🥳", mood: "party", date: "2025-02-12" },
  { emoji: "😀", mood: "happy", date: "2025-02-13" },
  { emoji: "😟", mood: "worried", date: "2025-02-14" },
  { emoji: "😞", mood: "sad", date: "2025-02-15" },
  { emoji: "😀", mood: "happy", date: "2025-02-16" },
  { emoji: "😐", mood: "neutral", date: "2025-02-17" },
  { emoji: "🥳", mood: "party", date: "2025-02-18" },
  { emoji: "😟", mood: "worried", date: "2025-02-19" },
  { emoji: "😞", mood: "sad", date: "2025-02-20" },
  { emoji: "😀", mood: "happy", date: "2025-02-21" },
  { emoji: "😐", mood: "neutral", date: "2025-02-22" },
  { emoji: "😀", mood: "happy", date: "2025-02-23" },
  { emoji: "😟", mood: "worried", date: "2025-02-24" },
  { emoji: "🥳", mood: "party", date: "2025-02-25" },
  { emoji: "😞", mood: "sad", date: "2025-02-26" },
  { emoji: "😐", mood: "neutral", date: "2025-02-27" },
  { emoji: "😀", mood: "happy", date: "2025-02-28" },
  { emoji: "😟", mood: "worried", date: "2025-03-01" },
  { emoji: "🥳", mood: "party", date: "2025-03-02" },
  { emoji: "😞", mood: "sad", date: "2025-03-03" },
  { emoji: "😀", mood: "happy", date: "2025-03-04" },
  { emoji: "😐", mood: "neutral", date: "2025-03-05" },
  { emoji: "😟", mood: "worried", date: "2025-03-06" },
  { emoji: "🥳", mood: "party", date: "2025-03-07" },
  { emoji: "😞", mood: "sad", date: "2025-03-08" },
  { emoji: "😀", mood: "happy", date: "2025-03-09" },
  { emoji: "😐", mood: "neutral", date: "2025-03-10" },
  { emoji: "😟", mood: "worried", date: "2025-03-11" },
  { emoji: "🥳", mood: "party", date: "2025-03-12" },
  { emoji: "😞", mood: "sad", date: "2025-03-13" },
  { emoji: "😀", mood: "happy", date: "2025-03-14" },
  { emoji: "😐", mood: "neutral", date: "2025-03-15" },
  { emoji: "😟", mood: "worried", date: "2025-03-16" },
  { emoji: "😀", mood: "happy", date: "2025-03-17" },
  { emoji: "😀", mood: "happy", date: "2025-03-18" },
];

//load data from local storage
function loadData() {
  return JSON.parse(localStorage.getItem("moodData")) || [];
}

// store data to local storage
function storeData() {
  localStorage.setItem("moodData", JSON.stringify(data));
}

//emojis selections
[...mood].forEach((selectedMood) => {
  selectedMood.addEventListener("click", function () {
    // making sure other mood do not have below classes
    [...mood].forEach((m) => {
      m.classList.remove(
        "border-2",
        "rounded-full",
        "border-green-500",
        "p-1",
        "selected"
      );
    });

    // Then, add classes to the clicked mood
    this.classList.add(
      "border-2",
      "rounded-full",
      "border-green-500",
      "p-1",
      "selected"
    );
  });
});

// store data
recordButton.addEventListener("click", function () {
  const selectedElement = document.querySelector(".selected");

  const emoji = selectedElement.textContent;
  const mood = selectedElement.dataset.mood;

  //get today's date and store data into localstorage
  let now = new Date();
  const today = now.toISOString().split("T")[0];

  //   check if data already recorded for today
  const i = data.findIndex((obj) => obj["date"] === today);
  if (i > -1) {
    // show error
    messageLabel.classList.remove("hidden");

    setTimeout(() => {
      messageLabel.classList.add("hidden");
    }, 2000);

    return;
  }

  //save data
  data = [...data, { emoji, mood, date: today }];
  storeData();
});

selectionButton.forEach((button) => {
  button.addEventListener("click", function () {
    // making sure other button not selected
    [...selectionButton].forEach((m) => {
      m.classList.add("border-dashed");
    });

    this.classList.remove("border-dashed");
    selectedTrend = this.dataset.selection;

    showTimelineDiv.classList.remove("hidden");

    showSelectedTrend();
  });
});

function showSelectedTrend() {
  selectedTrendLabel.textContent = `${selectedTrend}'s Data`;
  disableButton(btnNext);
  switch (selectedTrend) {
    case "Day":
      const today = getTodayDate();
      currentDate = today;
      showDayData();
      break;
    case "Week":
      showWeekData();
      break;
    case "Month":
      showMonthData();
      break;
    default:
      console.log(`Something wrong with Selected trend ${selectedTrend}`);
  }
}

btnPrev.addEventListener("click", function () {
  if (selectedTrend === "Day") {
    if (this.classList.contains("disable")) return;
    handleDayNavigation(-1);
  }
});

btnNext.addEventListener("click", function () {
  if (selectedTrend === "Day") {
    if (btnNext.classList.contains("disable")) return;
    handleDayNavigation(1);
    //disbale bext button if current date is today
    const today = getTodayDate();
    if (currentDate === today) disableButton(btnNext);

    //enable prev button incase it is disabled
    enableButton(btnPrev);
  }
});

function showDayData(day = "") {
  // if date is not provided then set today as day
  !day ? (day = getTodayDate()) : null;

  // find data from storage(array)
  const foundedData = data.filter((obj) => obj["date"] === day);

  displayData(foundedData);
}
function showWeekData() {}
function showMonthData() {}

function displayData(arr) {
  dataViewDiv.innerHTML = "";
  arr.map((data) => {
    createLabel(data["date"], data.mood, data.emoji);
  });
}

function findDataByOffset(dateStr, offset) {
  const targetDate = new Date(dateStr);
  targetDate.setDate(targetDate.getDate() + offset);

  const formatted = targetDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD

  const dataToReturn = {
    dataArray: data.filter((entry) => entry.date === formatted),
    newDate: formatted,
  };
  return dataToReturn;
}

function handleDayNavigation(offset) {
  if (selectedTrend !== "Day") return;

  //if current date istoday and try to increase date then just return
  const today = getTodayDate();
  if (offset === 1 && currentDate === today) return;

  const { dataArray, newDate } = findDataByOffset(currentDate, offset);
  currentDate = newDate;

  //if noData found then display message
  if (dataArray.length <= 0) {
    dataViewDiv.innerHTML = "";
    const label = document.createElement("label");
    label.textContent = "No more data available";
    dataViewDiv.appendChild(label);
    disableButton(btnPrev);
    return;
  }

  //enable next button if selected date is not  today
  if (currentDate !== today) enableButton(btnNext);

  displayData(dataArray);
}

function getTodayDate() {
  let now = new Date();
  return now.toISOString().split("T")[0];
}

function disableButton(element) {
  element.classList.remove("cursor-pointer");
  element.classList.add("disable", "opacity-50", "cursor-not-allowed");
}
function enableButton(element) {
  element.classList.add("cursor-pointer");
  element.classList.remove("disable", "opacity-50", "cursor-not-allowed");
}

function createLabel(dateToDisplay, mood, emoji) {
  const label = document.createElement("label");

  label.classList = "text-gray-500 border-b-1 border-zinc-300";
  label.textContent = `${dateToDisplay} - ${mood}  ${emoji}`;

  dataViewDiv.appendChild(label);
}

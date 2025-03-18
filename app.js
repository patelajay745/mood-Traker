const mood = document.querySelectorAll("[data-mood]");
const selectionButton = document.querySelectorAll("[data-selection]");
const recordButton = document.getElementById("recordButton");
const messageLabel = document.getElementById("messageLabel");
const selectedTrendLabel = document.getElementById("selectedTrendLabel");
const dataViewDiv = document.getElementById("dataView");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const showTimelineDiv = document.getElementById("showTimelineDiv");
const btnNavigationDiv = document.getElementById("btnNavigationDiv");

let selectedTrend;
let currentDate;
let currentMonth;

let data;

window.addEventListener("load", async (event) => {
  await loadData();
});

//load data from local storage
async function loadData() {
  const response = await fetch("./data.json");
  const dataFromFile = await response.json();

  data = JSON.parse(localStorage.getItem("moodData")) || dataFromFile;
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
  enableButton(btnPrev);
  const today = getTodayDate();
  switch (selectedTrend) {
    case "Day":
      currentDate = today;
      showNextPrevButton();
      showDayData();
      break;
    case "Week":
      showWeekData(today);
      break;
    case "Month":
      currentMonth = getCurrentMonth();
      showMonthData();
      break;
    default:
      console.log(`Something wrong with Selected trend ${selectedTrend}`);
  }
}

btnPrev.addEventListener("click", function () {
  if (this.classList.contains("disable")) return;

  if (selectedTrend === "Day") {
    handleDayNavigation(-1);
  } else if (selectedTrend === "Week") {
    // logic for weekly data
    currentDate = nextExpectedDate(currentDate, -7);

    const { data: weeklyData, newCurrentDate } = getDataFromStartDate(
      currentDate,
      -7
    );

    displayData(weeklyData);

    //enable nextbutton
    const today = getTodayDate();
    if (currentDate !== today) enableButton(btnNext);

    // if last founded data is less then 7 that means it does not have enough data so disable prev button
    if (weeklyData.length < 7) {
      disableButton(btnPrev);
    }
  } else if (selectedTrend === "Month") {
    currentMonth = currentMonth - 1;
    const foundedData = getMonthData(currentMonth);

    displayData(foundedData.reverse());
    enableButton(btnNext);

    if (foundedData.length <= 0) {
      disableButton(btnPrev);
      showError("No Data Found");
    }
  }
});

btnNext.addEventListener("click", function () {
  if (btnNext.classList.contains("disable")) return;

  //enable prev button
  const today = getTodayDate();
  if (currentDate !== today) enableButton(btnPrev);

  if (selectedTrend === "Day") {
    handleDayNavigation(1);
    //disbale bext button if current date is today
    const today = getTodayDate();
    if (currentDate === today) {
      disableButton(btnNext);
      return;
    }

    //enable prev button incase it is disabled
    enableButton(btnPrev);
  } else if (selectedTrend === "Week") {
    const { data: weeklyData, newCurrentDate } = getDataFromStartDate(
      currentDate,
      7
    );

    currentDate = nextExpectedDate(currentDate, 7);

    displayData(weeklyData);

    //if currentdate is today then disable next button
    const today = getTodayDate();
    if (today === currentDate) disableButton(btnNext);
  } else if (selectedTrend === "Month") {
    enableButton(btnPrev);
    currentMonth = currentMonth + 1;
    const foundedData = getMonthData(currentMonth);

    displayData(foundedData.reverse());

    const thisMonth = getCurrentMonth();
    if (currentMonth === thisMonth) disableButton(btnNext);
  }
});

function showDayData(day = "") {
  // if date is not provided then set today as day
  !day ? (day = getTodayDate()) : null;

  // find data from storage(array)
  const foundedData = data.filter((obj) => obj["date"] === day);

  displayData(foundedData);
}
function showWeekData(startingDate) {
  //find last 7 data starting from today
  currentDate = startingDate;

  const { data: weeklyData, newCurrentDate } = getDataFromStartDate(
    currentDate,
    -7
  );

  displayData(weeklyData);
}
function showMonthData() {
  const foundedData = getMonthData(currentMonth);
  displayData(foundedData.reverse());
}

function displayData(arr) {
  dataViewDiv.innerHTML = "";
  arr.map((data) => {
    createLabel(data["date"], data.mood, data.emoji);
  });
}

function findDataByOffset(dateStr, offset) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const targetDate = new Date(year, month - 1, day); // month is 0-based

  targetDate.setDate(targetDate.getDate() + offset);

  const formatted = targetDate.toISOString().split("T")[0];

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

function getCurrentMonth() {
  const date = new Date();
  return date.getMonth() + 1;
}

function disableButton(element) {
  element.classList.remove("cursor-pointer");
  element.classList.add("disable", "opacity-50", "cursor-not-allowed");
}
function enableButton(element) {
  element.classList.add("cursor-pointer");
  element.classList.remove("disable", "opacity-50", "cursor-not-allowed");
}

function hideNextPrevButton() {
  btnPrev.classList.add("hidden");
  btnNext.classList.add("hidden");
  btnNavigationDiv.classList.add("justify-center");
}

function showNextPrevButton() {
  btnPrev.classList.remove("hidden");
  btnNext.classList.remove("hidden");
  btnNavigationDiv.classList.remove("justify-center");
}

function createLabel(dateToDisplay, mood, emoji) {
  const label = document.createElement("label");

  label.classList = "text-gray-500 border-b-1 border-zinc-300";
  label.textContent = `${dateToDisplay} - ${mood}  ${emoji}`;

  dataViewDiv.appendChild(label);
}

function getDataFromStartDate(startDateStr, numberOfDays) {
  const [year, month, day] = startDateStr.split("-").map(Number);
  const baseDate = new Date(year, month - 1, day); // The given date
  baseDate.setHours(0, 0, 0, 0);

  // Determine the range boundaries
  let rangeStart, rangeEnd;
  if (numberOfDays >= 0) {
    rangeStart = new Date(baseDate);
    rangeEnd = new Date(baseDate);
    rangeEnd.setDate(baseDate.getDate() + numberOfDays);
    rangeEnd.setHours(0, 0, 0, 0);
  } else {
    rangeEnd = new Date(baseDate);
    rangeStart = new Date(baseDate);
    rangeStart.setDate(baseDate.getDate() + numberOfDays); // numberOfDays is negative
    rangeStart.setHours(0, 0, 0, 0);
  }

  const foundedData = data.filter((obj) => {
    const entryDate = new Date(obj["date"]);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate >= rangeStart && entryDate < rangeEnd;
  });

  // Fix: Use rangeEnd instead of rangeStart for newCurrentDate
  let newCurrentDate = new Date(baseDate);
  newCurrentDate.setDate(baseDate.getDate() + numberOfDays);
  newCurrentDate.setHours(0, 0, 0, 0);
  newCurrentDate = newCurrentDate.toISOString().split("T")[0];

  return {
    data: foundedData,
    newCurrentDate,
  };
}

function nextExpectedDate(statringDate, numberOfDays) {
  const [year, month, day] = statringDate.split("-").map(Number);
  const targetDate = new Date(year, month - 1, day); // month is 0-based

  targetDate.setDate(targetDate.getDate() + numberOfDays);

  const formatted = targetDate.toISOString().split("T")[0];

  return formatted;
}

function getMonthData(month) {
  return data.filter((obj) => {
    const recordedDate = obj["date"];
    const recordedMonth = recordedDate.split("-")[1];

    if (Number(recordedMonth) === month) {
      return obj;
    }
  });
}
function showError(message) {
  const label = document.createElement("label");

  label.classList = "text-gray-500 border-b-1 border-zinc-300";
  label.textContent = message;

  dataViewDiv.appendChild(label);
}

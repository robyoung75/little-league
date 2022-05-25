// sorts batting average and chooses the highest batting ave
// accounts for ties in high batting average.
const battingAverages = (state) => {
  let batAveSort = [];
  let highBatAve = [];
  let evalStats = [];
  let evalSort = [];

  state.map((player) => {
    evalStats.push({
      firstName: player.firstName,
      lastName: player.lastName,
      number: player.number,
      battingAve: player.battingAve,
      onBasePercent: player.onBasePercent,
      oImage: player.oImage,
      dImage: player.dImage,
      OPS: player.OPS,
      SLG: player.SLG,
      evalScore:
        Math.round(Number(player.battingAve)) +
        Math.round(Number(player.OPS)) +
        Math.round(Number(player.SLG)),
    });
    return evalStats;
  });

  let sort = evalStats.sort(function (a, b) {
    const evalA = a.evalScore;
    const evalB = b.evalScore;
    return evalB - evalA;
  });

  evalSort = sort;
  // console.log(evalSort);
  // return evalSort;

  evalSort.map((batter) => {
    if (evalSort[0].evalScore === batter.evalScore) {
      // console.log(evalSort[0]);
      batAveSort.push(batter);
      highBatAve.push(batter);
      // console.log(batAveSort);
      // console.log(highBatAve);
    }
    return batAveSort;
  });

  if (batAveSort.length > 1) {
    let randomNumber = Math.floor(Math.random() * batAveSort.length);
    highBatAve.push(batAveSort[randomNumber]);
    // console.log(highBatAve);
  }

  return highBatAve;
};

// Overall player function for StoryReel
const getOverallPlayer = (state) => {
  let evalStats = [];
  let evalSort;

  state.map((player) => {
    evalStats.push({
      firstName: player.firstName,
      lastName: player.lastName,
      number: player.number,
      battingAve: player.battingAve,
      oImage: player.oImage,
      dImage: player.dImage,

      evalScore:
        Math.round(Number(player.hits)) +
        Math.round(Number(player.rbi)) +
        Math.round(Number(player.runs)) +
        Math.round(Number(player.onBasePercent)) -
        Math.round(Number(player.strikeouts)) * 5,
    });

    return evalStats;
  });

  let sort = evalStats.sort(function (a, b) {
    const evalA = a.evalScore;
    const evalB = b.evalScore;
    return evalB - evalA;
  });

  evalSort = sort;
  return evalSort;
};

// Pitcher of the week function for storyReel
const pitcherOfTheWeek = (state) => {
  let pitchersSort = [];
  let evalStats = [];
  let evalSort = [];

  state.forEach((player) => {
    if (player.era) {
      pitchersSort.push(player);
    }
  });

  pitchersSort.forEach((pitcher) => {
    evalStats.push({
      firstName: pitcher.firstName,
      lastName: pitcher.lastName,
      number: pitcher.number,
      era: pitcher.era,
      oImage: pitcher.oImage,
      dImage: pitcher.dImage,

      evalScore:
        Math.round(Number(pitcher.era)) -
        Math.round(Number(pitcher.inningsPitched)) -
        Math.round(Number(pitcher.gameSaves)) -
        Math.round(Number(pitcher.ks)) * 5 -
        Math.round(Number(pitcher.gameWins)) +
        Math.round(Number(pitcher.hitsAllowed)) +
        Math.round(Number(pitcher.runsAllowed)) +
        Math.round(Number(pitcher.walksAllowed)) * 5,
    });
  });

  let sortByEval = evalStats.sort((a, b) => {
    return a.evalScore - b.evalScore;
  });

  evalSort.push(sortByEval[0]);

  // console.log(pitchersSort);
  // console.log(evalStats);
  // console.log(evalSort);
  return evalSort;
};

// function to take user.uid and convert it to username. return the first half of
// an email upto the @ sign
const emailToUserName = (uid) => {
  for (let i = 0; i < uid.length; i++) {
    if (uid[i] == "@") {
      // console.log(uid.slice(0, i));
      return uid.slice(0, i);
    }
  }
};

//  CALENDAR HELPER FUNCTIONS

// returns year option for select dropdown
const loadYears = (start, end) => {
  let years = [];
  for (let i = start; i <= end; i++) {
    years.push(i);
  }
  return years;
};

// returns the days in a month for a given year
const daysInMonth = (monthIndex, year) => {
  // months are zero based with new Date hence month + 1
  return new Date(year, monthIndex + 1, 0).getDate();
};

// returns the first day of a month for a given year

const startOfMonthDay = (year, monthIndex) => {
  return new Date(year, monthIndex, 1).getDay();
};

// return the current month and year
const currentMonthAndYear = (monthsArr) => {
  const d = new Date();
  let month = monthsArr[d.getMonth()];
  let year = d.getFullYear();
  return { month: month, year: year };
};

// returns the current year

const currentYear = () => {
  const d = new Date();
  return d.getFullYear();
};

const monthlySchedule = (scheduleDataArr, dateObj) => {
  let schedule = [];
  scheduleDataArr.map((game) => {
    let dateString = game.date;
    let splitDateString = dateString.split(" ");
    let myMonth;

    if (dateObj.month.length > 3) {
      myMonth = dateObj.month.slice(0, 3);
    } else {
      myMonth = dateObj.month;
    }
    if (
      myMonth === splitDateString[1] &&
      dateObj.year.toString() === splitDateString[3]
    ) {
      schedule.push(game);
    }
    return "";
  });

  return schedule;
};

const findIndex = (arr, arrEl) => {
  const myIndex = (element) => element === arrEl;
  const index = arr.findIndex(myIndex);
  return index;
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//  IMAGE HANDLING
// returns a URL for an uploaded image
const imgURL = (imageFile) => {

  return URL.createObjectURL(imageFile.target.files[0]);
};

// CREATE FORMS PAGES GET LOCAL DATA
const checkLocalData = (dataName, stateFunc) => {
  const localData = localStorage.getItem(dataName);
  if (localData) {
    stateFunc(JSON.parse(localData));
  }
};

//  DELETE TABLE ROW FROM SCHEDULE COACHES OR PLAYERS PREVIEW
const handleDelete = (toDelete, dataArr, stateFunc, dataName) => {
  console.log(toDelete);
  let data = dataArr.filter((element) => element != toDelete);
  console.log(data);

  if (data.length) {
    localStorage.setItem(dataName, [JSON.stringify(data)]);
    stateFunc(data);
  }

  if (!data.length) {
    localStorage.clear(dataName);
    stateFunc();
  }
};

export {
  battingAverages,
  getOverallPlayer,
  pitcherOfTheWeek,
  emailToUserName,
  loadYears,
  daysInMonth,
  startOfMonthDay,
  currentMonthAndYear,
  currentYear,
  monthlySchedule,
  findIndex,
  days,
  months,
  imgURL,
  checkLocalData,
  handleDelete,
};

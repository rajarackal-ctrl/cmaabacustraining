const students = [
  { name: "Diwa", username: "IN0360001", password: "1234" },
  { name: "Sidharth", username: "IN0360002", password: "2345" },
  { name: "Srinithi", username: "IN0360003", password: "3456" },
  { name: "Lekshmipriya", username: "IN0360004", password: "4567" },
  { name: "Georgy", username: "IN0360005", password: "5678" },
  { name: "Israen", username: "IN0360006", password: "6789" },
  { name: "Janav", username: "IN0360007", password: "9876" },
  { name: "Jia", username: "IN0360008", password: "8765" },
  { name: "Goutham", username: "IN0360009", password: "7654" }
];

const adminAccount = {
  username: "abhijith123",
  password: "Abhi@0227"
};

const PERFORMANCE_STORAGE_KEY = "cma-student-performance";
const ACTIVE_STUDENT_STORAGE_KEY = "cma-active-student";
const ACTIVE_ADMIN_STORAGE_KEY = "cma-active-admin";

const modeConfig = {
  mental: {
    label: "Mental Training",
    duration: 150
  },
  abacus: {
    label: "Abacus Training",
    duration: 120
  }
};

const STUDENT_IDS = {
  DIWA: "IN0360001",
  SIDHARTH: "IN0360002",
  SRINITHI: "IN0360003",
  LEKSHMI: "IN0360004",
  GEORGY: "IN0360005",
  ISRAEN: "IN0360006",
  JANAV: "IN0360007",
  JIA: "IN0360008",
  GOUTHAM: "IN0360009"
};

const trainingPlaceholders = students.reduce((accumulator, student) => {
  accumulator[student.username] = {
    mental: {
      title: `${student.name} - Mental Training`,
      description: `Questions for ${student.name}'s Mental training will be added here later.`
    },
    abacus: {
      title: `${student.name} - Abacus Training`,
      description: `Questions for ${student.name}'s Abacus training will be added here later.`
    }
  };
  return accumulator;
}, {});

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sumValues(values) {
  return values.reduce((total, value) => total + value, 0);
}

function createQuestionSet(prefix, count, termBuilder) {
  return Array.from({ length: count }, (_, index) => {
    const questionNumber = index + 1;
    const terms = termBuilder(questionNumber);

    return {
      id: `${prefix}-${questionNumber}`,
      questionNumber,
      lines: terms.map((value) => String(value)),
      correctAnswer: sumValues(terms)
    };
  });
}

function createGouthamMentalTerms(questionNumber) {
  const positionInBlock = ((questionNumber - 1) % 10) + 1;

  if (positionInBlock <= 5) {
    return Array.from({ length: 8 }, () => randomInt(1, 9));
  }

  const terms = Array.from({ length: 5 }, () => (Math.random() < 0.72 ? randomInt(12, 95) : randomInt(1, 9)));
  while (terms.filter((value) => value >= 10).length < 2) {
    terms[randomInt(0, terms.length - 1)] = randomInt(12, 95);
  }

  return terms;
}

function createGrade8MentalTerms(questionNumber) {
  const positionInBlock = ((questionNumber - 1) % 10) + 1;

  if (positionInBlock <= 5) {
    return Array.from({ length: 6 }, () => randomInt(1, 9));
  }

  const terms = Array.from({ length: 4 }, () => (Math.random() < 0.7 ? randomInt(12, 95) : randomInt(1, 9)));
  while (terms.filter((value) => value >= 10).length < 2) {
    terms[randomInt(0, terms.length - 1)] = randomInt(12, 95);
  }

  return terms;
}

function createGrade9MentalTerms(questionNumber) {
  const positionInBlock = ((questionNumber - 1) % 10) + 1;

  if (positionInBlock <= 5) {
    return Array.from({ length: 5 }, () => randomInt(1, 9));
  }

  const rowCount = 4;
  const terms = Array.from({ length: rowCount }, () => (Math.random() < 0.72 ? randomInt(12, 95) : randomInt(1, 9)));
  while (terms.filter((value) => value >= 10).length < 2) {
    terms[randomInt(0, terms.length - 1)] = randomInt(12, 95);
  }

  return terms;
}

function createGrade11MentalTerms() {
  return Array.from({ length: 3 }, () => randomInt(1, 9));
}

function createPatternAbacusTerms(questionNumber) {
  const positionInBlock = ((questionNumber - 1) % 5) + 1;
  const usesNegatives = positionInBlock === 2 || positionInBlock === 4;

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const terms = Array.from({ length: 10 }, () => randomInt(1, 9));

    if (usesNegatives) {
      const negativeSlots = new Set();
      const negativeTarget = randomInt(2, 3);

      while (negativeSlots.size < negativeTarget) {
        negativeSlots.add(randomInt(2, 8));
      }

      negativeSlots.forEach((slot) => {
        terms[slot] *= -1;
      });
    }

    const total = sumValues(terms);
    if (total >= 0 && total <= 60) {
      return terms;
    }
  }

  return Array.from({ length: 10 }, () => randomInt(1, 9));
}

function createGrade12AbacusTerms(questionNumber) {
  const positionInBlock = ((questionNumber - 1) % 5) + 1;
  const usesNegatives = positionInBlock === 2 || positionInBlock === 4;

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const terms = Array.from({ length: 5 }, () => randomInt(1, 9));

    if (usesNegatives) {
      const negativeSlots = new Set();
      negativeSlots.add(randomInt(1, 2));
      if (Math.random() < 0.45) {
        negativeSlots.add(randomInt(2, 3));
      }

      negativeSlots.forEach((slot) => {
        terms[slot] *= -1;
      });
    }

    const total = sumValues(terms);
    if (total >= 0 && total <= 35) {
      return terms;
    }
  }

  return Array.from({ length: 5 }, () => randomInt(1, 9));
}

function createGrade11AbacusTerms(questionNumber) {
  const positionInBlock = ((questionNumber - 1) % 5) + 1;
  const usesNegatives = positionInBlock === 2 || positionInBlock === 4;

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const terms = Array.from({ length: 7 }, () => randomInt(1, 9));

    if (usesNegatives) {
      const negativeSlots = new Set();
      const negativeTarget = randomInt(1, 2);

      while (negativeSlots.size < negativeTarget) {
        negativeSlots.add(randomInt(2, 5));
      }

      negativeSlots.forEach((slot) => {
        terms[slot] *= -1;
      });
    }

    const total = sumValues(terms);
    if (total >= 0 && total <= 65) {
      return terms;
    }
  }

  return Array.from({ length: 7 }, () => randomInt(1, 9));
}

function createGouthamAbacusTerms(questionNumber) {
  const positionInBlock = ((questionNumber - 1) % 5) + 1;
  const usesNegatives = positionInBlock === 2 || positionInBlock === 4;

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const terms = Array.from({ length: 10 }, () => randomInt(12, 99));

    if (usesNegatives) {
      const negativeSlots = new Set();
      const negativeTarget = randomInt(2, 3);

      while (negativeSlots.size < negativeTarget) {
        negativeSlots.add(randomInt(2, 8));
      }

      negativeSlots.forEach((slot) => {
        terms[slot] *= -1;
      });
    }

    const total = sumValues(terms);
    if (total >= 0 && total <= 650) {
      return terms;
    }
  }

  return Array.from({ length: 10 }, () => randomInt(15, 85));
}

function createGouthamMentalSet() {
  return createQuestionSet("mental", 30, createGouthamMentalTerms);
}

function createGrade8MentalSet() {
  return createQuestionSet("mental", 30, createGrade8MentalTerms);
}

function createGrade9MentalSet() {
  return createQuestionSet("mental", 40, createGrade9MentalTerms);
}

function createGrade11MentalSet() {
  return createQuestionSet("mental", 40, createGrade11MentalTerms);
}

function createPatternAbacusSet() {
  return createQuestionSet("abacus", 10, createPatternAbacusTerms);
}

function createGrade12AbacusSet() {
  return createQuestionSet("abacus", 10, createGrade12AbacusTerms);
}

function createLekshmiAbacusSet() {
  return createQuestionSet("abacus", 20, createGrade12AbacusTerms);
}

function createGrade11AbacusSet() {
  return createQuestionSet("abacus", 20, createGrade11AbacusTerms);
}

function createGouthamAbacusSet() {
  return createQuestionSet("abacus", 10, createGouthamAbacusTerms);
}

function makeProfile({ description, note, score, groupSize, generator }) {
  return { description, note, score, groupSize, generator };
}

const trainingProfiles = {
  [STUDENT_IDS.GOUTHAM]: {
    mental: makeProfile({
      description:
        "Sheet 1 Mental pattern for Goutham: three blocks of ten questions with 8-row and 5-row addition columns, plus automatic scoring out of 30.",
      note:
        "Start the timer to generate 30 Mental questions. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes 30 seconds.",
      score: 30,
      groupSize: 10,
      generator: createGouthamMentalSet
    }),
    abacus: makeProfile({
      description:
        "Sheet 2 Abacus pattern for Goutham: two blocks of five questions with 10-row abacus columns, plus automatic scoring out of 10.",
      note:
        "Start the timer to generate 10 Abacus questions. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes.",
      score: 10,
      groupSize: 5,
      generator: createGouthamAbacusSet
    })
  },
  [STUDENT_IDS.JIA]: {
    mental: makeProfile({
      description:
        "Mental pattern for Jia: three blocks of ten questions with 6-row and 4-row addition columns, plus automatic scoring out of 30.",
      note:
        "Start the timer to generate 30 Mental questions in the second sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes 30 seconds.",
      score: 30,
      groupSize: 10,
      generator: createGrade8MentalSet
    }),
    abacus: makeProfile({
      description:
        "Abacus pattern for Jia: two blocks of five questions with 10-row single-digit columns and mixed positive-negative practice, plus automatic scoring out of 10.",
      note:
        "Start the timer to generate 10 Abacus questions in the first sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes.",
      score: 10,
      groupSize: 5,
      generator: createPatternAbacusSet
    })
  },
  [STUDENT_IDS.SIDHARTH]: {
    mental: makeProfile({
      description:
        "Mental pattern for Sidharth: three blocks of ten questions with 6-row and 4-row addition columns, plus automatic scoring out of 30.",
      note:
        "Start the timer to generate 30 Mental questions in the second sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes 30 seconds.",
      score: 30,
      groupSize: 10,
      generator: createGrade8MentalSet
    }),
    abacus: makeProfile({
      description:
        "Abacus pattern for Sidharth: two blocks of five questions with 10-row single-digit columns and mixed positive-negative practice, plus automatic scoring out of 10.",
      note:
        "Start the timer to generate 10 Abacus questions in the first sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes.",
      score: 10,
      groupSize: 5,
      generator: createPatternAbacusSet
    })
  },
  [STUDENT_IDS.SRINITHI]: {
    mental: makeProfile({
      description:
        "Mental pattern for Srinithi: three blocks of ten questions with 6-row and 4-row addition columns, plus automatic scoring out of 30.",
      note:
        "Start the timer to generate 30 Mental questions in the second sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes 30 seconds.",
      score: 30,
      groupSize: 10,
      generator: createGrade8MentalSet
    }),
    abacus: makeProfile({
      description:
        "Abacus pattern for Srinithi: four blocks of five questions with 7-row single-digit columns and mixed positive-negative practice, plus automatic scoring out of 20.",
      note:
        "Start the timer to generate 20 Abacus questions in the first sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes.",
      score: 20,
      groupSize: 5,
      generator: createGrade11AbacusSet
    })
  },
  [STUDENT_IDS.DIWA]: {
    mental: makeProfile({
      description:
        "Mental pattern for Diwa: three blocks of ten questions with 6-row and 4-row addition columns, plus automatic scoring out of 30.",
      note:
        "Start the timer to generate 30 Mental questions in the second sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes 30 seconds.",
      score: 30,
      groupSize: 10,
      generator: createGrade8MentalSet
    }),
    abacus: makeProfile({
      description:
        "Abacus pattern for Diwa: two blocks of five questions with 10-row single-digit columns and mixed positive-negative practice, plus automatic scoring out of 10.",
      note:
        "Start the timer to generate 10 Abacus questions in the first sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes.",
      score: 10,
      groupSize: 5,
      generator: createPatternAbacusSet
    })
  },
  [STUDENT_IDS.LEKSHMI]: {
    mental: makeProfile({
      description:
        "Mental pattern for Lekshmipriya: four blocks of ten questions with 5-row single-digit columns and 4-row mixed columns, plus automatic scoring out of 40.",
      note:
        "Start the timer to generate 40 Mental questions in the first sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes 30 seconds.",
      score: 40,
      groupSize: 10,
      generator: createGrade9MentalSet
    }),
    abacus: makeProfile({
      description:
        "Abacus pattern for Lekshmipriya: four blocks of five questions with 7-row single-digit columns and mixed positive-negative practice, plus automatic scoring out of 20.",
      note:
        "Start the timer to generate 20 Abacus questions in the second sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes.",
      score: 20,
      groupSize: 5,
      generator: createGrade11AbacusSet
    })
  },
  [STUDENT_IDS.ISRAEN]: {
    mental: makeProfile({
      description:
        "Mental pattern for Israen: four blocks of ten questions with 3-row single-digit columns, plus automatic scoring out of 40.",
      note:
        "Start the timer to generate 40 Mental questions in the first sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes 30 seconds.",
      score: 40,
      groupSize: 10,
      generator: createGrade11MentalSet
    }),
    abacus: makeProfile({
      description:
        "Abacus pattern for Israen: two blocks of five questions with 5-row single-digit columns and light positive-negative practice, plus automatic scoring out of 10.",
      note:
        "Start the timer to generate 10 Abacus questions in the second sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes.",
      score: 10,
      groupSize: 5,
      generator: createGrade12AbacusSet
    })
  },
  [STUDENT_IDS.GEORGY]: {
    mental: makeProfile({
      description:
        "Mental pattern for Georgy: four blocks of ten questions with 5-row single-digit columns and 4-row mixed columns, plus automatic scoring out of 40.",
      note:
        "Start the timer to generate 40 Mental questions in the first sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes 30 seconds.",
      score: 40,
      groupSize: 10,
      generator: createGrade9MentalSet
    }),
    abacus: makeProfile({
      description:
        "Abacus pattern for Georgy: four blocks of five questions with 5-row single-digit columns and mixed positive-negative practice, plus automatic scoring out of 20.",
      note:
        "Start the timer to generate 20 Abacus questions in the second sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes.",
      score: 20,
      groupSize: 5,
      generator: createLekshmiAbacusSet
    })
  },
  [STUDENT_IDS.JANAV]: {
    mental: makeProfile({
      description:
        "Mental pattern for Janav: four blocks of ten questions with 5-row single-digit columns and 4-row mixed columns, plus automatic scoring out of 40.",
      note:
        "Start the timer to generate 40 Mental questions in the first sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes 30 seconds.",
      score: 40,
      groupSize: 10,
      generator: createGrade9MentalSet
    }),
    abacus: makeProfile({
      description:
        "Abacus pattern for Janav: four blocks of five questions with 5-row single-digit columns and mixed positive-negative practice, plus automatic scoring out of 20.",
      note:
        "Start the timer to generate 20 Abacus questions in the second sheet style. Inputs unlock only while the timer is running, and the answers submit automatically after 2 minutes.",
      score: 20,
      groupSize: 5,
      generator: createLekshmiAbacusSet
    })
  }
};

const views = {
  login: document.getElementById("loginView"),
  admin: document.getElementById("adminView"),
  dashboard: document.getElementById("dashboardView"),
  training: document.getElementById("trainingView")
};

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const adminSummary = document.getElementById("adminSummary");
const adminStats = document.getElementById("adminStats");
const adminRankingList = document.getElementById("adminRankingList");
const adminPerformanceList = document.getElementById("adminPerformanceList");
const refreshAdminButton = document.getElementById("refreshAdminButton");
const adminLogoutButton = document.getElementById("adminLogoutButton");
const studentGreeting = document.getElementById("studentGreeting");
const studentRankPanel = document.getElementById("studentRankPanel");
const logoutButton = document.getElementById("logoutButton");
const trainingSubtitle = document.getElementById("trainingSubtitle");
const questionTitle = document.getElementById("questionTitle");
const questionDescription = document.getElementById("questionDescription");
const sessionNote = document.getElementById("sessionNote");
const resultsSummary = document.getElementById("resultsSummary");
const questionList = document.getElementById("questionList");
const timerDisplay = document.getElementById("timerDisplay");
const timerStatus = document.getElementById("timerStatus");
const startTimerButton = document.getElementById("startTimerButton");
const pauseTimerButton = document.getElementById("pauseTimerButton");
const resetTimerButton = document.getElementById("resetTimerButton");
const backButton = document.getElementById("backButton");

let currentStudent = null;
let currentMode = null;
let timerSeconds = modeConfig.mental.duration;
let timerId = null;
let sessionStarted = false;
let sessionSubmitted = false;
let currentQuestions = [];

function showView(name) {
  Object.values(views).forEach((view) => view.classList.remove("active"));
  views[name].classList.add("active");
}

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timerSeconds);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resetTimerStatus(message, className = "") {
  timerStatus.textContent = message;
  timerStatus.className = `timer-status ${className}`.trim();
}

function getPerformanceRecords() {
  try {
    const savedRecords = JSON.parse(localStorage.getItem(PERFORMANCE_STORAGE_KEY) || "[]");
    return Array.isArray(savedRecords) ? savedRecords : [];
  } catch {
    return [];
  }
}

function savePerformanceRecord(record) {
  const records = getPerformanceRecords();
  const updatedRecords = [record, ...records].slice(0, 250);
  localStorage.setItem(PERFORMANCE_STORAGE_KEY, JSON.stringify(updatedRecords));
}

function formatRecordDate(value) {
  if (!value) {
    return "Not recorded";
  }

  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

function getRecordDuration(record) {
  if (Number.isFinite(record.durationSeconds)) {
    return record.durationSeconds;
  }

  return modeConfig[record.mode]?.duration || 0;
}

function getPracticeLevel(sessions, totalPoints, totalDurationSeconds) {
  if (sessions === 0) {
    return "Not Started";
  }

  if (sessions >= 10 || totalPoints >= 250 || totalDurationSeconds >= 600) {
    return "Champion";
  }

  if (sessions >= 6 || totalPoints >= 150 || totalDurationSeconds >= 360) {
    return "Advanced";
  }

  if (sessions >= 3 || totalPoints >= 70 || totalDurationSeconds >= 180) {
    return "Regular";
  }

  return "Beginner";
}

function getImprovementLevel(improvement, sessions) {
  if (sessions === 0) {
    return { label: "No Data", style: "muted" };
  }

  if (sessions === 1) {
    return { label: "Baseline", style: "muted" };
  }

  if (improvement >= 15) {
    return { label: "Excellent +" + improvement + "%", style: "" };
  }

  if (improvement >= 5) {
    return { label: "Improving +" + improvement + "%", style: "" };
  }

  if (improvement >= -4) {
    return { label: "Stable " + improvement + "%", style: "muted" };
  }

  return { label: "Needs Focus " + improvement + "%", style: "warning" };
}

function buildStudentRankings(records) {
  return students
    .map((student) => {
      const studentRecords = records
        .filter((record) => record.studentId === student.username)
        .sort((first, second) => new Date(first.submittedAt) - new Date(second.submittedAt));
      const sessions = studentRecords.length;
      const totalPoints = studentRecords.reduce((total, record) => total + Number(record.score || 0), 0);
      const totalPossible = studentRecords.reduce((total, record) => total + Number(record.total || 0), 0);
      const totalDurationSeconds = studentRecords.reduce((total, record) => total + getRecordDuration(record), 0);
      const averageScore = totalPossible ? Math.round((totalPoints / totalPossible) * 100) : 0;
      const firstScore = sessions ? Number(studentRecords[0].percentage || 0) : 0;
      const latestScore = sessions ? Number(studentRecords[sessions - 1].percentage || 0) : 0;
      const improvement = sessions > 1 ? latestScore - firstScore : 0;

      return {
        student,
        sessions,
        totalPoints,
        totalPossible,
        totalDurationSeconds,
        averageScore,
        latestScore,
        improvement,
        practiceLevel: getPracticeLevel(sessions, totalPoints, totalDurationSeconds),
        improvementLevel: getImprovementLevel(improvement, sessions)
      };
    })
    .sort((first, second) => {
      if (second.totalPoints !== first.totalPoints) {
        return second.totalPoints - first.totalPoints;
      }

      if (second.averageScore !== first.averageScore) {
        return second.averageScore - first.averageScore;
      }

      return second.totalDurationSeconds - first.totalDurationSeconds;
    });
}

function renderRankingTable(records) {
  const rankings = buildStudentRankings(records);

  adminRankingList.innerHTML = `
    <div class="performance-table-wrap">
      <table class="performance-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Student</th>
            <th>ID</th>
            <th>Points</th>
            <th>Practice Time</th>
            <th>Sessions</th>
            <th>Practice Lvl</th>
            <th>Improvement Lvl</th>
          </tr>
        </thead>
        <tbody>
          ${rankings
            .map((ranking, index) => {
              const improvementStyle = ranking.improvementLevel.style
                ? ` ${ranking.improvementLevel.style}`
                : "";

              return `
                <tr>
                  <td><span class="rank-pill">#${index + 1}</span></td>
                  <td>${escapeHtml(ranking.student.name)}</td>
                  <td>${escapeHtml(ranking.student.username)}</td>
                  <td><span class="score-pill">${ranking.totalPoints} / ${ranking.totalPossible || 0}</span></td>
                  <td>${escapeHtml(formatDuration(ranking.totalDurationSeconds))}</td>
                  <td>${ranking.sessions}</td>
                  <td><span class="level-pill${ranking.sessions ? "" : " muted"}">${escapeHtml(ranking.practiceLevel)}</span></td>
                  <td><span class="level-pill${improvementStyle}">${escapeHtml(ranking.improvementLevel.label)}</span></td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderStudentRankPanel() {
  if (!currentStudent) {
    studentRankPanel.innerHTML = "";
    return;
  }

  const rankings = buildStudentRankings(getPerformanceRecords());
  const studentRankIndex = rankings.findIndex((ranking) => ranking.student.username === currentStudent.username);
  const ranking = rankings[studentRankIndex];

  if (!ranking) {
    studentRankPanel.innerHTML = "";
    return;
  }

  studentRankPanel.innerHTML = `
    <article class="student-rank-card highlight">
      <span>Your Position</span>
      <strong>#${studentRankIndex + 1} of ${students.length}</strong>
    </article>
    <article class="student-rank-card">
      <span>Total Points</span>
      <strong>${ranking.totalPoints} / ${ranking.totalPossible || 0}</strong>
    </article>
    <article class="student-rank-card">
      <span>Practice Time</span>
      <strong>${escapeHtml(formatDuration(ranking.totalDurationSeconds))}</strong>
    </article>
    <article class="student-rank-card">
      <span>Practice Lvl</span>
      <strong>${escapeHtml(ranking.practiceLevel)}</strong>
    </article>
    <article class="student-rank-card">
      <span>Improvement Lvl</span>
      <strong>${escapeHtml(ranking.improvementLevel.label)}</strong>
    </article>
  `;
}

function renderAdminDashboard() {
  const records = getPerformanceRecords().sort(
    (first, second) => new Date(second.submittedAt) - new Date(first.submittedAt)
  );
  const totalSessions = records.length;
  const studentsAttempted = new Set(records.map((record) => record.studentId)).size;
  const averageScore = totalSessions
    ? Math.round(records.reduce((total, record) => total + Number(record.percentage || 0), 0) / totalSessions)
    : 0;
  const bestScore = totalSessions ? Math.max(...records.map((record) => Number(record.percentage || 0))) : 0;

  adminSummary.textContent = totalSessions
    ? `Showing ${totalSessions} completed training session${totalSessions === 1 ? "" : "s"}.`
    : "No student sessions have been completed yet.";

  adminStats.innerHTML = `
    <article class="admin-stat-card">
      <span>Total Sessions</span>
      <strong>${totalSessions}</strong>
    </article>
    <article class="admin-stat-card">
      <span>Students Tracked</span>
      <strong>${studentsAttempted}</strong>
    </article>
    <article class="admin-stat-card">
      <span>Average Score</span>
      <strong>${averageScore}%</strong>
    </article>
    <article class="admin-stat-card">
      <span>Best Score</span>
      <strong>${bestScore}%</strong>
    </article>
  `;

  renderRankingTable(records);

  if (!records.length) {
    adminPerformanceList.innerHTML = `
      <div class="empty-state">
        Student performance will appear here after a timed session is completed.
      </div>
    `;
    return;
  }

  adminPerformanceList.innerHTML = `
    <div class="performance-table-wrap">
      <table class="performance-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>ID</th>
            <th>Mode</th>
            <th>Score</th>
            <th>Duration</th>
            <th>Correct</th>
            <th>Wrong</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          ${records
            .map(
              (record) => `
                <tr>
                  <td>${escapeHtml(record.studentName)}</td>
                  <td>${escapeHtml(record.studentId)}</td>
                  <td><span class="mode-pill">${escapeHtml(record.modeLabel)}</span></td>
                  <td><span class="score-pill">${record.score} / ${record.total} (${record.percentage}%)</span></td>
                  <td>${escapeHtml(formatDuration(getRecordDuration(record)))}</td>
                  <td>${record.correct}</td>
                  <td>${record.wrong}</td>
                  <td>${escapeHtml(formatRecordDate(record.submittedAt))}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function loadAdminDashboard() {
  stopTimer();
  currentStudent = null;
  currentMode = null;
  sessionStarted = false;
  sessionSubmitted = false;
  currentQuestions = [];
  renderAdminDashboard();
  showView("admin");
}

function getActiveTrainingProfile(modeKey = currentMode) {
  if (!currentStudent || !modeKey) {
    return null;
  }

  return trainingProfiles[currentStudent.username]?.[modeKey] || null;
}

function getModeMaxScore(modeKey = currentMode) {
  const profile = getActiveTrainingProfile(modeKey);
  if (profile) {
    return profile.score;
  }

  return modeKey === "abacus" ? 10 : 30;
}

function updateTimerControls() {
  const running = Boolean(timerId);
  startTimerButton.textContent = running ? "Timer Running" : sessionStarted ? "Resume Timer" : "Start Timer";
  startTimerButton.disabled = running || sessionSubmitted;
  pauseTimerButton.disabled = !running || sessionSubmitted || !sessionStarted;
}

function setQuestionInputsDisabled(disabled) {
  document.querySelectorAll(".js-answer-input").forEach((input) => {
    input.disabled = disabled;
  });
}

function renderResultsSummary(correctCount, totalCount) {
  resultsSummary.hidden = false;
  resultsSummary.innerHTML = `
    <strong>Score: ${correctCount} / ${totalCount}</strong>
    <span>${correctCount} correct, ${totalCount - correctCount} wrong.</span>
  `;
}

function clearResultsSummary() {
  resultsSummary.hidden = true;
  resultsSummary.innerHTML = "";
}

function createQuestionGroups(questions, groupSize) {
  const groups = [];
  for (let index = 0; index < questions.length; index += groupSize) {
    groups.push(questions.slice(index, index + groupSize));
  }
  return groups;
}

function renderWorksheetAnswerCell(question) {
  const questionIndex = question.questionNumber - 1;
  const userAnswer = question.userAnswer == null ? "" : String(question.userAnswer);

  if (!sessionSubmitted) {
    return `
      <td class="worksheet-answer-cell">
        <input
          class="worksheet-answer-input js-answer-input"
          type="text"
          inputmode="numeric"
          data-question-index="${questionIndex}"
          value="${escapeHtml(userAnswer)}"
          ${!timerId ? "disabled" : ""}
        >
      </td>
    `;
  }

  return `
    <td class="worksheet-answer-cell ${question.isCorrect ? "answer-correct" : "answer-wrong"}">
      <div class="worksheet-result">
        <span class="worksheet-result-state ${question.isCorrect ? "correct" : "wrong"}">
          ${question.isCorrect ? "Correct" : "Wrong"}
        </span>
        <span><strong>Your:</strong> ${escapeHtml(userAnswer || "--")}</span>
        <span><strong>Ans:</strong> ${escapeHtml(question.correctAnswer)}</span>
      </div>
    </td>
  `;
}

function renderWorksheetAnswerRow(group) {
  return `
    <tr>
      <th class="worksheet-row-head">Ans</th>
      ${group.map((question) => renderWorksheetAnswerCell(question)).join("")}
    </tr>
  `;
}

function renderGroupedWorksheet(questions, groupSize) {
  return createQuestionGroups(questions, groupSize)
    .map((group) => {
      const start = group[0].questionNumber;
      const end = group[group.length - 1].questionNumber;
      const maxRows = Math.max(...group.map((question) => question.lines.length));
      const rows = Array.from({ length: maxRows }, (_, rowIndex) => `
        <tr>
          <th class="worksheet-row-head">${rowIndex + 1}</th>
          ${group
            .map((question) => `<td class="worksheet-value">${escapeHtml(question.lines[rowIndex] || "")}</td>`)
            .join("")}
        </tr>
      `).join("");

      return `
        <section class="worksheet-sheet">
          <p class="worksheet-title">Questions ${start} - ${end}</p>
          <div class="worksheet-scroll">
            <table class="worksheet-table">
              <thead>
                <tr>
                  <th class="worksheet-row-head">No</th>
                  ${group.map((question) => `<th>${question.questionNumber}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${rows}
                ${renderWorksheetAnswerRow(group)}
              </tbody>
            </table>
          </div>
        </section>
      `;
    })
    .join("");
}

function renderQuestionList() {
  if (!currentStudent || !currentMode) {
    questionList.innerHTML = "";
    return;
  }

  const profile = getActiveTrainingProfile();
  if (!profile) {
    questionList.innerHTML = `
      <div class="empty-state">
        ${escapeHtml(currentStudent.name)}'s ${escapeHtml(modeConfig[currentMode].label.toLowerCase())} questions will be added later.
      </div>
    `;
    return;
  }

  if (!sessionStarted || currentQuestions.length === 0) {
    questionList.innerHTML = `
      <div class="empty-state">
        Press Start Timer to generate ${getModeMaxScore()} questions for ${escapeHtml(currentStudent.name)}.
      </div>
    `;
    return;
  }

  questionList.innerHTML = renderGroupedWorksheet(currentQuestions, profile.groupSize);
}

function collectQuestionAnswers() {
  document.querySelectorAll(".js-answer-input").forEach((input) => {
    const questionIndex = Number(input.dataset.questionIndex);
    currentQuestions[questionIndex].userAnswer = input.value.trim();
  });
}

function submitGeneratedSession() {
  const profile = getActiveTrainingProfile();
  if (!profile || sessionSubmitted || !sessionStarted) {
    return false;
  }

  collectQuestionAnswers();
  let correctCount = 0;

  currentQuestions = currentQuestions.map((question) => {
    const normalizedAnswer = String(question.userAnswer ?? "").replaceAll(",", "").trim();
    const isCorrect = normalizedAnswer !== "" && Number(normalizedAnswer) === question.correctAnswer;

    if (isCorrect) {
      correctCount += 1;
    }

    return {
      ...question,
      userAnswer: normalizedAnswer,
      isCorrect
    };
  });

  sessionSubmitted = true;
  renderQuestionList();
  renderResultsSummary(correctCount, profile.score);
  savePerformanceRecord({
    studentId: currentStudent.username,
    studentName: currentStudent.name,
    mode: currentMode,
    modeLabel: modeConfig[currentMode].label,
    score: correctCount,
    total: profile.score,
    correct: correctCount,
    wrong: profile.score - correctCount,
    percentage: Math.round((correctCount / profile.score) * 100),
    questionCount: currentQuestions.length,
    durationSeconds: modeConfig[currentMode].duration,
    submittedAt: new Date().toISOString()
  });
  updateTimerControls();
  return true;
}

function prepareTrainingSession() {
  sessionStarted = false;
  sessionSubmitted = false;
  currentQuestions = [];
  clearResultsSummary();
  renderQuestionList();
  updateTimerControls();
}

function loadDashboard() {
  if (!currentStudent) {
    showView("login");
    return;
  }

  stopTimer();
  currentMode = null;
  sessionStarted = false;
  sessionSubmitted = false;
  currentQuestions = [];
  studentGreeting.textContent = `${currentStudent.name}, choose your personal training module below.`;
  renderStudentRankPanel();
  showView("dashboard");
}

function loadTraining(modeKey) {
  if (!currentStudent || !modeConfig[modeKey]) {
    showView("login");
    return;
  }

  stopTimer();
  currentMode = modeKey;
  timerSeconds = modeConfig[modeKey].duration;
  updateTimerDisplay();
  resetTimerStatus("Ready to begin.");
  trainingSubtitle.textContent = `${currentStudent.name} | ${modeConfig[modeKey].label}`;

  const profile = getActiveTrainingProfile(modeKey);
  if (profile) {
    questionTitle.textContent = `${currentStudent.name} - ${modeConfig[modeKey].label}`;
    questionDescription.textContent = profile.description;
    sessionNote.textContent = profile.note;
  } else {
    questionTitle.textContent = trainingPlaceholders[currentStudent.username][modeKey].title;
    questionDescription.textContent = trainingPlaceholders[currentStudent.username][modeKey].description;
    sessionNote.textContent = "This student page is ready. Questions can be added here later.";
  }

  prepareTrainingSession();
  showView("training");
}

function saveSession(student) {
  localStorage.setItem(ACTIVE_STUDENT_STORAGE_KEY, student.username);
  localStorage.removeItem(ACTIVE_ADMIN_STORAGE_KEY);
}

function saveAdminSession() {
  localStorage.setItem(ACTIVE_ADMIN_STORAGE_KEY, "true");
  localStorage.removeItem(ACTIVE_STUDENT_STORAGE_KEY);
}

function clearSession() {
  localStorage.removeItem(ACTIVE_STUDENT_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_ADMIN_STORAGE_KEY);
}

function restoreSession() {
  const savedAdmin = localStorage.getItem(ACTIVE_ADMIN_STORAGE_KEY);
  if (savedAdmin === "true") {
    loadAdminDashboard();
    return;
  }

  const savedUsername = localStorage.getItem(ACTIVE_STUDENT_STORAGE_KEY);
  if (!savedUsername) {
    return;
  }

  currentStudent = students.find((student) => student.username === savedUsername) || null;
  if (currentStudent) {
    loadDashboard();
  }
}

function handleLogin(event) {
  event.preventDefault();

  const enteredUsername = usernameInput.value.trim().toLowerCase();
  const enteredPassword = passwordInput.value.trim();

  if (enteredUsername === adminAccount.username && enteredPassword === adminAccount.password) {
    saveAdminSession();
    loginForm.reset();
    loginMessage.textContent = "";
    loadAdminDashboard();
    return;
  }

  const matchedStudent = students.find(
    (student) => student.username.toLowerCase() === enteredUsername && student.password === enteredPassword
  );

  if (!matchedStudent) {
    currentStudent = null;
    resetTimerStatus("Ready to begin.");
    loginMessage.textContent = "Login failed. Please check the student ID and password.";
    return;
  }

  currentStudent = matchedStudent;
  saveSession(matchedStudent);
  loginForm.reset();
  loginMessage.textContent = "";
  loadDashboard();
}

function startTimer() {
  if (!currentMode || timerId || sessionSubmitted) {
    return;
  }

  const profile = getActiveTrainingProfile();
  if (!sessionStarted) {
    sessionStarted = true;
    if (profile) {
      currentQuestions = profile.generator();
      clearResultsSummary();
      renderQuestionList();
    }
  } else if (profile) {
    setQuestionInputsDisabled(false);
  }

  if (timerSeconds <= 0) {
    timerSeconds = modeConfig[currentMode].duration;
    updateTimerDisplay();
  }

  resetTimerStatus("Session in progress.");

  timerId = window.setInterval(() => {
    timerSeconds -= 1;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      stopTimer();
      timerSeconds = 0;
      updateTimerDisplay();

      const submitted = submitGeneratedSession();
      resetTimerStatus(
        submitted ? "Time complete. Answers submitted automatically." : "Time complete.",
        submitted ? "success-text" : ""
      );

      if (profile) {
        setQuestionInputsDisabled(true);
      }
      updateTimerControls();
    }
  }, 1000);

  if (profile) {
    setQuestionInputsDisabled(false);
  }
  updateTimerControls();
}

function pauseTimer() {
  if (!timerId) {
    return;
  }

  stopTimer();
  resetTimerStatus("Session paused.");
  if (getActiveTrainingProfile()) {
    setQuestionInputsDisabled(true);
  }
  updateTimerControls();
}

function resetTimer() {
  if (!currentMode) {
    return;
  }

  stopTimer();
  timerSeconds = modeConfig[currentMode].duration;
  updateTimerDisplay();
  resetTimerStatus("Timer reset. Ready to begin.");
  prepareTrainingSession();
}

function handleLogout() {
  stopTimer();
  currentStudent = null;
  currentMode = null;
  sessionStarted = false;
  sessionSubmitted = false;
  currentQuestions = [];
  clearSession();
  loginMessage.textContent = "";
  resetTimerStatus("Ready to begin.");
  showView("login");
}

restoreSession();
updateTimerDisplay();
updateTimerControls();

loginForm.addEventListener("submit", handleLogin);
logoutButton.addEventListener("click", handleLogout);
adminLogoutButton.addEventListener("click", handleLogout);
refreshAdminButton.addEventListener("click", renderAdminDashboard);
backButton.addEventListener("click", loadDashboard);
startTimerButton.addEventListener("click", startTimer);
pauseTimerButton.addEventListener("click", pauseTimer);
resetTimerButton.addEventListener("click", resetTimer);

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => loadTraining(button.dataset.mode));
});

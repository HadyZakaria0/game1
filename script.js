
"use strict";

/* =========================================
   LOVE QUEST — PERSONAL CONFIGURATION ❤️
========================================= */

const CONFIG = {
  password: "112007",
  hint: "احلي يوم بالنسبالي اليوم الي دنيتي جات في من 6 ارقام ❤️",

  heartsToCollect: 5,
  heartGameSeconds: 60,

  photoPath: "images/love-photo.jpg",

  // اكتب اسمها هنا
  herName:"حبوبتي",

  // اكتب رسالتك ليها هنا
  finalMessage: `إنتِ أجمل حاجة حصلتلي في حياتي ❤️

وجودك بيفرق معايا أكتر ما تتخيلي،
وكل يوم معاكي بيبقى ليه معنى مختلف.
وطهم مختلف حياتي معاكي احمل واحلي حياه يحبوبه م اتمناش حاجه من الدنيا دي غيرك يكوتي وييااارب مفيش حاجه تزعلك 
أتمنى أفضل دايمًا سبب في ضحكتك،
وأفضل جنبك في كل لحظة حلوة وصعبة.
وربنا يخليكي ليا يبوبي
بحبك يا أجمل هدية من الدنيا كلها ❤️✨`
};

/* =========================================
   HELPERS
========================================= */

const $ = (selector) => document.querySelector(selector);

const screens = [
  $("#intro"),
  $("#heartGame"),
  $("#memoryGame"),
  $("#mazeGame"),
  $("#passwordStage"),
  $("#messageStage"),
  $("#scratchStage"),
  $("#ending")
];

const progress = $("#progress");
const progressLabel = $("#progressLabel");
const progressCount = $("#progressCount");
const progressFill = $("#progressFill");
const toast = $("#toast");

let currentScreen = "intro";
let toastTimeout = null;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2600);
}

function showScreen(name) {
  const target = $("#" + name);
  if (!target) return;

  screens.forEach((screen) => {
    if (!screen) return;
    screen.hidden = true;
    screen.classList.remove("active");
  });

  target.hidden = false;
  target.classList.add("active");

  currentScreen = name;
  updateProgress(name);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress(name) {
  const stages = {
    heartGame: {
      label: "المرحلة الأولى · جمع القلوب",
      count: "01 / 03",
      width: "33.33%"
    },
    memoryGame: {
      label: "المرحلة الثانية · الذاكرة",
      count: "02 / 03",
      width: "66.66%"
    },
    mazeGame: {
      label: "المرحلة الثالثة · المتاهة",
      count: "03 / 03",
      width: "100%"
    }
  };

  if (!progress) return;

  if (stages[name]) {
    progress.hidden = false;
    progressLabel.textContent = stages[name].label;
    progressCount.textContent = stages[name].count;
    progressFill.style.width = stages[name].width;
  } else {
    progress.hidden = true;
  }
}

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function normalizePassword(value) {
  return value.trim().toLowerCase();
}

/* =========================================
   STARS BACKGROUND ✨
========================================= */

const starCanvas = $("#stars");
const starContext = starCanvas?.getContext("2d");

let stars = [];

function resizeStars() {
  if (!starCanvas || !starContext) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  starCanvas.width = Math.floor(window.innerWidth * dpr);
  starCanvas.height = Math.floor(window.innerHeight * dpr);

  starCanvas.style.width = window.innerWidth + "px";
  starCanvas.style.height = window.innerHeight + "px";

  starContext.setTransform(dpr, 0, 0, dpr, 0, 0);

  stars = Array.from(
    {
      length: Math.min(
        100,
        Math.floor(window.innerWidth / 12)
      )
    },
    () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.008 + 0.002
    })
  );
}

function animateStars() {
  if (!starCanvas || !starContext) return;

  starContext.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  stars.forEach((star) => {
    star.alpha += star.speed;

    if (star.alpha > 0.75 || star.alpha < 0.1) {
      star.speed *= -1;
    }

    starContext.beginPath();
    starContext.arc(
      star.x,
      star.y,
      star.radius,
      0,
      Math.PI * 2
    );

    starContext.fillStyle =
      `rgba(255, 151, 177, ${star.alpha})`;

    starContext.fill();
  });

  requestAnimationFrame(animateStars);
}

resizeStars();
animateStars();

window.addEventListener("resize", resizeStars);

/* =========================================
   INTRO
========================================= */

$("#startButton").addEventListener("click", startHeartGame);

/* =========================================
   GAME 1 — COLLECT HEARTS ❤️
========================================= */

const heartBoard = $("#heartBoard");
const heartScoreDisplay = $("#heartScore");
const heartTimerDisplay = $("#heartTimer");
const heartGameHint = $("#heartGameHint");
const heartBoardMessage = $("#heartBoardMessage");

let heartScore = 0;
let heartTime = CONFIG.heartGameSeconds;
let heartTimerInterval = null;
let heartSpawnTimeout = null;
let heartGameActive = false;
let heartGeneration = 0;

function stopHeartGame() {
  heartGameActive = false;

  clearInterval(heartTimerInterval);
  clearTimeout(heartSpawnTimeout);

  heartTimerInterval = null;
  heartSpawnTimeout = null;
}

function startHeartGame() {
  stopHeartGame();

  heartGeneration++;
  heartScore = 0;
  heartTime = CONFIG.heartGameSeconds;

  heartScoreDisplay.textContent = "0";
  heartTimerDisplay.textContent = heartTime;

  heartGameHint.textContent =
    "كل قلب بتجمعيه بيقرّبك من المفاجأة ✨";

  heartBoard.querySelectorAll(".floating-heart").forEach(
    (heart) => heart.remove()
  );

  heartBoardMessage.hidden = false;

  const message = heartBoardMessage.querySelector("span:last-child");

  if (message) {
    message.textContent = "اضغطي على القلوب اللي بتظهر!";
  }

  showScreen("heartGame");
  heartGameActive = true;

  const generation = heartGeneration;

  heartTimerInterval = setInterval(() => {
    if (!heartGameActive || generation !== heartGeneration) {
      return;
    }

    heartTime--;
    heartTimerDisplay.textContent = heartTime;

    if (heartTime <= 0) {
      stopHeartGame();

      heartBoardMessage.hidden = false;

      if (message) {
        message.textContent = "انتهى الوقت! جربي تاني ❤️";
      }

      heartGameHint.textContent =
        "ولا يهمك، عندك محاولات تانية!";

      showToast("لسه محتاجين قلوب أكتر ❤️");
    }
  }, 1000);

  spawnHeart(generation);
}

function spawnHeart(generation) {
  if (
    !heartGameActive ||
    generation !== heartGeneration ||
    heartScore >= CONFIG.heartsToCollect
  ) {
    return;
  }

  heartBoardMessage.hidden = true;

  const heart = document.createElement("button");

  heart.type = "button";
  heart.className = "floating-heart";
  heart.textContent = ["♥", "♡", "❤", "💕"][
    Math.floor(Math.random() * 4)
  ];

  heart.setAttribute("aria-label", "اجمعي القلب");

  const maxX = Math.max(0, heartBoard.clientWidth - 55);
  const maxY = Math.max(0, heartBoard.clientHeight - 60);

  heart.style.left = Math.random() * maxX + "px";
  heart.style.top = Math.random() * maxY + "px";

  // حركة أهدى
  heart.style.animationDuration = "3.5s";
  heart.style.animationDelay = "0s";

  heart.addEventListener("click", () => {
    if (!heartGameActive || heart.disabled) return;

    heart.disabled = true;
    heart.classList.add("collected");

    setTimeout(() => heart.remove(), 220);

    heartScore++;
    heartScoreDisplay.textContent = heartScore;

    if (heartScore >= CONFIG.heartsToCollect) {
      heartScore = CONFIG.heartsToCollect;
      heartScoreDisplay.textContent = heartScore;

      stopHeartGame();

      heartBoard
        .querySelectorAll(".floating-heart")
        .forEach((item) => item.remove());

      heartBoardMessage.hidden = false;

      const message = heartBoardMessage.querySelector(
        "span:last-child"
      );

      if (message) {
        message.textContent = "جمعتِ كل القلوب! ❤️";
      }

      heartGameHint.textContent =
        "أحسنتِ! المرحلة الثانية مستنياكي ✨";

      showToast("كل القلوب بقت معاكي! ❤️");

      setTimeout(() => {
        if (currentScreen === "heartGame") {
          startMemoryGame();
        }
      }, 1300);

      return;
    }

    clearTimeout(heartSpawnTimeout);
    spawnHeart(generation);
  });

  heartBoard.appendChild(heart);

  // القلب يفضل ظاهر مدة أطول قبل ما يتبدل
  heartSpawnTimeout = setTimeout(() => {
    if (!heartGameActive || generation !== heartGeneration) {
      return;
    }

    heart.remove();
    spawnHeart(generation);
  }, 2500);
}

$("#heartRetryButton").addEventListener("click", startHeartGame);

/* =========================================
   GAME 2 — MEMORY MATCH 💌
========================================= */

const memoryBoard = $("#memoryBoard");
const memoryMatchesDisplay = $("#memoryMatches");
const memoryMovesDisplay = $("#memoryMoves");
const memoryHint = $("#memoryHint");

const memorySymbols = [
  "💌",
  "🌹",
  "💖",
  "🧸",
  "🌙",
  "💎"
];

let memoryFirstCard = null;
let memoryLocked = false;
let memoryMatches = 0;
let memoryMoves = 0;
let memoryMatchedCards = 0;
let memoryGeneration = 0;
let memoryTimers = [];

function clearMemoryTimers() {
  memoryTimers.forEach(clearTimeout);
  memoryTimers = [];
}

function startMemoryGame() {
  memoryGeneration++;
  clearMemoryTimers();

  const generation = memoryGeneration;

  memoryFirstCard = null;
  memoryLocked = false;
  memoryMatches = 0;
  memoryMoves = 0;
  memoryMatchedCards = 0;

  memoryMatchesDisplay.textContent = "0";
  memoryMovesDisplay.textContent = "0";

  memoryHint.textContent =
    "ركّزي كويس... كل كارت وليه توأم ❤️";

  memoryBoard.innerHTML = "";

  const deck = shuffle([
    ...memorySymbols,
    ...memorySymbols
  ]);

  deck.forEach((symbol, index) => {
    const card = document.createElement("button");

    card.type = "button";
    card.className = "memory-card";
    card.dataset.symbol = symbol;
    card.dataset.index = String(index);

    card.setAttribute("aria-label", "كارت مخفي");
    card.setAttribute("aria-pressed", "false");

    const back = document.createElement("span");
    back.className = "memory-card-face memory-card-back";
    back.textContent = "♥";
    back.setAttribute("aria-hidden", "true");

    const front = document.createElement("span");
    front.className = "memory-card-face memory-card-front";
    front.textContent = symbol;
    front.setAttribute("aria-hidden", "true");

    card.append(back, front);

    card.addEventListener("click", () => {
      flipMemoryCard(card, generation);
    });

    memoryBoard.appendChild(card);
  });

  showScreen("memoryGame");
}

function flipMemoryCard(card, generation) {
  if (
    generation !== memoryGeneration ||
    memoryLocked ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    return;
  }

  card.classList.add("flipped");
  card.setAttribute("aria-pressed", "true");
  card.setAttribute("aria-label", card.dataset.symbol);

  if (!memoryFirstCard) {
    memoryFirstCard = card;
    return;
  }

  memoryMoves++;
  memoryMovesDisplay.textContent = memoryMoves;

  const firstCard = memoryFirstCard;
  const secondCard = card;

  memoryFirstCard = null;

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.disabled = true;
    secondCard.disabled = true;

    memoryMatches++;
    memoryMatchedCards += 2;

    memoryMatchesDisplay.textContent = memoryMatches;

    if (memoryMatchedCards === memorySymbols.length * 2) {
      memoryHint.textContent =
        "يا سلام على الشطارة! دماغك شغالة ❤️";

      const timer = setTimeout(() => {
        if (generation !== memoryGeneration) return;
        startMazeGame();
      }, 1400);

      memoryTimers.push(timer);
    }

    return;
  }

  memoryLocked = true;

  const timer = setTimeout(() => {
    if (generation !== memoryGeneration) return;

    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    firstCard.setAttribute("aria-pressed", "false");
    secondCard.setAttribute("aria-pressed", "false");

    firstCard.setAttribute("aria-label", "كارت مخفي");
    secondCard.setAttribute("aria-label", "كارت مخفي");

    memoryLocked = false;
  }, 850);

  memoryTimers.push(timer);
}

$("#memoryRetryButton").addEventListener("click", startMemoryGame);

/* =========================================
   GAME 3 — MAZE 🧩
========================================= */

const mazeBoard = $("#mazeBoard");
const mazeHint = $("#mazeHint");

const mazeLayout = [
  "S.#......",
  ".#.#.###.",
  ".#.#.....",
  ".#.#####.",
  "...#.....",
  "##.#.###.",
  "...#...#.",
  ".#####.#.",
  "........G"
];

let mazePlayer = { row: 0, col: 0 };
let mazeActive = false;
let mazeGeneration = 0;

function startMazeGame() {
  mazeGeneration++;

  mazePlayer = { row: 0, col: 0 };
  mazeActive = true;

  mazeHint.textContent =
    "استخدمي الأسهم عشان توصلي لقلبي ❤️";

  renderMaze();
  showScreen("mazeGame");
}

function renderMaze() {
  mazeBoard.innerHTML = "";

  mazeLayout.forEach((row, rowIndex) => {
    [...row].forEach((cell, colIndex) => {
      const tile = document.createElement("div");

      tile.className = "maze-cell";
      tile.setAttribute("role", "gridcell");

      if (cell === "#") {
        tile.classList.add("wall");
      }

      if (
        mazePlayer.row === rowIndex &&
        mazePlayer.col === colIndex
      ) {
        tile.classList.add("player");
        tile.textContent = "♥";
        tile.setAttribute("aria-label", "مكانك الحالي");
      } else if (cell === "G") {
        tile.classList.add("goal");
        tile.textContent = "💖";
        tile.setAttribute("aria-label", "الهدف");
      }

      mazeBoard.appendChild(tile);
    });
  });
}

function moveMaze(direction) {
  if (!mazeActive) return;

  const movement = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1]
  };

  if (!movement[direction]) return;

  const [dr, dc] = movement[direction];

  const newRow = mazePlayer.row + dr;
  const newCol = mazePlayer.col + dc;

  if (
    newRow < 0 ||
    newRow >= mazeLayout.length ||
    newCol < 0 ||
    newCol >= mazeLayout[0].length
  ) {
    return;
  }

  if (mazeLayout[newRow][newCol] === "#") {
    mazeHint.textContent =
      "الطريق ده مقفول! جرّبي اتجاه تاني ✨";
    return;
  }

  mazePlayer = { row: newRow, col: newCol };

  renderMaze();

  if (mazeLayout[newRow][newCol] === "G") {
    mazeActive = false;

    mazeHint.textContent =
      "وصلتي لقلبي! دلوقتي وقت السر الأخير ❤️";

    showToast("وصلتي للنهاية! 💖");

    const generation = mazeGeneration;

    setTimeout(() => {
      if (generation !== mazeGeneration) return;
      showScreen("passwordStage");
    }, 1100);
  } else {
    mazeHint.textContent =
      "ممتاز! كمّلي طريقك للقلب ❤️";
  }
}

document.querySelectorAll("[data-direction]").forEach((button) => {
  button.addEventListener("click", () => {
    moveMaze(button.dataset.direction);
  });
});

$("#mazeRetryButton").addEventListener("click", startMazeGame);

document.addEventListener("keydown", (event) => {
  if (currentScreen !== "mazeGame") return;

  const keys = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    s: "down",
    a: "left",
    d: "right"
  };

  const direction = keys[event.key];

  if (!direction) return;

  event.preventDefault();
  moveMaze(direction);
});

/* =========================================
   PASSWORD → PHOTO 🔐🖼️
========================================= */

const passwordForm = $("#passwordForm");
const passwordInput = $("#passwordInput");
const passwordHint = $("#passwordHint");
const passwordFeedback = $("#passwordFeedback");

$("#hintButton").addEventListener("click", () => {
  passwordHint.textContent = CONFIG.hint;
  passwordHint.hidden = false;
});

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (
    normalizePassword(passwordInput.value) ===
    normalizePassword(CONFIG.password)
  ) {
    passwordFeedback.textContent = "";
    passwordInput.value = "";

    showToast("الباب اتفتح! مفاجأتك مستنياكي ❤️");

    setTimeout(() => {
      // تخطي شاشة كتابة الاسم والرسالة
      showScreen("scratchStage");
      initializeScratch();
    }, 500);
  } else {
    passwordFeedback.textContent =
      "مش هي دي كلمة السر... جرّبي تاني ❤️";

    passwordInput.select();
  }
});

/* =========================================
   SCRATCH PHOTO → PERSONAL MESSAGE ❤️
========================================= */

const scratchCanvas = $("#scratchCanvas");
const scratchContext = scratchCanvas.getContext(
  "2d",
  { willReadFrequently: true }
);

const secretPhoto = $("#secretPhoto");
const photoFallback = $("#photoFallback");
const scratchCard = $("#scratchCard");
const scratchOverlayLabel = $("#scratchOverlayLabel");
const scratchHint = $("#scratchHint");

let scratchUnlocked = false;
let scratching = false;
let scratchPercent = 0;
let scratchLastPoint = null;
let scratchFrame = 0;
let scratchResizeObserver = null;

secretPhoto.src = CONFIG.photoPath;
$("#finalPhoto").src = CONFIG.photoPath;

// تجهيز الاسم والرسالة الثابتين من CONFIG
$("#herName").textContent = CONFIG.herName;
$("#finalMessage").textContent = CONFIG.finalMessage;

function imageIsAvailable() {
  return secretPhoto.complete &&
    secretPhoto.naturalWidth > 0 &&
    secretPhoto.naturalHeight > 0;
}

function initializeScratch() {
  cancelAnimationFrame(scratchFrame);

  if (currentScreen !== "scratchStage" || scratchUnlocked) {
    return;
  }

  const rect = scratchCard.getBoundingClientRect();

  if (rect.width < 1 || rect.height < 1) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  scratchCanvas.width = Math.round(rect.width * dpr);
  scratchCanvas.height = Math.round(rect.height * dpr);

  scratchCanvas.style.pointerEvents = "auto";

  scratchContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  scratchContext.globalCompositeOperation = "source-over";

  const gradient = scratchContext.createLinearGradient(
    0,
    0,
    rect.width,
    rect.height
  );

  gradient.addColorStop(0, "#4c1429");
  gradient.addColorStop(0.45, "#a81e46");
  gradient.addColorStop(1, "#33111f");

  scratchContext.fillStyle = gradient;
  scratchContext.fillRect(0, 0, rect.width, rect.height);

  scratchContext.strokeStyle = "rgba(255, 213, 224, 0.1)";
  scratchContext.lineWidth = 1;

  for (let y = 0; y < rect.height; y += 18) {
    scratchContext.beginPath();
    scratchContext.moveTo(0, y);
    scratchContext.lineTo(rect.width, y);
    scratchContext.stroke();
  }

  scratchContext.globalCompositeOperation = "destination-out";

  scratching = false;
  scratchPercent = 0;
  scratchLastPoint = null;

  scratchOverlayLabel.hidden = false;
  $("#revealButton").hidden = false;

  if (imageIsAvailable()) {
    secretPhoto.hidden = false;
    photoFallback.hidden = true;
  } else {
    secretPhoto.hidden = true;
    photoFallback.hidden = false;
  }

  scratchHint.textContent =
    "امسحي الغطاء بإيدك واكتشفي المفاجأة ❤️";
}

function getScratchPoint(event) {
  const rect = scratchCanvas.getBoundingClientRect();

  return {
    x: Math.max(
      0,
      Math.min(rect.width, event.clientX - rect.left)
    ),
    y: Math.max(
      0,
      Math.min(rect.height, event.clientY - rect.top)
    )
  };
}

function scratchAt(event) {
  if (scratchUnlocked || currentScreen !== "scratchStage") {
    return;
  }

  const point = getScratchPoint(event);

  scratchContext.globalCompositeOperation = "destination-out";
  scratchContext.lineCap = "round";
  scratchContext.lineJoin = "round";
  scratchContext.lineWidth = 39;

  scratchContext.beginPath();

  if (scratchLastPoint) {
    scratchContext.moveTo(
      scratchLastPoint.x,
      scratchLastPoint.y
    );

    scratchContext.lineTo(point.x, point.y);
  } else {
    scratchContext.moveTo(point.x, point.y);
    scratchContext.lineTo(point.x + 0.1, point.y + 0.1);
  }

  scratchContext.stroke();

  scratchContext.beginPath();
  scratchContext.arc(
    point.x,
    point.y,
    19.5,
    0,
    Math.PI * 2
  );

  scratchContext.fill();

  scratchLastPoint = point;

  checkScratchProgress();
}

function checkScratchProgress() {
  if (
    scratchUnlocked ||
    scratchCanvas.width === 0 ||
    scratchCanvas.height === 0
  ) {
    return;
  }

  const pixels = scratchContext.getImageData(
    0,
    0,
    scratchCanvas.width,
    scratchCanvas.height
  ).data;

  let transparent = 0;
  const total = pixels.length / 4;
  const sampleEvery = 32;

  for (
    let i = 3;
    i < pixels.length;
    i += 4 * sampleEvery
  ) {
    if (pixels[i] < 40) transparent++;
  }

  scratchPercent =
    transparent / Math.ceil(total / sampleEvery);

  if (scratchPercent >= 0.43) {
    revealEntirePhoto();
  } else {
    scratchHint.textContent =
      `كشفتي حوالي ${Math.min(
        99,
        Math.round(scratchPercent * 100)
      )}% من المفاجأة ❤️`;
  }
}

function revealEntirePhoto() {
  if (scratchUnlocked) return;

  scratchUnlocked = true;
  scratching = false;
  scratchLastPoint = null;

  scratchContext.save();
  scratchContext.setTransform(1, 0, 0, 1, 0, 0);

  scratchContext.clearRect(
    0,
    0,
    scratchCanvas.width,
    scratchCanvas.height
  );

  scratchContext.restore();

  scratchCanvas.style.pointerEvents = "none";
  scratchOverlayLabel.hidden = true;
  $("#revealButton").hidden = true;

  scratchHint.textContent =
    "المفاجأة ظهرت... ولسه في كلام من قلبي ليكي ❤️";

  showToast("يا بخت هادي بيكي 💖");

  setTimeout(() => {
    if (currentScreen !== "scratchStage") return;

    // الرسالة التي كتبها صاحب اللعبة تظهر بعد كشف الصورة
    $("#herName").textContent = CONFIG.herName;
    $("#finalMessage").textContent = CONFIG.finalMessage;
    $("#finalPhoto").src = CONFIG.photoPath;

    showScreen("ending");
    launchCelebration();
  }, 1800);
}

scratchCanvas.addEventListener("pointerdown", (event) => {
  if (scratchUnlocked) return;

  event.preventDefault();
  scratching = true;
  scratchLastPoint = getScratchPoint(event);

  try {
    scratchCanvas.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture isn't essential.
  }

  scratchAt(event);
});

scratchCanvas.addEventListener("pointermove", (event) => {
  if (!scratching || scratchUnlocked) return;

  event.preventDefault();
  scratchAt(event);
});

function stopScratching() {
  scratching = false;
  scratchLastPoint = null;
}

scratchCanvas.addEventListener("pointerup", stopScratching);
scratchCanvas.addEventListener("pointercancel", stopScratching);
scratchCanvas.addEventListener("lostpointercapture", stopScratching);

$("#revealButton").addEventListener(
  "click",
  revealEntirePhoto
);

secretPhoto.addEventListener("load", () => {
  if (
    currentScreen === "scratchStage" &&
    !scratchUnlocked
  ) {
    initializeScratch();
  }
});

secretPhoto.addEventListener("error", () => {
  secretPhoto.hidden = true;
  photoFallback.hidden = false;
});

if ("ResizeObserver" in window) {
  scratchResizeObserver = new ResizeObserver(() => {
    if (
      currentScreen === "scratchStage" &&
      !scratchUnlocked
    ) {
      scratchFrame = requestAnimationFrame(initializeScratch);
    }
  });

  scratchResizeObserver.observe(scratchCard);
}

/* =========================================
   ENDING CELEBRATION 🎉
========================================= */

function launchCelebration() {
  const symbols = ["♥", "♡", "✦", "✨", "💕"];

  for (let i = 0; i < 28; i++) {
    const particle = document.createElement("span");

    particle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    Object.assign(particle.style, {
      position: "fixed",
      zIndex: "15",
      left: Math.random() * 100 + "vw",
      top: "-35px",
      color: ["#ff3158", "#ff8da7", "#ffd2df"][
        Math.floor(Math.random() * 3)
      ],
      fontSize: Math.random() * 20 + 12 + "px",
      pointerEvents: "none",
      opacity: "0.9",
      transition:
        `top ${Math.random() * 2 + 2}s linear, ` +
        "transform 3s linear, opacity 3s linear"
    });

    document.body.appendChild(particle);

    requestAnimationFrame(() => {
      particle.style.top = "105vh";
      particle.style.transform =
        `rotate(${Math.random() * 720 - 360}deg)`;

      particle.style.opacity = "0";
    });

    setTimeout(() => particle.remove(), 5200);
  }
}

/* =========================================
   REPLAY 🔄
========================================= */

$("#replayButton").addEventListener("click", () => {
  stopHeartGame();
  heartGeneration++;

  clearMemoryTimers();
  memoryGeneration++;

  mazeActive = false;

  passwordForm.reset();
  passwordHint.hidden = true;
  passwordFeedback.textContent = "";

  scratchUnlocked = false;
  scratching = false;
  scratchPercent = 0;
  scratchLastPoint = null;

  scratchCanvas.style.pointerEvents = "auto";

  scratchContext.globalCompositeOperation = "source-over";

  showScreen("intro");
});

/* =========================================
   INITIAL STATE
========================================= */

showScreen("intro");

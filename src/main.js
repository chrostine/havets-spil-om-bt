import "./index.css";

let gameData = [
  // 0
  {
    text: "Bundtrawl er en måde at fiske på, hvor store og tunge net bliver trukket hen over havbunden.",
    waterLevel: 25,
    sound: "./lyd/default.mp3",
    options: [
      {
        text: "Videre",
        nextStep: 1,
      },
    ],
  },
  // 1
  {
    text: "Bundtrawl fanger mange fisk, men det ødelægger miljøet i havet og gør stor skade på dyrene og planterne, som lever på bunden.",
    waterLevel: 25,
    sound: "./lyd/0.mp3",
    options: [
      {
        text: "Prøv at fiske med bundtrawl",
        nextStep: 2,
      },
    ],
  },
  // 2
  {
    waterLevel: -60,
    options: [
      {
        text: "Videre",
        nextStep: 3,
      },
    ],
  },
  // 3
  {
    text: "Når man trawler, bliver havbunden og planterne revet op, og tang og ålegræs kan blive helt ødelagte.",
    waterLevel: -60,
    sound: "./lyd/2.mp3",
    options: [
      {
        text: "Videre",
        nextStep: 4,
      },
    ],
  },
  // 4
  {
    text: "Det forstyrrer og ødelægger levesteder for mange fisk og smådyr på havbunden.",
    waterLevel: -60,
    sound: "./lyd/3.mp3",
    options: [
      {
        text: "Videre",
        nextStep: 5,
      },
    ],
  },
  // 5
  {
    text: "Planter som tang og ålegræs hjælper med at opfange CO2 - ligesom træer gør på land.",
    waterLevel: -60,
    sound: "./lyd/4.mp3",
    options: [
      {
        text: "Videre",
        nextStep: 6,
      },
    ],
  },
  // 6
  {
    text: "Når disse planter ødelægges bliver noget af CO2’en sluppet fri igen - først i havet og derefter op i luften. Det kan være med til at gøre klimaforandringerne værre.",
    waterLevel: -60,
    sound: "./lyd/5.mp3",
    options: [
      {
        text: "Prøv at fiske med bundtrawl igen",
        nextStep: 9,
      },
    ],
  },
  // 7
  {
    text: "Når vi passer på havet, sikrer vi, at der er fisk nok i havet i fremtiden.",
    waterLevel: 25,
    sound: "./lyd/6.mp3",
    options: [
      {
        text: "Videre",
        nextStep: 8,
      },
    ],
  },
  // 8
  {
    text: "Ved at fiske med skånsomme redskaber - altså redskaber der ikke ødelægger havbunden - bliver fiskene større og sundere, og der kommer flere.",
    waterLevel: 25,
    sound: "./lyd/7.mp3",
    options: [
      {
        text: "Start forfra",
        nextStep: 0,
      },
    ],
  },
  // 9
  {
    waterLevel: -60,
    options: [
      {
        text: "Videre",
        nextStep: 7,
      },
    ],
  },
];

const textEl = document.querySelector(".new-text p");
const optionsEl = document.querySelector(".new-options");
const userClickEl = document.querySelector("#user-click");
const audio = new Audio();
const havets_lyd = new Audio();

let currentState = 0;

window.addEventListener("load", () => {
  updateVandHeight();
});

userClickEl.addEventListener("click", () => {
  showText(currentState);
  showChoices(currentState);
});

function showText(kapitel) {
  let tmpText = gameData[kapitel].text;
  textEl.textContent = tmpText;

  // Afspil normal lyd
  const soundPath = gameData[kapitel].sound;
  if (soundPath) {
    audio.pause();
    audio.currentTime = 0;
    audio.src = soundPath;
    audio.play().catch((err) => {
      console.warn("Lyd kunne ikke afspilles:", err);
    });
  }

  // Afspil baggrundslyd afhængigt af vandhøjden
  const vandNiveau = gameData[kapitel].waterLevel;

  let baggrundslyd = "";

  if (vandNiveau >= 0) {
    baggrundslyd = "./lyd/overflade.mp3"; // fx. blid havlyd
  } else {
    baggrundslyd = "./lyd/dybde.mp3"; // fx. undervandslyd
  }

  if (baggrundslyd) {
    if (havets_lyd.src !== location.origin + "/" + baggrundslyd) {
      havets_lyd.pause();
      havets_lyd.src = baggrundslyd;
      havets_lyd.loop = true;
      havets_lyd.volume = 0.06;
      havets_lyd.play().catch((err) => {
        console.warn("Baggrundslyd kunne ikke afspilles:", err);
      });
    }
  }
}

function showChoices(kapitel) {
  optionsEl.innerHTML = "";

  gameData[kapitel].options.forEach((valg) => {
    const newButton = document.createElement("button");
    newButton.innerText = valg.text;
    newButton.classList.add("btn");

    newButton.addEventListener("click", () => {
      optionSelected(valg);
    });
    optionsEl.append(newButton);
  });
}

function optionSelected(options) {
  currentState = options.nextStep;

  if (currentState >= 3) {
    params.COLOR = "#466261";
    toggleBubble = false;
    startBubbleLoop();
    slider.style.backgroundColor = "#466261";
  } else {
    params.COLOR = "#2B6797";
    toggleBubble = true;
    startBubbleLoop();
    slider.style.backgroundColor = "#2B6797";
  }

  const newRgb = hexToRgb(params.COLOR);
  gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, `rgba(${newRgb.r}, ${newRgb.g}, ${newRgb.b}, 0)`);
  gradient.addColorStop(1, `rgba(${newRgb.r}, ${newRgb.g}, ${newRgb.b}, 1)`);

  showText(currentState);
  showChoices(currentState);
  updateVandHeight();
}

function calculateWaterLevel(percentFromTop) {
  return (window.innerHeight * percentFromTop) / 100;
}

window.addEventListener("resize", () => {
  vandheight = calculateWaterLevel(gameData[currentState].waterLevel);
});

/* ----------------- ALT DET VISUELLE ----------------- */

let animationFrame;
let isAnimating = false;

function updateVandHeight() {
  if (isAnimating) return;
  isAnimating = true;

  const endHeight = calculateWaterLevel(gameData[currentState].waterLevel);
  const startHeight = vandheight;
  const duration = 2000;
  const startTime = performance.now();

  if (endHeight < 0) {
    tangVisible = currentState !== 9;
    sandVisible = true;
    animationRunning = true;
    maskotVisible = false;
    toggleBubble = true;
  } else {
    tangVisible = false;
    sandVisible = false;
    toggleBubble = false;
    animationRunning = false;
    maskotVisible = true;
    document.querySelectorAll(".fish").forEach((fish) => fish.remove());
    document.querySelectorAll(".boble").forEach((boble) => boble.remove());
  }

  toggleTang();
  toggleSand();
  toggleMaskot();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    vandheight = startHeight + (endHeight - startHeight) * progress;

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    } else {
      vandheight = endHeight;

      if (currentState === 2 || currentState === 9) {
        sliderContainer.style.display = "block";
        initTrawl();
        slider.value = 0;
        previousValue = 0;
      } else {
        sliderContainer.style.display = "none";
        if (trawlImg) trawlImg.remove();
        trawlImg = null;
      }

      isAnimating = false;
    }
  }
  animationFrame = requestAnimationFrame(step);
}

/* ----------------- TRAWL ----------------- */
const trawlContainer = document.getElementById("nettet");
const sliderContainer = document.getElementById("trawl-slider-container");
const slider = document.getElementById("trawl-slider");
const trawledFish = [];

let trawlImg;

const aquarium2 = document.getElementById("aquarium");

function updateSliderMax() {
  if (window.innerWidth >= 768) {
    slider.max = 120;
  } else {
    slider.max = 180;
  }
}
updateSliderMax();
window.addEventListener("resize", updateSliderMax);

function initTrawl() {
  if (!trawlImg) {
    trawlImg = document.createElement("img");
    trawlImg.src = "./net.svg";
    trawlImg.id = "bundtrawl";
    trawlImg.style.position = "fixed";
    trawlImg.style.bottom = "15px";
    trawlImg.style.height = "325px";
    trawlImg.style.left = "0%";
    trawlImg.style.transition = "left 0.2s ease";
    trawlImg.style.zIndex = "4";
    trawlImg.style.translate = "-70%";
    trawlContainer.appendChild(trawlImg);
  }
}

let previousValue = 0;

slider.addEventListener("input", () => {
  if (!trawlImg) return;

  const currentValue = parseInt(slider.value);
  const step = currentValue > previousValue ? 1 : -1;

  for (let v = previousValue; v !== currentValue + step; v += step) {
    trawlImg.style.left = `${v}%`;

    const trawlRect = trawlImg.getBoundingClientRect();
    const trawlMidX = trawlRect.left + trawlRect.width / 2;

    document.querySelectorAll(".tang").forEach((tang) => {
      const tangRect = tang.getBoundingClientRect();
      const overlap = trawlMidX >= tangRect.left && trawlMidX <= tangRect.right;

      if (overlap) {
        tang.style.transition = "left 0.3s ease";
        const currentLeft = parseFloat(tang.style.left);
        tang.style.left = `${currentLeft + 1}%`;
      }
    });

    if (step > 0) {
      trawledFish.forEach((fish) => {
        const fishRect = fish.getBoundingClientRect();
        const fishMidX = fishRect.left + fishRect.width / 2;
        const fishMidY = fishRect.top + fishRect.height / 2;

        const trawlWidth = trawlRect.width;
        const trawlMidX = trawlRect.left + trawlWidth / 2;
        const pushZoneLeft = trawlMidX - trawlWidth * 0.25;
        const pushZoneRight = trawlMidX + trawlWidth * 0.25;

        const overlapX = fishMidX >= pushZoneLeft && fishMidX <= pushZoneRight;
        const overlapY =
          fishMidY >= trawlRect.top && fishMidY <= trawlRect.bottom;

        if (overlapX && overlapY) {
          const currentLeft = parseFloat(fish.style.left);
          if (!isNaN(currentLeft)) {
            fish.style.left = `${currentLeft + 10}px`;
          }
        }
      });
    }

    document.querySelectorAll(".fish").forEach((fish) => {
      if (trawledFish.includes(fish)) return;

      const fishRectInitial = fish.getBoundingClientRect();
      const fishMidX = fishRectInitial.left + fishRectInitial.width / 2;
      const fishMidY = fishRectInitial.top + fishRectInitial.height / 2;

      const overlapX =
        fishMidX >= trawlRect.left && fishMidX <= trawlRect.right;
      const overlapY =
        fishMidY >= trawlRect.top && fishMidY <= trawlRect.bottom;

      if (overlapX && overlapY) {
        const fishRect = fish.getBoundingClientRect();
        const containerRect = aquarium.getBoundingClientRect();
        const currentLeft = fishRect.left - containerRect.left;
        const currentTop = fishRect.top - containerRect.top;

        fish.getAnimations().forEach((a) => a.cancel());
        fish.style.transition = "none";

        const fishClone = fish.cloneNode(true);
        fish.replaceWith(fishClone);

        fishClone.style.position = "absolute";
        fishClone.style.left = `${currentLeft}px`;
        fishClone.style.top = `${currentTop}px`;
        fishClone.style.transform = "scaleX(-1)";
        fishClone.style.transition = "left 0.4s ease, top 0.4s ease";

        trawledFish.push(fishClone);

        const trawlMidX = trawlRect.left + trawlRect.width / 2;
        const trawlMidY = trawlRect.top + trawlRect.height / 2;
        const targetLeft = trawlMidX - containerRect.left - fishRect.width / 2;
        const targetTop = trawlMidY - containerRect.top - fishRect.height / 2;

        requestAnimationFrame(() => {
          fishClone.style.left = `${targetLeft}px`;
          fishClone.style.top = `${targetTop}px`;
        });

        setTimeout(() => {
          fishClone.style.transition = "left 0.3s ease";
        }, 400);
      }
    });
  }

  previousValue = currentValue;
});

/* ----------------- MASKOT ----------------- */
const maskotContainer = document.getElementById("maskotten");
let maskotVisible = true;

function toggleMaskot() {
  const existingMaskot = document.getElementById("maskot");

  if (maskotVisible && !existingMaskot) {
    const maskot = document.createElement("img");
    maskot.id = "maskot";
    maskot.src = "./maskot.svg";
    maskotContainer.appendChild(maskot);
  } else if (!maskotVisible && existingMaskot) {
    existingMaskot.remove();
  }
}
toggleMaskot();

/* ----------------- FISH ----------------- */
const aquarium = document.getElementById("aquarium");
const fishCount = 21;
let animationRunning = false;
let animationInterval;

let canvas_bredde_right = window.innerWidth + 100;
let canvas_bredde_left = -150;
let canvas_hojde = window.innerHeight;

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function createFish() {
  if (!animationRunning) return;

  const fish = document.createElement("img");
  const fishIndex = random(1, fishCount);
  const direction = Math.random() > 0.5 ? "left-to-right" : "right-to-left";

  if (currentState >= 3) {
    fish.src = `./skelet.svg`;
  } else {
    fish.src = `./fisk/fish_${fishIndex}.svg`;
  }
  fish.classList.add("fish");

  const top = random(200, canvas_hojde - 60);
  fish.style.top = `${top}px`;

  if (direction === "left-to-right") {
    fish.style.left = `${canvas_bredde_left}px`;
    fish.style.transform = "scaleX(-1)";
    aquarium.appendChild(fish);
    fish.getBoundingClientRect();
    requestAnimationFrame(() => {
      fish.style.transition = `left ${random(8, 16)}s linear`;
      fish.style.left = `${canvas_bredde_right}px`;
    });
  } else {
    fish.style.left = `${canvas_bredde_right}px`;
    fish.style.transform = "scaleX(1)";
    aquarium.appendChild(fish);
    fish.getBoundingClientRect();
    requestAnimationFrame(() => {
      fish.style.transition = `left ${random(8, 16)}s linear`;
      fish.style.left = `${canvas_bredde_left}px`;
    });
  }

  let removed = false;
  fish.addEventListener("transitionend", () => {
    if (!removed) {
      fish.remove();
      removed = true;
    }
  });

  setTimeout(() => {
    if (!removed) {
      fish.remove();
      removed = true;
    }
  }, 20000);
}

function startFishLoop() {
  animationInterval = setInterval(() => {
    if (animationRunning) {
      createFish();
    }
  }, 1000);
}
startFishLoop();

/* ----------------- BUBBLE ----------------- */
const aquariumBubble = document.getElementById("aquarium");
let toggleBubble = false;
let animationIntervalBubble;

let canvas_top = 100;
let canvas_bottom = window.innerHeight - 130;

const randomBubble = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function createBubble() {
  if (!toggleBubble) return;

  const bubble = document.createElement("img");
  bubble.src = `./havbund/boble.svg`;
  bubble.classList.add("boble");

  const size = randomBubble(10, 20);
  bubble.style.width = `${size}px`;
  bubble.style.height = "auto";

  bubble.style.position = "absolute";
  bubble.style.left = `${random(10, window.innerWidth - 50)}px`;
  bubble.style.top = `${canvas_bottom}px`;

  aquariumBubble.appendChild(bubble);
  bubble.getBoundingClientRect();

  requestAnimationFrame(() => {
    bubble.style.transition = `top ${randomBubble(18, 30)}s linear`;
    bubble.style.top = `${canvas_top}px`;
  });

  let removed = false;
  bubble.addEventListener("transitionend", () => {
    if (!removed) {
      bubble.remove();
      removed = true;
    }
  });
  setTimeout(() => {
    if (!removed) {
      bubble.remove();
      removed = true;
    }
  }, 20000);
}

function startBubbleLoop() {
  if (animationIntervalBubble) clearInterval(animationIntervalBubble);

  if (toggleBubble) {
    animationIntervalBubble = setInterval(() => {
      createBubble();
    }, 1000);
  }
}

/* ----------------- SAND ----------------- */
const sandContainer = document.getElementById("sandet");
let sandVisible = false;

function toggleSand() {
  const existingSand = document.getElementById("sand");

  if (sandVisible && !existingSand) {
    const sand = document.createElement("img");
    sand.id = "sand";
    sand.src = "./havbund/sand.svg";
    sandContainer.appendChild(sand);
  } else if (!sandVisible && existingSand) {
    existingSand.remove();
  }
}
toggleSand();

/* ----------------- TANG ----------------- */
const tangContainer = document.getElementById("tanget");
let tangVisible = false;

const tangCount = 12;
const tangArray = Array.from(
  { length: tangCount },
  (_, i) => `./havbund/tang_${i + 1}.svg`
);

let tangAlreadyGenerated = false;

function toggleTang() {
  const allTang = document.querySelectorAll(".tang");

  if (!tangVisible) {
    allTang.forEach((el) => el.remove());
    tangAlreadyGenerated = false;
    return;
  }

  if (tangAlreadyGenerated) return;

  const sandet = document.getElementById("sandet");
  const sandHeight = sandet?.getBoundingClientRect().height || 160;
  const screenHeight = window.innerHeight;

  function calculateTangAmount() {
    const width = window.innerWidth;
    if (width < 500) return 4;
    if (width < 800) return 5;
    if (width < 1200) return 7;
    if (width < 1600) return 10;
    return 16;
  }

  const tangAmount = calculateTangAmount();

  for (let i = 0; i < tangAmount; i++) {
    const tang = document.createElement("img");
    tang.src = tangArray[Math.floor(Math.random() * tangArray.length)];
    tang.classList.add("tang");

    const basePosition = (i + 0.5) * (100 / tangAmount);
    const offset = (Math.random() - 0.5) * 5;
    const finalLeft = basePosition + offset;

    tang.style.position = "fixed";
    tang.style.bottom = window.innerWidth < 600 ? "15px" : "25px";
    tang.style.left = `${finalLeft}%`;
    tang.style.transform = `translateX(-50%) scale(${
      Math.random() * 0.5 + 0.75
    })`;
    tang.style.height = "auto";
    if (window.innerWidth < 600) {
      tang.style.maxHeight = "120px";
    }

    tangContainer.appendChild(tang);
  }
  tangAlreadyGenerated = true;
}
toggleTang();

/* ----------------- VAND / BØLGER ----------------- */

//https://codepen.io/Robpayot/pen/vpKqMp
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const wavesOpacities = [0.8, 0.7, 0.6, 0.5, 0.4, 0.3];
const params = {
  AMPLITUDE_WAVES: 100,
  AMPLITUDE_MIDDLE: 80,
  AMPLITUDE_SIDES: 100,
  OFFSET_SPEED: 120,
  SPEED: 0.5,
  OFFSET_WAVES: 43,
  NUMBER_WAVES: 6,
  COLOR: "#2B6797",
  NUMBER_CURVES: 6,
  OFFSET_CURVE: true,
};

let vandheight = 250;
let speedInc = 0;

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgb = hexToRgb(params.COLOR);
let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let j = params.NUMBER_WAVES - 1; j >= 0; j--) {
    const offset = speedInc + j * Math.PI * params.OFFSET_WAVES;

    ctx.fillStyle = j === 0 ? gradient : params.COLOR;
    ctx.globalAlpha = wavesOpacities[j] || 0.1;

    let leftRange =
      ((Math.sin(offset / params.OFFSET_SPEED + 2) + 1) / 2) *
        params.AMPLITUDE_SIDES +
      (canvas.height - params.AMPLITUDE_SIDES) / 2 +
      vandheight;
    let rightRange = leftRange;

    let leftCurveRange =
      ((Math.sin(offset / params.OFFSET_SPEED + 2) + 1) / 2) *
        params.AMPLITUDE_WAVES +
      (canvas.height - params.AMPLITUDE_WAVES) / 2 +
      vandheight;
    let rightCurveRange =
      ((Math.sin(offset / params.OFFSET_SPEED + 1) + 1) / 2) *
        params.AMPLITUDE_WAVES +
      (canvas.height - params.AMPLITUDE_WAVES) / 2 +
      vandheight;

    let endCurveRange =
      ((Math.sin(offset / params.OFFSET_SPEED + 2) + 1) / 2) *
        params.AMPLITUDE_MIDDLE +
      (canvas.height - params.AMPLITUDE_MIDDLE) / 2 +
      vandheight;

    let reverseLeft = endCurveRange - rightCurveRange + endCurveRange;
    let reverseRight = endCurveRange - leftCurveRange + endCurveRange;

    if (!params.OFFSET_CURVE) {
      leftCurveRange = rightCurveRange;
      reverseRight = reverseLeft;
    }

    ctx.beginPath();
    ctx.moveTo(0, leftRange);

    ctx.bezierCurveTo(
      canvas.width / (params.NUMBER_CURVES * 3),
      leftCurveRange,
      canvas.width / ((params.NUMBER_CURVES * 3) / 2),
      rightCurveRange,
      canvas.width / params.NUMBER_CURVES,
      endCurveRange
    );

    for (let i = 1; i < params.NUMBER_CURVES; i++) {
      const finalRight = i % 2 !== 0 ? rightCurveRange : reverseRight;
      const finalLeft = i % 2 !== 0 ? leftCurveRange : reverseLeft;

      const secondPtX =
        canvas.width * (i / params.NUMBER_CURVES) +
        canvas.width / (params.NUMBER_CURVES * 3);
      const secondPtY = endCurveRange - finalRight + endCurveRange;
      const thirdPtX =
        canvas.width * (i / params.NUMBER_CURVES) +
        canvas.width * (2 / (params.NUMBER_CURVES * 3));
      const thirdPtY = endCurveRange - finalLeft + endCurveRange;
      const lastPtX = canvas.width * ((i + 1) / params.NUMBER_CURVES);
      const lastPtY =
        i === params.NUMBER_CURVES - 1 ? rightRange : endCurveRange;

      ctx.bezierCurveTo(
        secondPtX,
        secondPtY,
        thirdPtX,
        thirdPtY,
        lastPtX,
        lastPtY
      );
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
  }

  speedInc += params.SPEED;
  requestAnimationFrame(render);
};
render();

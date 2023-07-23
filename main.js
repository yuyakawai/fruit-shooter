const mainContainerWidth = 320;
const mainContainerHeight = 480;

const screenContainerWidth = mainContainerWidth * 0.95;
const screenContainerHeight = mainContainerHeight * 0.7;

const playerSize = mainContainerWidth / 10;
const fluitSize = mainContainerWidth / 10;

const playerSpeed = mainContainerWidth / 160;
const bulletSize = mainContainerWidth / 40;
const bulletSpeed = mainContainerWidth / 80;

const controllerButtonList = ["◀", "●", "▶"];

const fluitList = [
  { name: "🍎", speed: 1 },
  { name: "🍒", speed: 2 },
  { name: "🍇", speed: 3 },
  { name: "🍍", speed: 4 }
];

const hitMarginSize = 10;
const hitScorePoint = 10;

let mainContainerElement = null;
let screenContainerElement = null;
let statusMessageElement = null;
let controllerContainerElement = null;

let playerElement = null;
let fluitElementList = [];
let bulletElementList = [];

let PressedButtonNum = 0;
let playerDirection = "front";

let createFluitInterval = 100;
let createFluitIntervalCount = 0;
let score = 0;
let isGameOver = false;

let player = {
  x: screenContainerHeight * 0.8,
  y: screenContainerWidth / 2 - playerSize / 2
};

const init = () => {
  mainContainerElement = document.getElementById("main-container");
  mainContainerElement.style.position = "relative";
  mainContainerElement.style.width = mainContainerWidth + "px";
  mainContainerElement.style.height = mainContainerHeight + "px";
  mainContainerElement.style.margin = "5px";
  mainContainerElement.style.fontFamily = "sans-serif";
  mainContainerElement.style.backgroundColor = "#f5deb3";
  mainContainerElement.style.border = "2px solid #deb887";
  mainContainerElement.style.boxSizing = "border-box";
  mainContainerElement.style.borderRadius = "5px";
  mainContainerElement.style.overflow = "hidden";
  mainContainerElement.style.userSelect = "none";
  mainContainerElement.style.webkitUserSelect = "none";

  screenContainerElement = document.createElement("div");
  screenContainerElement.style.position = "relative";
  screenContainerElement.style.width = screenContainerWidth + "px";
  screenContainerElement.style.height = screenContainerHeight + "px";
  screenContainerElement.style.margin = "5px";
  screenContainerElement.style.backgroundColor = "black";
  screenContainerElement.style.border = "2px solid #00ff7f";
  screenContainerElement.style.boxSizing = "border-box";
  screenContainerElement.style.overflow = "hidden";
  mainContainerElement.appendChild(screenContainerElement);

  statusMessageElement = document.createElement("div");
  statusMessageElement.style.position = "relative";
  statusMessageElement.style.zIndex = "1";
  statusMessageElement.style.width = mainContainerWidth + "px";
  statusMessageElement.style.height = mainContainerHeight * 0.05 + "px";
  statusMessageElement.style.margin = "5px";
  statusMessageElement.style.borderRadius = "5px";
  statusMessageElement.style.fontFamily = "sans-serif";
  statusMessageElement.style.fontSize = mainContainerWidth * 0.05 + "px";
  statusMessageElement.style.color = "white";
  screenContainerElement.appendChild(statusMessageElement);

  controllerContainerElement = document.createElement("div");
  controllerContainerElement.style.position = "relative";
  controllerContainerElement.style.width = mainContainerWidth * 0.95 + "px";
  controllerContainerElement.style.height = mainContainerHeight * 0.2 + "px";
  controllerContainerElement.style.margin = "5px";
  controllerContainerElement.style.fontSize = mainContainerWidth * 0.05 + "px";
  controllerContainerElement.style.boxSizing = "border-box";
  controllerContainerElement.style.display = "flex";
  controllerContainerElement.style.alignItems = "center";
  controllerContainerElement.style.justifyContent = "center";
  mainContainerElement.appendChild(controllerContainerElement);

  controllerButtonList.forEach((name) => {
    let buttonElement = document.createElement("div");
    buttonElement.style.position = "relative";
    buttonElement.style.width = mainContainerWidth * 0.3 + "px";
    buttonElement.style.height = mainContainerHeight * 0.1 + "px";
    buttonElement.style.margin = "5px";
    buttonElement.style.fontSize = mainContainerWidth * 0.12 + "px";
    buttonElement.style.backgroundColor = "white";
    buttonElement.style.border = "2px solid black";
    buttonElement.style.boxSizing = "border-box";
    buttonElement.style.cursor = "pointer";
    buttonElement.style.display = "flex";
    buttonElement.style.alignItems = "center";
    buttonElement.style.justifyContent = "center";
    buttonElement.textContent = name;

    if (window.ontouchstart === null) {
      buttonElement.ontouchstart = (e) => {
        e.preventDefault();

        PressedButtonNum++;
        if (PressedButtonNum >= 2) {
          return;
        }

        e.target.style.backgroundColor = "green";
        switch (buttonElement.textContent) {
          case "◀":
            playerDirection = "left";
            break;
          case "▶":
            playerDirection = "right";
            break;
          case "●":
            playerDirection = "front";
            shoot();
            break;
          default:
            break;
        }
      };

      buttonElement.ontouchend = (e) => {
        e.preventDefault();
        e.target.style.backgroundColor = "white";

        PressedButtonNum--;
        if (PressedButtonNum !== 0) {
          return;
        }

        playerDirection = "front";
      };
    } else {
      buttonElement.onpointerdown = (e) => {
        e.preventDefault();

        PressedButtonNum++;
        if (PressedButtonNum >= 2) {
          return;
        }

        e.target.style.backgroundColor = "#ff9999";
        switch (buttonElement.textContent) {
          case "◀":
            playerDirection = "left";
            break;
          case "▶":
            playerDirection = "right";
            break;
          case "●":
            playerDirection = "front";
            shoot();
            break;
          default:
            break;
        }
      };

      buttonElement.onpointerup = (e) => {
        e.preventDefault();

        PressedButtonNum--;
        if (PressedButtonNum !== 0) {
          return;
        }

        playerDirection = "front";
        e.target.style.backgroundColor = "white";
      };
    }

    document.onkeydown = (e) => {
      e.preventDefault();
      switch (e.key) {
        case "ArrowLeft":
          playerDirection = "left";
          break;
        case "ArrowRight":
          playerDirection = "right";
          break;
        case " ": // space key
          shoot();
          break;
        default:
          playerDirection = "front";
          break;
      }
    };

    document.onkeyup = (e) => {
      e.preventDefault();
      playerDirection = "front";
    };

    controllerContainerElement.appendChild(buttonElement);
  });

  playerElement = document.createElement("div");
  playerElement.style.position = "absolute";
  playerElement.style.width = playerSize + "px";
  playerElement.style.height = playerSize + "px";
  playerElement.style.top = player.x + "px";
  playerElement.style.left = player.y + "px";
  playerElement.style.fontSize = playerSize * 0.8 + "px";
  playerElement.style.boxSizing = "border-box";
  playerElement.style.display = "flex";
  playerElement.style.alignItems = "center";
  playerElement.style.justifyContent = "center";
  playerElement.textContent = "🙂";
  screenContainerElement.appendChild(playerElement);

  tick();
};

const showGameOverMessage = () => {
  let messagElement = document.createElement("div");
  messagElement.style.position = "relative";
  messagElement.style.zIndex = "1";
  messagElement.style.width = screenContainerWidth + "px";
  messagElement.style.height = screenContainerHeight * 0.8 + "px";
  messagElement.style.display = "flex";
  messagElement.style.alignItems = "center";
  messagElement.style.justifyContent = "center";
  messagElement.style.color = "red";
  messagElement.style.fontSize = "34px";
  messagElement.textContent = "Game Over";
  screenContainerElement.appendChild(messagElement);
};

const playerMove = () => {
  if (playerDirection === "left") {
    player.y -= playerSpeed;
  }

  if (playerDirection === "right") {
    player.y += playerSpeed;
  }

  player.y = Math.min(
    screenContainerWidth - playerSize / 2,
    Math.max(-playerSize / 2, player.y)
  );

  playerElement.style.top = player.x + "px";
  playerElement.style.left = player.y + "px";
};

const activeCheck = () => {
  fluitElementList = fluitElementList.filter((e) => e.isActive);
  bulletElementList = bulletElementList.filter((e) => e.isActive);
};

const fluitMove = () => {
  fluitElementList.forEach((e) => {
    e.x += e.speed;
    e.style.top = e.x + "px";

    if (e.x > screenContainerHeight) {
      e.remove();
      e.isActive = false;
    }
  });
};

const bulletMove = () => {
  bulletElementList.forEach((e) => {
    e.x -= bulletSpeed;
    e.style.top = e.x + "px";

    if (e.x < 0) {
      e.remove();
      e.isActive = false;
    }
  });
};

const createFluit = () => {
  const randomIndex = Math.trunc(Math.random() * fluitList.length);
  const startLeft =
    Math.trunc(Math.random() * screenContainerWidth) - fluitSize / 2;

  let fluitElement = document.createElement("div");
  fluitElement.x = -fluitSize;
  fluitElement.y = startLeft;
  fluitElement.speed = fluitList[randomIndex].speed;
  fluitElement.isActive = true;
  fluitElement.style.position = "absolute";
  fluitElement.style.width = fluitSize + "px";
  fluitElement.style.height = fluitSize + "px";
  fluitElement.style.top = fluitElement.x + "px";
  fluitElement.style.left = fluitElement.y + "px";
  fluitElement.style.boxSizing = "border-box";
  fluitElement.style.fontSize = fluitSize * 0.8 + "px";
  fluitElement.style.display = "flex";
  fluitElement.style.alignItems = "center";
  fluitElement.style.justifyContent = "center";
  fluitElement.textContent = fluitList[randomIndex].name;
  fluitElementList.push(fluitElement);
  screenContainerElement.appendChild(fluitElement);
};

const createBullet = () => {
  let bulletElement = document.createElement("div");
  bulletElement.x = player.x;
  bulletElement.y = player.y;
  bulletElement.isActive = true;
  bulletElement.style.position = "absolute";
  bulletElement.style.width = bulletSize + "px";
  bulletElement.style.height = bulletSize + "px";
  bulletElement.style.top = bulletElement.x + "px";
  bulletElement.style.left =
    bulletElement.y + playerSize / 2 - bulletSize / 2 + "px";
  bulletElement.style.backgroundColor = "#ffd700";
  bulletElement.style.borderRadius = "50%";
  bulletElement.textContent = " ";
  bulletElementList.push(bulletElement);
  screenContainerElement.appendChild(bulletElement);
};

const collisionCheck = (e1, e2) => {
  const px1 = parseInt(e1.style.left) + parseInt(e1.style.width) / 2;
  const py1 = parseInt(e1.style.top) + parseInt(e1.style.height) / 2;
  const r1 = parseInt(e1.style.width) / 2;
  const px2 = parseInt(e2.style.left) + parseInt(e2.style.width) / 2;
  const py2 = parseInt(e2.style.top) + parseInt(e2.style.height) / 2;
  const r2 = parseInt(e2.style.width) / 2;

  if ((px2 - px1) ** 2 + (py2 - py1) ** 2 <= (r1 + r2 - hitMarginSize) ** 2) {
    return true;
  }

  return false;
};

const shoot = () => {
  createBullet();
};

const tick = () => {
  if (isGameOver) {
    return;
  }

  playerMove();
  fluitMove();
  bulletMove();
  activeCheck();

  fluitElementList.forEach((fluit) => {
    if (collisionCheck(playerElement, fluit)) {
      playerElement.textContent = "🤮";
      showGameOverMessage();
      isGameOver = true;
    }

    bulletElementList.forEach((bullet) => {
      if (collisionCheck(bullet, fluit)) {
        bullet.remove();
        fluit.remove();
        bullet.isActive = false;
        fluit.isActive = false;
        score += hitScorePoint;
      }
    });
  });

  statusMessageElement.textContent = "Score: " + score;

  createFluitIntervalCount--;
  if (createFluitIntervalCount <= 0) {
    createFluitInterval = Math.max(--createFluitInterval, 5);
    createFluitIntervalCount = createFluitInterval;
    createFluit();
  }

  requestAnimationFrame(tick);
};

window.onload = () => {
  init();
};

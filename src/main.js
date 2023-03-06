const container = document.getElementById("grid");
const activeColor = "#AB46D2";
const nodeColor = "#5adbb5";
const targetColor = "#FF6FB5";
let startNode = null;
let baseNumber =
  window.innerHeight > window.innerWidth
    ? window.innerWidth
    : window.innerHeight;
let n = perfectSquare(baseNumber);
let size = n * n;
let gap = 2;
let node_size = (baseNumber - n * gap - 25) / n;
let delay = 50;
const nodes = [];
container.style.gridTemplateColumns = `repeat(${n}, auto)`;
let playable = false;
const play = () => {
  if (playable) {
    let audio = new Audio("./src/assets/sound.mp3");
    audio.play().then(() => {
      audio = null;
    });
  }
};
let sort = bfs;

const speedBtn = document.getElementById("speed-btn");
const speedBtnIcon = document.getElementById("speed-btn-icon");

speedBtn.addEventListener("click", () => {
  play();
  switch (speedBtn.getAttribute("data-speed")) {
    case "slow":
      speedBtn.setAttribute("data-speed", "medium");
      speedBtnIcon.className = "fa-solid fa-car";
      delay = 50;
      break;
    case "medium":
      speedBtn.setAttribute("data-speed", "fast");
      speedBtnIcon.className = "fa-solid fa-rocket";
      delay = 5;
      break;
    case "fast":
      speedBtn.setAttribute("data-speed", "slow");
      speedBtnIcon.className = "fa-solid fa-motorcycle";
      delay = 100;
      break;
  }
});

const shuffleBtn = document.getElementById("shuffle-btn");
shuffleBtn.addEventListener("click", () => {
  play();
  init();
});

const volumeBtn = document.getElementById("volume-btn");
const volumeBtnIcon = document.getElementById("volume-btn-icon");
volumeBtn.addEventListener("click", () => {
  play();
  playable = !playable;
  volumeBtnIcon.className = playable
    ? "fa-solid fa-volume-high"
    : "fa-solid fa-volume-xmark";
});

const algorithmBtn = document.getElementById("algorithm-btn");
algorithmBtn.addEventListener("click", () => {
  play();
  switch (algorithmBtn.getAttribute("data-algorithm")) {
    case "bfs":
      algorithmBtn.setAttribute("data-algorithm", "dfs");
      algorithmBtn.innerHTML = `DFS <i class="fa-solid fa-search" id="volume-btn-icon"></i>`;
      sort = dfs;
      break;
    case "dfs":
      algorithmBtn.setAttribute("data-algorithm", "bfs");
      algorithmBtn.innerHTML = `BFS <i class="fa-solid fa-search" id="volume-btn-icon"></i>`;
      sort = bfs;
      break;
  }
});

function init() {
  startNode = null;
  container.innerHTML = "";
  nodes.splice(0, nodes.length);
  for (let i = 0; i < size; i++) {
    const node = document.createElement("div");
    node.classList.add("node");
    node.classList.add(i);
    node.style.width = `${node_size}px`;
    node.style.height = `${node_size}px`;
    const random = Math.random();
    if (random < 0.2) {
      node.classList.add("wall");
    }
    container.appendChild(node);
    nodes.push(node);
  }

  nodes.forEach((node, index) => {
    node.addEventListener("click", async () => {
      if (node.classList.contains("wall")) return;
      node.classList.toggle("active");
      if (startNode === null) {
        startNode = node;
        node.classList.add("start");
      } else {
        if (startNode === node) {
          node.classList.remove("start");
          startNode = null;
        } else {
          algorithmBtn.setAttribute("disabled", "true");
          shuffleBtn.setAttribute("disabled", "true");
          animate(node, targetColor);
          await sort(startNode, node.value);
          algorithmBtn.removeAttribute("disabled");
          shuffleBtn.removeAttribute("disabled");
        }
      }
    });
    node.value = index;
    node.adjacencyList = [];
    if (index % n === 0) {
      if (!nodes[index + 1].classList.contains("wall"))
        node.adjacencyList.push(nodes[index + 1]);
      if (index !== 0) {
        if (!nodes[index - n].classList.contains("wall"))
          node.adjacencyList.push(nodes[index - n]);
      }
      if (index !== size - n) {
        if (!nodes[index + n].classList.contains("wall"))
          node.adjacencyList.push(nodes[index + n]);
      }
    } else if (index % n === n - 1) {
      if (!nodes[index - 1].classList.contains("wall"))
        node.adjacencyList.push(nodes[index - 1]);
      if (index !== n - 1) {
        if (!nodes[index - n].classList.contains("wall"))
          node.adjacencyList.push(nodes[index - n]);
      }
      if (index !== size - 1) {
        if (!nodes[index + n].classList.contains("wall"))
          node.adjacencyList.push(nodes[index + n]);
      }
    } else if (index > size - n - 1) {
      if (!nodes[index - n].classList.contains("wall"))
        node.adjacencyList.push(nodes[index - n]);
      if (index !== size - n) {
        if (!nodes[index + 1].classList.contains("wall"))
          node.adjacencyList.push(nodes[index - 1]);
      }
      if (index !== size - 1) {
        if (!nodes[index + 1].classList.contains("wall"))
          node.adjacencyList.push(nodes[index + 1]);
      }
    } else if (index < n) {
      if (!nodes[index + n].classList.contains("wall"))
        node.adjacencyList.push(nodes[index + n]);
      if (index !== 0) {
        if (!nodes[index - 1].classList.contains("wall"))
          node.adjacencyList.push(nodes[index - 1]);
      }
      if (index !== n - 1) {
        if (!nodes[index + 1].classList.contains("wall"))
          node.adjacencyList.push(nodes[index + 1]);
      }
    } else {
      if (!nodes[index - 1].classList.contains("wall"))
        node.adjacencyList.push(nodes[index - 1]);
      if (!nodes[index + 1].classList.contains("wall"))
        node.adjacencyList.push(nodes[index + 1]);
      if (!nodes[index - n].classList.contains("wall"))
        node.adjacencyList.push(nodes[index - n]);
      if (!nodes[index + n].classList.contains("wall"))
        node.adjacencyList.push(nodes[index + n]);
    }
  });
}

async function bfs(startNode, value) {
  const queue = [startNode];
  const visited = new Set();
  while (queue.length > 0) {
    const node = queue.shift();
    if (node.value === value) return node;
    if (visited.has(node)) continue;
    queue.push(...node.adjacencyList);
    visited.add(node);
    await animate(node);
  }
}
async function dfs(startNode, value) {
  const stack = [startNode];
  const visited = new Set();
  while (stack.length > 0) {
    const node = stack.pop();
    if (node.value === value) return node;
    if (visited.has(node)) continue;
    stack.push(...node.adjacencyList);
    visited.add(node);
    await animate(node);
  }
}

async function animate(node, color = activeColor) {
  return new Promise(async (resolve) => {
    await node.animate(
      [{ backgroundColor: nodeColor }, { backgroundColor: color }],
      {
        duration: delay,
        iterations: 1,
        fill: "both",
      }
    ).finished;
    play();
    resolve();
  });
}

function perfectSquare(n) {
  let i = 1;
  while (i * i <= n) {
    i++;
  }
  return i - 1;
}

init();

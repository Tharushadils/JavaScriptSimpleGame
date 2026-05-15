let score = 0;

let currentLevel = 1;

let basket = $("#basket");

let gameRunning = true;

let fruitSpeed = 1;
let spawnRate = 600;

let spawnInterval;

const levels = {

    1: {
        speed: 2,
        spawn: 600,
        bg: "linear-gradient(to bottom,#87ceeb,#dff6ff)"
    },

    2: {
        speed: 4,
        spawn: 300,
        bg: "linear-gradient(to bottom,#ffe29f,#ffa99f)"
    },

    3: {
        speed: 6,
        spawn: 200,
        bg: "linear-gradient(to bottom,#a18cd1,#fbc2eb)"
    },

    4: {
        speed: 8,
        spawn: 100,
        bg: "linear-gradient(to bottom,#434343,#000000)"
    }
};

$(document).keydown(function (e) {

    let left = parseInt(basket.css("left"));

    if (e.key === "ArrowLeft" && left > 0) {

        basket.css("left", left - 40 + "px");
    }

    if (e.key === "ArrowRight" && left < window.innerWidth - 140) {

        basket.css("left", left + 40 + "px");
    }
});

function createFruit() {

    if (!gameRunning) return;

    let x = Math.random() * (window.innerWidth - 60);

    let fruit = $("<div class='fruit'></div>");

    fruit.css({
        left: x + "px",
        top: "-60px"
    });

    $("#gameArea").append(fruit);
}

function moveFruits() {

    $(".fruit").each(function () {

        let fruit = $(this);

        let top = parseInt(fruit.css("top"));
        let left = parseInt(fruit.css("left"));

        fruit.css("top", top + fruitSpeed + "px");

        let basketLeft = parseInt(basket.css("left"));
        let basketTop = basket.position().top;

        if (

            left < basketLeft + 140 &&
            left + 50 > basketLeft &&
            top + 50 > basketTop

        ) {

            fruit.remove();

            score += 10;

            $("#score").text(score);
        }

        if (top > window.innerHeight) {

            gameRunning = false;

            alert("Game Over!\nFinal Score : " + score);

            location.reload();
        }
    });

    requestAnimationFrame(moveFruits);
}

function startSpawning() {

    clearInterval(spawnInterval);

    spawnInterval = setInterval(createFruit, spawnRate);
}

function changeLevel(level) {

    currentLevel = level;

    fruitSpeed = levels[level].speed;

    spawnRate = levels[level].spawn;

    $("#level").text(level);

    $("#gameArea").css("background", levels[level].bg);

    startSpawning();

    alert("Level " + level);
}

$(".levelBtn").click(function () {

    let level = $(this).data("level");

    changeLevel(level);
});

startSpawning();

moveFruits();

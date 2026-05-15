let game;

class Game {

    constructor() {

        this.score = 0;
        this.level = 1;

        this.enemies = [];
        this.bullets = [];

        this.isGameOver = false;

        this.levelSettings = {

            1: { speed: 2, spawnRate: 2000, bg: "#111" },
            2: { speed: 4, spawnRate: 1500, bg: "#001f3f" },
            3: { speed: 6, spawnRate: 1000, bg: "#3f0000" },
            4: { speed: 8, spawnRate: 700, bg: "#003300" }
        };

        this.enemySpeed = this.levelSettings[1].speed;
        this.spawnRate = this.levelSettings[1].spawnRate;

        this.init();
    }

    init() {

        $(document).on("keydown", (e) => this.handleInput(e));

        this.startSpawning();

        this.applyLevelStyle();

        this.gameLoop();
    }

    startSpawning() {

        clearInterval(this.spawnTimer);

        this.spawnTimer = setInterval(() => {

            this.spawnEnemy();

        }, this.spawnRate);
    }

    handleInput(e) {

        e.preventDefault();

        let player = $("#player");

        let pos = parseInt(player.css("left")) || 0;

        
        if (e.key === "ArrowLeft" && pos > 0) {

            player.css("left", (pos - 30) + "px");
        }

       
        if (e.key === "ArrowRight" && pos < window.innerWidth - 80) {

            player.css("left", (pos + 30) + "px");
        }

        
        if (e.key === " " || e.key === "ArrowUp") {

            this.shoot();
        }
    }

    shoot() {

        let player = $("#player");

        let x = parseInt(player.css("left")) + 25;

        let y = $("#player").position().top;

        let bullet = new Bullet(x, y);

        this.bullets.push(bullet);
    }

    spawnEnemy() {

        if (this.isGameOver) return;

        let x = Math.random() * (window.innerWidth - 60);

        let enemy = new Enemy(x, -60);

        this.enemies.push(enemy);
    }

    updateScore(points) {

        this.score += points;

        $("#score").text(this.score);
    }

    changeLevel(newLevel) {

        this.level = newLevel;

        this.enemySpeed = this.levelSettings[newLevel].speed;

        this.spawnRate = this.levelSettings[newLevel].spawnRate;

        $("#level").text(this.level);

        this.startSpawning();

        this.applyLevelStyle();

        alert("LEVEL " + newLevel);
    }

    applyLevelStyle() {

        $("#game-container").css({
            background: this.levelSettings[this.level].bg
        });
    }

    gameLoop() {

        if (this.isGameOver) return;

        
        this.bullets.forEach((bullet, bIndex) => {

            bullet.move();

            if (bullet.y < -20) {

                bullet.remove();

                this.bullets.splice(bIndex, 1);
            }
        });

        this.enemies.forEach((enemy, eIndex) => {

            enemy.move(this.enemySpeed);

            this.bullets.forEach((bullet, bIndex) => {

                if (enemy.checkCollision(bullet)) {

                    enemy.remove();

                    bullet.remove();

                    this.enemies.splice(eIndex, 1);

                    this.bullets.splice(bIndex, 1);

                    this.updateScore(10);
                }
            });

           
            if (enemy.y > window.innerHeight) {

                this.gameOver();
            }
        });

        requestAnimationFrame(() => this.gameLoop());
    }

    gameOver() {

        this.isGameOver = true;

        clearInterval(this.spawnTimer);

        alert("Game Over!\nFinal Score: " + this.score);

        location.reload();
    }
}

class Bullet {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.element = $("<div class='bullet'></div>");

        this.element.css({

            left: this.x + "px",
            top: this.y + "px"
        });

        $("#game-container").append(this.element);
    }

    move() {

        this.y -= 8;

        this.element.css("top", this.y + "px");
    }

    remove() {

        this.element.remove();
    }
}

class Enemy {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.element = $("<div class='enemy'></div>");

        this.element.css({

            left: this.x + "px",
            top: this.y + "px"
        });

        $("#game-container").append(this.element);
    }

    move(speed) {

        this.y += speed;

        this.element.css("top", this.y + "px");
    }

    checkCollision(bullet) {

        return (

            bullet.x < this.x + 50 &&
            bullet.x + 10 > this.x &&
            bullet.y < this.y + 50 &&
            bullet.y + 20 > this.y
        );
    }

    remove() {

        this.element.remove();
    }
}


$(document).ready(() => {

    game = new Game();

    $("#settingsBtn").click(() => {

        $("#settingsMenu").toggle();
    });

    $(".levelBtn").click(function () {

        let level = parseInt($(this).attr("data-level"));

        game.changeLevel(level);

        $("#settingsMenu").hide();
    });

});

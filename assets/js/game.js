const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 根据窗口大小调整画布
canvas.width = window.innerWidth * 0.9 > 500 ? 500 : window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9 > 800 ? 800 : window.innerHeight * 0.9;

const scoreEl = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let score = 0;
let gameOver = false;

// 玩家
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    draw() {
        ctx.fillStyle = 'cyan';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update() {
        this.x += this.dx;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }
};

const bullets = [];
const enemies = [];
let enemyTimer = 0;

// 更新分数显示
function updateScore() {
    scoreEl.innerText = `分数: ${score}`;
}

// 游戏循环
function gameLoop() {
    if (gameOver) return;
    
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw();

    // 更新和绘制子弹
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // 生成敌人
    enemyTimer++;
    if (enemyTimer % 60 === 0) {
        enemies.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: 2 + Math.random() * 2
        });
    }

    // 更新和绘制敌人
    enemies.forEach((enemy, enemyIndex) => {
        enemy.y += enemy.speed;
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // 敌人与玩家碰撞
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            endGame();
        }

        // 敌人超出边界
        if (enemy.y > canvas.height) enemies.splice(enemyIndex, 1);

        // 子弹与敌人碰撞
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;
                updateScore();
            }
        });
    });
}

function endGame() {
    gameOver = true;
    finalScoreEl.innerText = score;
    gameOverScreen.style.display = 'block';
}

function restartGame() {
    score = 0;
    gameOver = false;
    bullets.length = 0;
    enemies.length = 0;
    updateScore();
    gameOverScreen.style.display = 'none';
    gameLoop();
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === 'ArrowRight') player.dx = player.speed;
    if (e.key === ' ' && !gameOver) { // 空格键射击
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            speed: 7
        });
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

restartButton.addEventListener('click', restartGame);

gameLoop();
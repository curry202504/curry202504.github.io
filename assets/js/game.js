const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth > 500 ? 500 : window.innerWidth;
canvas.height = window.innerHeight > 800 ? 800 : window.innerHeight;

const scoreEl = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let score = 0;
let gameOver = false;

// 【视觉升级】敌人种类
const ENEMY_TYPES = ['👾', '👽', '🛸'];

// 【新增】自动开火的设置
let fireCooldown = 0;
const FIRE_RATE = 20; // 数字越小，射速越快

// 【视觉升级】玩家飞机
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    emoji: '🚀',
    draw() {
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2 + 15);
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

function updateScore() {
    scoreEl.innerText = `分数: ${score}`;
}

function gameLoop() {
    if (gameOver) return;
    
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw();

    // 【新增】自动开火逻辑
    fireCooldown--;
    if (fireCooldown <= 0) {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 15,
            speed: 7
        });
        fireCooldown = FIRE_RATE;
    }

    // 更新和绘制子弹
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        // 【视觉升级】子弹样式
        ctx.fillStyle = '#ffc107'; // 亮黄色
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 10;
        ctx.shadowColor = "yellow";

        if (bullet.y < 0) bullets.splice(index, 1);
    });
    ctx.shadowBlur = 0; // 重置阴影

    // 生成敌人
    enemyTimer++;
    if (enemyTimer % 50 === 0) { // 加快敌人生成速度
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: -40,
            width: 40,
            height: 40,
            speed: 2 + Math.random() * 3,
            emoji: ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)] // 随机选择一个敌人 emoji
        });
    }

    // 更新和绘制敌人
    enemies.forEach((enemy, enemyIndex) => {
        enemy.y += enemy.speed;
        // 【视觉升级】绘制敌人 emoji
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(enemy.emoji, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2 + 10);
        
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            endGame();
        }

        if (enemy.y > canvas.height) enemies.splice(enemyIndex, 1);

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
    gameOverScreen.style.display = 'flex';
    gameOverScreen.style.flexDirection = 'column';
}

function restartGame() {
    score = 0;
    gameOver = false;
    bullets.length = 0;
    enemies.length = 0;
    player.x = canvas.width / 2 - 25; // 重置玩家位置
    updateScore();
    gameOverScreen.style.display = 'none';
    gameLoop();
}

// === 控制器 ===

// 1. 键盘控制 (保留)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === 'ArrowRight') player.dx = player.speed;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

// 2. 【移动端操控】触摸控制
let isTouching = false;
let touchStartX = 0;
let playerStartX = 0;

canvas.addEventListener('touchstart', (e) => {
    if (gameOver) return;
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    // 检查是否触摸到了飞机的大致区域
    if (touchX > player.x && touchX < player.x + player.width && touchY > player.y && touchY < player.y + player.height) {
        isTouching = true;
        touchStartX = touchX;
        playerStartX = player.x;
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (!isTouching || gameOver) return;
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - touchStartX;
    player.x = playerStartX + deltaX;
});

canvas.addEventListener('touchend', (e) => {
    isTouching = false;
});


restartButton.addEventListener('click', restartGame);
gameLoop();

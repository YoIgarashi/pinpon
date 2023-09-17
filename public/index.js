var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x1 = canvas.width / 4;
var y1 = canvas.height - 30;
var dx1 = 0.1;
var dy1 = -0.1;

var x2 = (3 * canvas.width) / 4;
var y2 = canvas.height - 30;
var dx2 = -0.1;
var dy2 = -0.1;

var paddleHeight = 10;
var paddleWidth = 120;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (
                    (x1 > b.x && x1 < b.x + brickWidth && y1 > b.y && y1 < b.y + brickHeight) ||
                    (x2 > b.x && x2 < b.x + brickWidth && y2 > b.y && y2 < b.y + brickHeight)
                ) {
                    dy1 = -dy1;
                    dy2 = -dy2;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("やったね！");
                        document.location.reload();
                        clearInterval(interval); // ゲーム再スタート
                    }
                }
            }
        }
    }
}

function drawBalls() {
    // ボール1を描画
    ctx.beginPath();
    ctx.arc(x1, y1, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    // ボール2を描画
    ctx.beginPath();
    ctx.arc(x2, y2, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

function moveBalls() {
    // ボール1の移動
    x1 += dx1;
    y1 += dy1;

    // ボール2の移動
    x2 += dx2;
    y2 += dy2;
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText("点数： " + score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBalls();
    drawPaddle();
    drawScore();
    collisionDetection();
    moveBalls();

    if (x1 + dx1 > canvas.width - ballRadius || x1 + dx1 < ballRadius) {
        dx1 = -dx1;
    }
    if (y1 + dy1 < ballRadius) {
        dy1 = -dy1;
    } else if (y1 + dy1 > canvas.height - ballRadius) {
        if (x1 > paddleX && x1 < paddleX + paddleWidth) {
            dy1 = -dy1;
        } else {
            alert("まけ");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
        }
    }

    if (x2 + dx2 > canvas.width - ballRadius || x2 + dx2 < ballRadius) {
        dx2 = -dx2;
    }
    if (y2 + dy2 < ballRadius) {
        dy2 = -dy2;
    } else if (y2 + dy2 > canvas.height - ballRadius) {
        if (x2 > paddleX && x2 < paddleX + paddleWidth) {
            dy2 = -dy2;
        } else {
            alert("まけ");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    requestAnimationFrame(draw);
}

var interval; // ゲームループの変数をグローバルスコープに移動

// ゲーム開始時にボタンを表示
document.addEventListener("DOMContentLoaded", function () {
    var startButton = document.getElementById("startButton");
    startButton.style.display = "block";

    // ボタンがクリックされたときの処理
    startButton.addEventListener("click", function () {
        startButton.style.display = "none"; // ボタンを非表示にする
        interval = setInterval(draw, 20); // ゲームループを開始
    });
});
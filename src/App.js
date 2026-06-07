import React, { useEffect, useRef, useState } from 'react';

function App() {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = 600;
    canvas.height = 400;

    const paddleWidth = 10;
    const paddleHeight = 80;
    const ballSize = 12;

    let paddle1Y = canvas.height / 2 - paddleHeight / 2;
    let paddle2Y = canvas.height / 2 - paddleHeight / 2;
    const paddleSpeed = 6;

    let ballX = canvas.width / 2 - ballSize / 2;
    let ballY = canvas.height / 2 - ballSize / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 3;

    let upPressed = false;
    let downPressed = false;

    function drawRect(x, y, w, h, color) {
      context.fillStyle = color;
      context.fillRect(x, y, w, h);
    }

    function drawBall(x, y, size, color) {
      context.fillStyle = color;
      context.fillRect(x, y, size, size);
    }

    function resetBall() {
      ballX = canvas.width / 2 - ballSize / 2;
      ballY = canvas.height / 2 - ballSize / 2;
      ballSpeedX = -ballSpeedX;
      ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
    }

    function drawScore() {
      const fontSize = 24;
      context.fillStyle = 'white';
      context.font = fontSize + 'px Arial';
      context.textAlign = 'center';
      context.fillText(`Player 1: ${score1}`, canvas.width / 4, fontSize + 10);
      context.fillText(`Player 2: ${score2}`, (canvas.width / 4) * 3, fontSize + 10);
    }

    function update() {
      // Move paddles
      if (upPressed && paddle1Y > 0) paddle1Y -= paddleSpeed;
      if (downPressed && paddle1Y < canvas.height - paddleHeight) paddle1Y += paddleSpeed;

      // Simple AI for paddle 2
      if (paddle2Y + paddleHeight / 2 < ballY + ballSize / 2) {
        paddle2Y += paddleSpeed * 0.6;
      } else {
        paddle2Y -= paddleSpeed * 0.6;
      }

      // Keep paddle 2 in bounds
      if (paddle2Y < 0) paddle2Y = 0;
      if (paddle2Y > canvas.height - paddleHeight) paddle2Y = canvas.height - paddleHeight;

      // Move ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Ball collision with top/bottom
      if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY = -ballSpeedY;
      }

      // Ball collision with paddles
      if (
        ballX <= paddleWidth &&
        ballY + ballSize >= paddle1Y &&
        ballY <= paddle1Y + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX;
        // Adjust angle
        let collidePoint = (ballY + ballSize / 2) - (paddle1Y + paddleHeight / 2);
        ballSpeedY = collidePoint * 0.3;
      } else if (
        ballX + ballSize >= canvas.width - paddleWidth &&
        ballY + ballSize >= paddle2Y &&
        ballY <= paddle2Y + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX;
        // Adjust angle
        let collidePoint = (ballY + ballSize / 2) - (paddle2Y + paddleHeight / 2);
        ballSpeedY = collidePoint * 0.3;
      }

      // Ball out of bounds => update score and reset
      if (ballX < 0) {
        setScore2(prev => prev + 1);
        resetBall();
      } else if (ballX > canvas.width) {
        setScore1(prev => prev + 1);
        resetBall();
      }
    }

    function draw() {
      // Clear canvas
      drawRect(0, 0, canvas.width, canvas.height, 'black');
      // Draw paddles
      drawRect(0, paddle1Y, paddleWidth, paddleHeight, 'white');
      drawRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight, 'white');
      // Draw ball
      drawBall(ballX, ballY, ballSize, 'white');
      // Draw score
      drawScore();
    }

    function gameLoop() {
      update();
      draw();
      if (gameStarted) {
        requestAnimationFrame(gameLoop);
      }
    }

    function keyDownHandler(event) {
      if (event.key === 'ArrowUp' || event.key === 'w') {
        upPressed = true;
      } else if (event.key === 'ArrowDown' || event.key === 's') {
        downPressed = true;
      }
    }

    function keyUpHandler(event) {
      if (event.key === 'ArrowUp' || event.key === 'w') {
        upPressed = false;
      } else if (event.key === 'ArrowDown' || event.key === 's') {
        downPressed = false;
      }
    }

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    if (gameStarted) {
      requestAnimationFrame(gameLoop);
    }

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, [gameStarted, score1, score2]);

  return (
    <div style={{ textAlign: 'center', color: 'white' }}>
      <h1>Pong Game</h1>
      <canvas ref={canvasRef} style={{ border: '2px solid white', backgroundColor: 'black' }}></canvas>
      {!gameStarted && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => setGameStarted(true)} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Start Game
          </button>
        </div>
      )}
      {gameStarted && (
        <p>Use W/S or Up/Down arrows to move the left paddle.</p>
      )}
    </div>
  );
}

export default App;
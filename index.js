$(function () {
  let didUserStartClick = false,
    progressBarInterval = false,
    gameOver = false,
    selectedBoxIds = [],
    onClickScore = 10,
    totalScore = 0;

  let hiscore = localStorage.getItem("hiscore") || 0;

  $("#hiscore").text(hiscore);

  $("#afterStart").css("display", "none");
  $("#gameRestart").css("display", "none");
  $("#gameOverMessage").css("display", "none");

  function progressBar() {
    $("#progress").width(0);
    if (didUserStartClick) {
      progressBarInterval = setInterval(() => {
        currWidth = $("#progress").width();
        if (currWidth < 300) {
          $("#progress").width(currWidth + 3);
          onClickScore -= 0.1;
        }
      }, 10);
    }
  }

  function beginGame() {
    const didBeginGameInterval = setInterval(() => {
      let currTime = $("#beforeStart").text();
      $("#beforeStart").text(currTime - 1);
      if (currTime <= 1) {
        clearInterval(didBeginGameInterval);
        $("#beforeStart").css("display", "none");
        $("#afterStart").css("display", "block");
        for (let i = 0; i < 3; i++) {
          const randomNum = Math.floor(Math.random() * 16) + 1;
          selectedBoxIds.push(randomNum);
          $(`#${randomNum}`).css("background", "black");
          $(`#${randomNum}`).click(function () {
            boxClickHandler(randomNum);
          });
        }
      }
    }, 1000);
  }

  function animateRestartMessage() {
    setInterval(() => {
      $("#gameRestart").toggleClass("animate");
    }, 300);
  }

  function initTimer() {
    setInterval(function () {
      if (didUserStartClick && !gameOver) {
        let timer = $("#time").text();
        if (timer > 1) {
          $("#time").text(timer - 1);
        } else {
          $("#time").text(0);
          $("#gameOverMessage").css("display", "block");
          $("#gameRestart").css("display", "block");
          gameOver = true;
          if (totalScore > hiscore) {
            localStorage.setItem("hiscore", totalScore);
            $("#gameOverMessage").text("New Hiscore");
            $.confetti.start();
            setTimeout(() => {
              $.confetti.stop();
            }, 2000);
          }
        }
      }
    }, 1000);
  }

  function boxClickHandler(id) {
    if (!didUserStartClick) {
      $("#userMessage").fadeOut(500);
    }

    if (gameOver) {
      return;
    }

    didUserStartClick = true;

    if (selectedBoxIds.includes(id)) {
      $(`#${id}`)
        .css("background-color", "green")
        .text(`+${Math.ceil(onClickScore)}`)
        .animate({ "background-color": "white" }, 300, function () {
          $(this).text("");
        });

      totalScore += Math.ceil(onClickScore);
      $("#score").text(totalScore);

      let randomNum = Math.floor(Math.random() * 16) + 1;

      while (selectedBoxIds.includes(randomNum)) {
        randomNum = Math.floor(Math.random() * 16) + 1;
      }

      selectedBoxIds = selectedBoxIds.filter(function (val) {
        return val !== id;
      });

      $(`#${randomNum}`).animate({ "background-color": "black" }, 200);
      $(`#${randomNum}`).click(function () {
        boxClickHandler(randomNum);
      });

      selectedBoxIds.push(randomNum);

      if (progressBarInterval != false) {
        clearInterval(progressBarInterval);
      }
      progressBar();
      onClickScore = 10;
    }
  }

  beginGame();
  initTimer();
  animateRestartMessage();
});

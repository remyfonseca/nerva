const circularProgressBar = document.querySelector('#circularProgressBar');
const circularProgressBarNumber = document.querySelector('#circularProgressBar .progress-value');
const buttonTypePomodoro = document.querySelector('#buttonTypePomodoro');
const buttonTypeShortBreak = document.querySelector('#buttonTypeShortBreak');
const buttonTypeLongBreak = document.querySelector('#buttonTypeLongBreak');
const audio = new Audio('alarm.mp3');
const pomodoroTimerInSeconds = 1500;
const shortBreakTimerInSeconds = 300
const longBreakTimerInSeconds = 900;
const TIMER_TYPE_POMODORO = 'POMODORO';
const TIMER_TYPE_SHORT_BREAK = 'SHORTBREAK';
const TIMER_TYPE_LONG_BREAK = 'LONGBREAK';

let progressInterval;
let pomodoroType = TIMER_TYPE_POMODORO;
let timerValue = pomodoroTimerInSeconds;
let multiplierFactor = 360 / timerValue;


function formatNumberInStringMinute(number) {
    const minutes = Math.floor(number / 60);
    const seconds = number % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes} : ${formattedSeconds}`;
}


const startTimer = () =>{
    if(!progressInterval) {
        progressInterval = setInterval(() =>{
            timerValue--;
            setInfoCircularProgressBar();
        }, 1000)
    }
}

const stopTimer = () => clearInterval(progressInterval);

const resetTimer = () => {
    clearInterval(progressInterval);

    if (pomodoroType === TIMER_TYPE_POMODORO) {
        timerValue = pomodoroTimerInSeconds;
    } else if (pomodoroType === TIMER_TYPE_SHORT_BREAK) {
        timerValue = shortBreakTimerInSeconds;
    } else {
        timerValue = longBreakTimerInSeconds;
    }

    multiplierFactor = 360 / timerValue;
    setInfoCircularProgressBar();

    audio.pause();
}


function setInfoCircularProgressBar(){
    if(timerValue === 0){
        stopTimer();
        audio.play();
    }

    circularProgressBarNumber.textContent = `${formatNumberInStringMinute(timerValue)}`;

    circularProgressBar.style.background = `conic-gradient(var(--blue) ${timerValue * multiplierFactor}deg, var(--purple) 0deg)`;
}

const setPomodoroType = (type) => {
    pomodoroType = type;

    if (type === TIMER_TYPE_POMODORO) {
        timerValue = pomodoroTimerInSeconds;
        buttonTypeShortBreak.classList.remove("active");
        buttonTypeLongBreak.classList.remove("active");
        buttonTypePomodoro.classList.add("active");
    } else if (type === TIMER_TYPE_SHORT_BREAK) {
        timerValue = shortBreakTimerInSeconds;
        buttonTypePomodoro.classList.remove("active");
        buttonTypeLongBreak.classList.remove("active");
        buttonTypeShortBreak.classList.add("active");
    } else {
        timerValue = longBreakTimerInSeconds;
        buttonTypePomodoro.classList.remove("active");
        buttonTypeShortBreak.classList.remove("active");
        buttonTypeLongBreak.classList.add("active");
    }

    resetTimer();
};


let player;
let isPlaying = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: 'jfKfPfyJRdk',
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  const toggleButton = document.getElementById('toggleAudio');
  toggleButton.addEventListener('click', function() {
    if (isPlaying) {
      player.pauseVideo();
      isPlaying = false;
      toggleButton.textContent = 'Play';
    } else {
      player.playVideo();
      isPlaying = true;
      toggleButton.textContent = 'Pause';
    }
  });
}

let volumeOriginal = 100;

function changeVolume() {
    const volumeControl = document.getElementById('volumeControl');
    const newVolume = parseInt(volumeControl.value);
    player.setVolume(newVolume);

    const volumeValueSpan = document.getElementById('volumeValue');
    volumeValueSpan.textContent = `Volume: ${newVolume}%`;
}
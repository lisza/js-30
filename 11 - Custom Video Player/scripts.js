// Get elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreenButton = player.querySelector('.fullscreen');

// Build functions
function togglePlay() {
  // paused property is on the video  
  video.paused ? video.play() : video.pause();
}

function updatePlayButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

function skip() {
  // parseFloat convets our skip string to a number
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  // this.name returns the property volume or playbackRate of the video element
  // this.value is its value, changed by the range sliders
  video[this.name] = this.value;
}

function handleProgress() {
  // currentTime and duration are properties of video
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = video.duration * (e.offsetX / progress.offsetWidth);
  video.currentTime = scrubTime;
}

function enterFullscreen() {
  video.webkitRequestFullscreen();
}

// Hook up event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(skipButton => {
  skipButton.addEventListener('click', skip);
}) 

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
// The below is short for: if (mousedown) scrub()
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

fullscreenButton.addEventListener('click', enterFullscreen);

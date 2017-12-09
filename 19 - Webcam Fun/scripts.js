const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  // Get user's video camera, returns a promise
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      // Convert MediaStream into a playable video url
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(`Oh no!`, err);
    });
}

function paintToCanvas() {
  // Canvas has to be sam ewidth and height as video
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width, height);
  canvas.width = width;
  canvas.height = height;
  
  // return setInterval so that we later have access to it and can clear it or so
  return setInterval(() => {
    // pass an image or video element to drawImage.
    //Every 16 milliseconds we are painting a frame from video to canvas.
    ctx.drawImage(video, 0, 0, width, height); 
    // Take out pixels
    let pixels = ctx.getImageData(0, 0, width, height);
    // Modify pixels
    // pixels = redEffect(pixels);
    pixels = rgbSplit(pixels);
    // Ghost effect! Stacking a transparent version of the current image on top
    ctx.globalAlpha = 0.1; 
    // Put pixels back
    ctx.putImageData(pixels, 0, 0)
    
  }, 16);
}

function takePhoto() {
  // Play photo snap audio sound
  snap.currentTime = 0;
  snap.play; 
  
  // Take the data out of the canvas
  // Returns base64 text based represention of the image/picture frame
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'my_webcam_photo');
  link.innerHTML = `<img src="${data}" alt="webcam snapshot"/>`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
    // pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    // pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue    
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // red
    pixels.data[i + 100] = pixels.data[i + 1]; // green
    pixels.data[i - 150] = pixels.data[i + 2]; // blue    
  }
  return pixels;
}

getVideo();

// Listen for 'canplay' event on video, then paintToCanvas
// A playing video emits the 'canplay' event
video.addEventListener('canplay', paintToCanvas);

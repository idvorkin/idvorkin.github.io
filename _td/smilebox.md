---
title: Smilebox
permalink: /smilebox
layout: post
---

<script src="https://unpkg.com/@grammarly/editor-sdk?clientId=client_AMv8Ek2YNBrCaW2gfCXEa5"> </script>
<script src="assets/js/face-api.js"></script>
<script src="js/commons.js"></script>
<script src="assets/js/faceDetectionControls.js"></script>
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.css">
<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js"></script>

<!--

Trick to make children on top of each other

https://stackoverflow.com/questions/50083512/placing-two-divs-on-top-of-each-other-without-using-positionabsolute

-->

<style>
.parent-for-overlay {
  display: grid;
  grid-template-columns: 1fr;
}

.parent-for-overlay .overlay {
 grid-row-start: 1;
 grid-column-start: 1;
}
</style>

<div class="parent-for-overlay">
  <video class="overlay" onloadedmetadata="onPlay(this)" id="inputVideo" autoplay muted playsinline ></video>
  <canvas class="overlay" id="overlay" />
</div>

<label for="fps">Estimated Fps:</label> <input disabled value="-" id="fps" type="text" class="bold">

<script>
let forwardTimes = []
let predictedAges = []
let withBoxes = true

function onChangeHideBoundingBoxes(e) {
  withBoxes = !$(e.target).prop('checked')
}

function getCurrentFaceDetectionNet() {
    //  hardcode to tiny face
    return faceapi.nets.tinyFaceDetector
}

function interpolateAgePredictions(age) {
  predictedAges = [age].concat(predictedAges).slice(0, 30)
  const avgPredictedAge = predictedAges.reduce((total, a) => total + a) / predictedAges.length
  return avgPredictedAge
}

function getFaceDetectorOptions() {
    new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
}

function isFaceDetectionModelLoaded() {
  return !!getCurrentFaceDetectionNet().params
}


async function onPlay() {
  const videoEl = $('#inputVideo').get(0)

  if(videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded()) {
    // Try again until loaded
    return setTimeout(() => onPlay(),1000)
  }

  const options = getFaceDetectorOptions()

  const ts = Date.now()
  const result = await faceapi.detectSingleFace(videoEl, options)
    .withAgeAndGender()

  if (result) {
    const canvas = $('#overlay').get(0)
    const dims = faceapi.matchDimensions(canvas, videoEl, true)

    const resizedResult = faceapi.resizeResults(result, dims)
    if (withBoxes) {
      faceapi.draw.drawDetections(canvas, resizedResult)
    }
    const { age, gender, genderProbability } = resizedResult

    // interpolate gender predictions over last 30 frames
    // to make the displayed age more stable
    const interpolatedAge = interpolateAgePredictions(age)
    new faceapi.draw.DrawTextField(
      [
        `${faceapi.utils.round(interpolatedAge, 0)} years`,
        `${gender} (${faceapi.utils.round(genderProbability)})`
      ],
      result.detection.box.bottomLeft
    ).draw(canvas)
  }

  updateTimeStats(Date.now() - ts)
  setTimeout(() => onPlay())
}

async function run() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
  const videoEl = $('#inputVideo').get(0)
  videoEl.srcObject = stream
  model_path = '/assets/models'
  // await changeFaceDetector(TINY_FACE_DETECTOR)
  await faceapi.nets.ssdMobilenetv1.load(model_path)
  await faceapi.nets.ageGenderNet.load(model_path)
  await faceapi.nets.tinyFaceDetector.load(model_path)

  // Put canvas on top of the video

  var w = videoEl.offsetWidth;
  var h = videoEl.offsetHeight;
  var cv = document.getElementById("canvas");
  cv.width = w;
  cv.height =h;

  // try to access users webcam and stream the images
  // to the video element
}

function updateResults() {}

function updateTimeStats(timeInMs) {
  forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
  const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
  $('#time').val(`${Math.round(avgTimeInMs)} ms`)
  $('#fps').val(`${faceapi.utils.round(1000 / avgTimeInMs)}`)
}

$(document).ready(function() {
    run()
  // initFaceDetectionControls()
})
</script>

Using this wonderful library: @ <https://github.com/justadudewhohacks/face-api.js/>

---
title: Smilebox
permalink: /smilebox
layout: post
---

Way back in 2012 I had this idea to make a Smilebox. The tech wasn't good enough, but in 2023 tech is right ready. Here's quoting the original blog post ... Nothing makes me happier then seeing someone smile. In fact, seeing others smile makes me smile. As a result, I’m creating a box that captures smiles, which I'm calling a smile box. If you look at the smile box, you’ll see the smiles that are already captured . If you smile at the box, it’ll capture your smile and add it to the box.

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

class Smoother
{
    constructor(){
        this.values=[]
    }
    smooth(value){
      this.values = [value].concat(this.values).slice(0, 10)
      const avg = this.values.reduce((total, a) => total + a) / this.values.length
      return avg
    }
}

// Happy smoother should be closer to exponential backoff
class HappySmoother
{
    constructor(){
        this.hold_frames=10
        this.backoff=0
        this.last_value
    }
    smooth(value){
        if (value == NaN)
            return 0
        if (value > 0.5)
        {
            this.backoff = this.hold_frames
            this.last_value = value
        }
        this.backoff = this.backoff - 1
        if (this.backoff < 0)
        {
            return 0
        }
        return this.last_value
    }
}

let forwardTimes = []
const ageSmoother = new Smoother()
const happySmoother = new HappySmoother()
let withBoxes = true

function onChangeHideBoundingBoxes(e) {
  withBoxes = !$(e.target).prop('checked')
}

function getCurrentFaceDetectionNet() {
    //  hardcode to tiny face
    return faceapi.nets.tinyFaceDetector
}

function interpolateHappy(happy) {
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
  let result = 0
  let face = 0


  face =  faceapi.detectSingleFace(videoEl, options)
  if (!face)
  {
      return
  }

  result = await face.withFaceExpressions()

  updateTimeStats(Date.now() - ts)
  expressions =  null

  if (result) {
      expressions = result.expressions
      const canvas = $('#overlay').get(0)
          const dims = faceapi.matchDimensions(canvas, videoEl, true)

          const resizedResult = faceapi.resizeResults(result, dims)
          const minConfidence = 0.05
          if (withBoxes) {
              faceapi.draw.drawDetections(canvas, resizedResult)
          }
      // faceapi.draw.drawFaceExpressions(canvas, resizedResult, minConfidence)
      // console.log (result)
  }

  result = await face.withAgeAndGender()

  if (result) {
    const canvas = $('#overlay').get(0)
    const dims = faceapi.matchDimensions(canvas, videoEl, true)

    const resizedResult = faceapi.resizeResults(result, dims)
    if (withBoxes) {
      faceapi.draw.drawDetections(canvas, resizedResult)
    }
    const { age, gender, genderProbability } = resizedResult
    emotions = []
    if (expressions)
    {
        // Consider doing this via destructirng
        const {happy, sad, neutral, surprised}  = expressions
        smoothedHappy = happySmoother.smooth(happy)
        if (smoothedHappy > 0.4)
        {
            emotions.push(`happy:${smoothedHappy}`)
        }
    }

    // interpolate gender predictions over last 30 frames
    // to make the displayed age more stable
    const interpolatedAge = ageSmoother.smooth(age)
    let output =
    [
        `${faceapi.utils.round(interpolatedAge, 0)} years`,
        `${gender} (${faceapi.utils.round(genderProbability)})`,
    ]
    if (emotions.length > 0 ){
        output.push(...emotions)
    }
    new faceapi.draw.DrawTextField(
      output,
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
  await faceapi.nets.ageGenderNet.load(model_path)
  await faceapi.nets.tinyFaceDetector.load(model_path)
  await faceapi.loadFaceExpressionModel(model_path)

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

Nothing makes me happier then seeing someone smile. In fact, seeing others smile makes me smile. As a result, I’m creating a box that captures smiles, which I'm calling a smile box. If you look at the smile box, you’ll see the smiles that are already captured . If you smile at the box, it’ll capture your smile and add it to the box.

See the rest of the post (and what it turned into) here: <https://igsmilebox.blogspot.com/2012/12/what-is-smilebox.html>

My original journal entry

{%include blob_image_float_right.html src="blog/firstsmilebox.jpg" %}

Using this wonderful library: @ <https://github.com/justadudewhohacks/face-api.js/>

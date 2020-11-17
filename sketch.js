let video;
let poseNet;
let pose;
let fadeOut;

const treshHold = 100;
const offSet = 5

let valueOne;
let valueTwo;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, 'single', modelLoaded);
  poseNet.on('pose', gotPose);

  // Set up the axes Settings from Bkg-Glyph to be put in the CSS-Property
  valueOne = random(0, 100);
  valueTwo = random(0, 100);
  let newSettings = createCSSSettings(valueOne, valueTwo);
  console.log("Current varSettings to be played are:", newSettings)
  document.getElementById("bkgGlyph").style.setProperty("font-variation-settings", newSettings);
}


function modelLoaded() {
  console.log('poseNet ready!');
}


function gotPose(poses) {
  if (poses[0].pose.score >= 0.35) {
    pose = poses[0].pose;
  }
}


// ################
// Helper Functions
// ################

function checkValues(axisOne, axisTwo) {
  let statment1 = false;
  let statment2 = false;

  if (axisOne >= (valueOne - offSet) && axisOne <= (valueOne + offSet)) {
    statment1 = true;
  }
  if (axisTwo >= (valueTwo - offSet) && axisTwo <= (valueTwo + offSet)) {
    statment2 = true;
  }
  /**console.log({
      startValue1: valueOne,
      currValue1: axisOne,
      areClose1: statment1,
      startValue2: valueTwo,
      currValue2: axisTwo,
      areClose2: statment2
    })
  **/
  if (statment1 && statment2) {
    return true;
  }
  else {
    return false;
  }
}

function distKeyPts(keyPtOne, keyPtTwo) {
  return dist(keyPtOne.x, keyPtOne.y, keyPtTwo.x, keyPtTwo.y);
}

function angleKeyPts(keyPtOne, keyPtTwo) {
  v1 = createVector(keyPtOne.x, keyPtOne.y);
  // Angles still gives back weird values 
  // it seems to be the wrong calculation
  return degrees(atan2(keyPtOne.x, keyPtOne.y));
}

function createCSSSettings(valueAxisOne, valueAxisTwo) {
  // Set up the axes Settings to be put in the CSS-Property
  let varSettings = '"SLON" ' + valueAxisOne;
  varSettings += ", ";
  varSettings += '"SLTW" ' + valueAxisTwo;
  return varSettings;
}

// ################
// Drawing Function 
// ################

function draw() {
  image(video, 0, 0);

  if (pose) {

    let distHands = distKeyPts(pose.leftWrist, pose.rightWrist);
    let axisOne = map(distHands, 50, width - 100, 0, 100, true)
    // console.log(distHands, axisOne);

    // Map the second Axes value to Nose-x position
    let axisTwo = map(pose.nose.y, 50, height / 2 - 50, 0, 100, true);

    newSettings = createCSSSettings(axisOne, axisTwo);
    document.getElementById("sampleGlyph").style.setProperty("font-variation-settings", newSettings);

    // Draw Ellipse at Nose and Wrist Positions
    strokeWeight(0);
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, 15)

    fill(0, 0, 255);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 15);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 15);

    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(50, 50, width - 100, height / 2);

    if (checkValues(axisOne, axisTwo)) {
      fadeOut = 255;
    }

    if (fadeOut > 0) {
      fill(255, 255, 255, fadeOut);
      noStroke();
      textSize(92);
      textAlign(CENTER, CENTER)
      text('WINNER!', 10, 10, width - 10, height - 10);
      fadeOut -= 10;
    }

  }
}
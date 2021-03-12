let video;
let poseNet;
let pose;
let fadeOut;
let valueOne;
let valueTwo;
let reloadTimer;

const xMargin = 100;
const yMargin = 75;
const treshHold = 100;
const offSet = 35;
reloadTimer = 0;

// Choose random play font on each site reload
var fontArray = [
  "AngryU",
  "Blinky",
  "CircleAndSquare",
  "FatSheriff",
  "FlexK",
  "InlineA",
  "RotatO",
  "SlantedQ",
  "StachelBallon",
  "WackelVudding",
];
var randomFont = fontArray[Math.floor(Math.random() * fontArray.length)];
var playFont = new FontFace("playFont", "url(/fonts/" + randomFont + ".ttf)");
playFont
  .load()
  .then(function (loaded_face) {
    document.fonts.add(loaded_face);
    document.body.style.fontFamily = "" + playFont + "";
  })
  .catch(function (error) {
    console.log("Error.");
  });

function setup() {
  var canvas = createCanvas(640, 480);

  canvas.parent("canvas-holder");
  video = createCapture(VIDEO);
  video.hide();

  // Set up the axes Settings from Bkg-Glyph to be put in the CSS-Property
  valueOne = random(0, 1000);
  valueTwo = random(0, 1000);
  let newSettings = createCSSSettings(valueOne, valueTwo);
  console.log("Current varSettings to be played are:", newSettings);
  document
    .getElementById("bkgGlyph")
    .style.setProperty("font-variation-settings", newSettings);

  poseNet = ml5.poseNet(video, "single", modelLoaded);
  poseNet.on("pose", gotPose);

  textSize(50);
  textAlign(CENTER, CENTER);
}

function modelLoaded() {
  console.log("poseNet ready!");
}

function gotPose(poses) {
  if (poses[0].pose.score >= 0.25) {
    pose = poses[0].pose;
  }
}

// ################
// Helper Functions
// ################

function checkValues(axisOne, axisTwo) {
  let statment1 = false;
  let statment2 = false;

  if (axisOne >= valueOne - offSet && axisOne <= valueOne + offSet) {
    statment1 = true;
  }
  if (axisTwo >= valueTwo - offSet && axisTwo <= valueTwo + offSet) {
    statment2 = true;
  }
  /*
  console.log({
    startValue1: valueOne,
    currValue1: axisOne,
    areClose1: statment1,
    startValue2: valueTwo,
    currValue2: axisTwo,
    areClose2: statment2
  })
*/
  if (statment1 && statment2) {
    return true;
  } else {
    return false;
  }
}

function distKeyPts(keyPtOne, keyPtTwo) {
  return dist(keyPtOne.x, keyPtOne.y, keyPtTwo.x, keyPtTwo.y);
}

function distKeyPtsX(keyPtOne, keyPtTwo) {
  return dist(keyPtOne.x, 0, keyPtTwo.x, 0);
}

function angleKeyPts(keyPtOne, keyPtTwo) {
  v1 = createVector(keyPtOne.x, keyPtOne.y);
  // Angle still gives back weird values
  // it seems to be the wrong calculation
  return degrees(atan2(keyPtOne.x, keyPtOne.y));
}

function createCSSSettings(valueAxisOne, valueAxisTwo) {
  // Set up the axes Settings to be put in the CSS-Property
  let varSettings = '"AONE" ' + valueAxisOne;
  varSettings += ", ";
  varSettings += '"ATWO" ' + valueAxisTwo;
  return varSettings;
}

// ################
// Drawing Function
// ################

function draw() {
  // Mirror the Video image
  push();
  translate(width, 0);
  scale(-1, 1);
  fill(255);
  rect(0, 0, width, height);
  tint(255, 255);
  image(video, 0, 0);
  filter(GRAY);

  // Draw debuggin lines for Head tracking
  stroke("#fff");
  strokeWeight(5);
  // Boundries for x-Tracking
  // line(xMargin, 0, xMargin, height);
  // line(width - xMargin, 0, width - xMargin, height);

  // Boundries for y-Tracking
  // line(0, yMargin, width, yMargin);
  // line(0, height - yMargin * 4, width, height - yMargin * 4);

  if (pose) {
    let distHands = distKeyPts(pose.leftWrist, pose.rightWrist);
    // let axisTwo = map(distHands, xMargin, width - xMargin, 0, 1000, true)

    let axisTwo = map(
      pose.nose.y,
      yMargin,
      height - yMargin * 4,
      0,
      1000,
      true
    );
    // console.log(distHands, axisOne);

    // Map the second Axes value to Nose-x position
    let axisOne = map(distHands, 10, 220, 0, 1000, true);

    newSettings = createCSSSettings(axisOne, axisTwo);
    document
      .getElementById("activeGlyph")
      .style.setProperty("font-variation-settings", newSettings);

    // Draw Ellipse at Nose and Wrist Positions
    strokeWeight(0);
    // fill('#F55428');

    fill("#fff");
    ellipse(pose.nose.x, pose.nose.y, 15);

    fill("#fff");
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 15);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 15);

    /*
     fill('#9A9B9F')
     ellipse(pose.leftShoulder.x, pose.leftShoulder.y, 15);
     ellipse(pose.rightShoulder.x, pose.rightShoulder.y, 15);
    
     ellipse(pose.leftShoulder.x, pose.leftShoulder.y, 15);
     ellipse(pose.leftElbow.x, pose.leftElbow.y, 15);

     ellipse(pose.leftHip.x, pose.leftHip.y, 15);
     ellipse(pose.rightHip.x, pose.rightHip.y, 15);

     ellipse(pose.leftKnee.x, pose.leftKnee.y, 15);
     ellipse(pose.rightHip.x, pose.rightHip.y, 15);

     ellipse(pose.leftAnkle.x, pose.leftAnkle.y, 15);
     ellipse(pose.leftAnkle.x, pose.leftAnkle.y, 15);
     */
    /*
        noFill();
        stroke(255, 255, 255);
        strokeWeight(2);
        rect(50, 50, width - 100, height / 2);
    */

    if (checkValues(axisOne, axisTwo)) {
      fadeOut = 255;
      console.log(reloadTimer);
      if (reloadTimer > 300) {
        window.location.reload();
      }
      reloadTimer += 20;
    }

    if (fadeOut > 0) {
      text("🤨", pose.nose.x, pose.nose.y);
      fill(0, 0, 0, fadeOut);
      noStroke();
      text("😎", pose.nose.x, pose.nose.y);
      fadeOut -= 45;
    } else {
      text("🤨", pose.nose.x, pose.nose.y);
      reloadTimer = 0;
    }

    pop();
  }
}

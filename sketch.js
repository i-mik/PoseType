let video;
let poseNet;
let pose;
let treshHold = 100;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, 'single', modelLoaded);
  poseNet.on('pose', gotPose);
}

function modelLoaded() {
  console.log('poseNet ready!');
}

function gotPose(poses) {
  if (poses[0].pose.score >= 0.35) {
    pose = poses[0].pose;
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

function drawFace() {
  for (i = 0; i < 5; i++) {
    let keyPt = pose.keypoints[i];
    ellipse(keyPt.position.x, keyPt.position.y, 15);
  }
}


function draw() {
  image(video, 0, 0);
  // filter(GRAY);
 // background(200)

  if (pose) {
    // Calculate distance between Hands an map distance Value to Axes Value between 0 and 100
    // let distHands = distKeyPts(pose.leftWrist, pose.rightWrist);
    // distHands = map(distHands, 10, width - treshHold, 0, 100, true);

    // Calculate Angle Between Both Hands
     let angleHands = angleKeyPts(pose.leftWrist, pose.rightWrist);
    console.log(angleHands);

    // Map the second Axes value to Nose-x position
    let nosePosition = map(pose.nose.x, 0, height, 0, 100, true);

    // Set up the axes Settings to be put in the CSS-Property
    let varSettings = '"SLON" ' + angleHands;
    varSettings += ", ";
    varSettings += '"SLTW" ' + nosePosition;
    document.getElementById("sampleGlyph").style.setProperty("font-variation-settings", varSettings);
    // console.log(varSettings)

    // Draw Ellipse at Nose and Wrist Positions
    strokeWeight(0);
    fill(255, 0, 0);
    drawFace();

    fill(0, 0, 255);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 15)
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 15)
  }
}
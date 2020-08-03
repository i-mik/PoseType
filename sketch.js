/*
PoseNet Example for Kinetic Type Installation
based on CodingTrain Tutorial: ml5.js Pose Estimation with PoseNet
https://www.youtube.com/watch?v=OIo-DIOkNVg
*/

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
  let confScore = poses[0].pose.score;
  if (poses[0].pose.score >= 0.35) {
    pose = poses[0].pose;
  }
}

function draw() {
  image(video, 0, 0);
  filter(GRAY);

  if (pose) {
    let wristL = pose.leftWrist;
    let wristR = pose.rightWrist;

    // Calculate distance between Hands an map distance Value to Axes Value between 0 and 100
    let distantHands = map(dist(wristL.x, wristL.y, wristR.x, wristR.y), 0, width - treshHold, 0, 100);
    
    // Map the second Axes value to Nose-x position
    let nosePosition = map(pose.nose.x, 0, height, 0, 100);
    
    // Set up the axes Settings to be put in the CSS-Property
    let varSettings = '"SLON" ' + nosePosition;
    varSettings += ", ";
    varSettings += '"SLTW" ' + distantHands;
    document.getElementById("sampleGlyph").style.setProperty("font-variation-settings", varSettings);

    // Draw Ellipse at Nose and Wrist Positions
    strokeWeight(0);
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, 15);

    fill(0, 0, 255);
    ellipse(wristL.x, wristL.y, 15)
    ellipse(wristR.x, wristR.y, 15)
  }

}
// ################
// Change Variables
// ################
const xMargin = 100;
const yMarginTop = 75;
const yMarginBottom = 250;
const threshold = 35;
let debugTrackingBoundaries = true;

// ################
// Helper Functions
// ################
let video;
let poseNet;
let pose;
let fadeOut;
let endPtAONE;
let endPtATWO;
let reloadTimer;

function modelLoaded() {
  console.log("poseNet ready!");
}

function gotPose(poses) {
  if (poses[0].pose.score >= 0.25) {
    pose = poses[0].pose;
  }
}

// Choose a random font on each reload
// To add new fonts to the game, copy to fonts directory
// and add a new line with the exact file name to fontNames.txt
// TODO: Find an automated solution that reads from file directory
function chooseActiveFont(result) {
  let randomFont = random(result);
  let activeFont = new FontFace("activeFont", "url(/fonts/" + randomFont + ")");
  activeFont
    .load()
    .then(function (loaded_face) {
      document.fonts.add(loaded_face);
      document.body.style.fontFamily = "" + activeFont + "";
    })
    .catch(function (error) {
      console.log("Error.");
    });
}

function between(x, min, max) {
  return x >= min && x <= max;
}

function checkValues(AONE, ATWO) {
  // Check if the current user values
  // are within the range of the end points +- threshold
  let conditionAONE = false;
  let conditionATWO = false;

  if (between(AONE, endPtAONE - threshold, endPtAONE + threshold)) {
    conditionAONE = true;
  }
  if (between(ATWO, endPtATWO - threshold, endPtATWO + threshold)) {
    conditionATWO = true;
  }
  if (conditionAONE && conditionATWO) {
    return true;
  } else {
    return false;
  }
}

function distance(keyPtOne, keyPtTwo) {
  return dist(keyPtOne.x, keyPtOne.y, keyPtTwo.x, keyPtTwo.y);
}

function createCSSSettings(valueAOne, valueATwo) {
  // Set up the axes Settings to be put into the CSS-Property
  let varSettings = '"AONE" ' + valueAOne;
  varSettings += ", ";
  varSettings += '"ATWO" ' + valueATwo;
  return varSettings;
}

// ################
// Drawing Function
// ################

function preload() {
  loadStrings("fontNames.txt", chooseActiveFont);
}

function setup() {
  var canvas = createCanvas(640, 480);

  canvas.parent("canvas-holder");
  video = createCapture(VIDEO);
  video.hide();

  poseNet = ml5.poseNet(video, "single", modelLoaded);
  poseNet.on("pose", gotPose);

  reloadTimer = 0;
  // Evaluate random end points for each varFont axis
  endPtAONE = random(0, 1000);
  endPtATWO = random(0, 1000);
  console.log(endPtAONE, endPtATWO);
  let newSettings = createCSSSettings(endPtAONE, endPtATWO);
  console.log("Current varSettings to be played are:", newSettings);
  document
    .getElementById("bkgGlyph")
    .style.setProperty("font-variation-settings", newSettings);
}

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

  if (debugTrackingBoundaries) {
    // Draw debuggin lines for Head tracking
    stroke("#fff");
    strokeWeight(5);
    // Boundries for x-Tracking
    line(xMargin, 0, xMargin, height);
    line(width - xMargin, 0, width - xMargin, height);

    // Boundries for y-Tracking
    line(0, yMarginTop, width, yMarginTop);
    line(0, height - yMarginBottom, width, height - yMarginBottom);
  }

  if (pose) {
    // let distHands = distance(pose.leftWrist, pose.rightWrist);

    // Currently the tracking is not good enough, so a hand distance of 0 will not be possible
    // The maximum distance of hands needs to be calculate in a way based on the users arm length or so
    // for now it is just an arbitrary value that was working with our first prototype setup at HS Trier
    let minDistHands = 10;
    let maxDistHands = 220;
    let valueAONE = map(
      distance(pose.leftWrist, pose.rightWrist),
      minDistHands,
      maxDistHands,
      0,
      1000,
      true
    );

    let valueATWO = map(
      pose.nose.y,
      yMarginTop,
      height - yMarginBottom,
      0,
      1000,
      true
    );

    // Create usable CSSSettings from the calculate values
    varFontSettings = createCSSSettings(valueAONE, valueATWO);
    document
      .getElementById("activeGlyph")
      .style.setProperty("font-variation-settings", varFontSettings);

    // Draw Ellipse at nose and wrists positions
    // as they are our current inputs
    fill("#fff");
    ellipse(pose.nose.x, pose.nose.y, 15);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 15);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 15);

    if (checkValues(valueAONE, valueATWO)) {
      fadeOut = 255;
      console.log(reloadTimer);
      if (reloadTimer > 300) {
        window.location.reload();
      }
      reloadTimer += 20;
    }

    pop();
  }
}

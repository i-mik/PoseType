//var h1 = document.createElement("h1");
//h1.innerText= "Characters in Motion";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
//var img = new Image();
//img.setAttribute("src","Mama.jpeg");
//context.beginPath();
//context.arc(100,75,50,0,2*Math.PI);
//context.stroke();

let timerStarted = false;
function Countdown(time){
    if(timerStarted){
        return;
    }
    timerStarted = true;
    let currenttime=time
    
    let timerText = document.getElementById("Timer");
    timerText.innerText = currenttime;
    var interval =setInterval(function(){
        currenttime--;
        timerText.innerText = currenttime;
        if(currenttime > 0){

            

        }else{
            timerStarted= false;
            Setscore(1000);
            DrawGlyphscore(67,25,20);
            clearInterval(interval);
        }
    },1000);
}
Countdown(1);

function Setscore(value){
    document.getElementById("Score").innerText = value;
}
Setscore(0);

function DrawGlyphscore(BaseScore,Completion,TimeBonus){
    let canvasWidht = canvas.width/2;
    let height = 50;
    context.textAlign = "center"
    context.lineWidth = 5;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(canvasWidht-200,height-45);
    context.lineTo(canvasWidht-200,height+350);
    context.lineTo(canvasWidht-160,height+320); 
    context.lineTo(canvasWidht-140,height+350);  
    context.lineTo(canvasWidht-120,height+310); 
    context.lineTo(canvasWidht-100,height+350); 
    context.lineTo(canvasWidht-80,height+330); 
    context.lineTo(canvasWidht-60,height+350); 
    context.lineTo(canvasWidht-40,height+310); 
    context.lineTo(canvasWidht-20,height+350); 
    context.lineTo(canvasWidht,height+320); 
    context.lineTo(canvasWidht+20,height+350); 
    context.lineTo(canvasWidht+40,height+340); 
    context.lineTo(canvasWidht+60,height+350); 
    context.lineTo(canvasWidht+80,height+320); 
    context.lineTo(canvasWidht+100,height+350); 
    context.lineTo(canvasWidht+120,height+310); 
    context.lineTo(canvasWidht+140,height+340); 
    context.lineTo(canvasWidht+160,height+330); 
    context.lineTo(canvasWidht+180,height+320);  
    context.lineTo(canvasWidht+200,height+350); 
    context.lineTo(canvasWidht+200,height-45);  
    context.lineTo(canvasWidht-200,height-45); 
    context.stroke();

    context.font = "bold 40px Typofont"; 
    context.fillText("Glyphscore",canvasWidht, height);
    context.font = "20px Courier New";
    context.fillText("Round 1/2",canvasWidht, height+40);
    context.font = " normal 20px Courier New";
    context.textAlign = "left"
    context.fillText("Basescore:",canvasWidht -180,140);
    context.fillText("Completion:",canvasWidht -180,180);
    context.fillText("Time Bonus:",canvasWidht -180,220);
    context.textAlign = "right";
    context.fillText("U+"+BaseScore,canvasWidht +180,140);
    context.fillText("x"+Completion,canvasWidht +180,180);
    context.fillText("x"+TimeBonus,canvasWidht +180,220);
    context.font = "bold 20px Courier New"
    context.fillText("Total:",canvasWidht -105,310);
    

    
    context.setLineDash ([5]);
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(canvasWidht -185,260);
    context.lineTo(canvasWidht +185,260);
    context.stroke()
    context.fillText(BaseScore * Completion *TimeBonus,canvasWidht +180,310);
    

}

function imageTransform(x, y) {
    document.getElementById("myDIV").style.transform = "scale(${x}, ${y})";
  }
  // Create WebSocket connection.
  const socket = new WebSocket('ws://localhost:4000');
  socket.onmessage = function(e) {
    const object = JSON.parse(e.data);
    // hier kannst du die daten benutzen
    console.log(object.axes[0]);
};
  
  // Listen for messages (Welche Message muss da rein?)
  //socket.addEventListener('message', function (event) {
  //    document.getElementById("myDIV").style.transform = "scale(${x}, ${y})";
  //});

//Beginn sketch.js
let video;
let poseNet;
let pose;
let fadeOut;
let valueOne;
let valueTwo;
let fontDegular;

const xMargin = 150;
const yMargin = 75;
const treshHold = 100;
const offSet = 35;



function preload() {
  fontDegular = loadFont("assets/DegularTextDemo-Black.otf")
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  
  poseNet = ml5.poseNet(video, 'single', modelLoaded);
  poseNet.on('pose', gotPose);

  // Set up the axes Settings from Bkg-Glyph to be put in the CSS-Property
  valueOne = random(0, 1000);
  valueTwo = random(0, 1000);
  let newSettings = createCSSSettings(valueOne, valueTwo);
  console.log("Current varSettings to be played are:", newSettings)
  document.getElementById("bkgGlyph").style.setProperty("font-variation-settings", newSettings);

  textSize(60);
  textAlign(CENTER, CENTER);
  // textFont(fontDegular);
}


function modelLoaded() {
  console.log('poseNet ready!');
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

  if (axisOne >= (valueOne - offSet) && axisOne <= (valueOne + offSet)) {
    statment1 = true;
  }
  if (axisTwo >= (valueTwo - offSet) && axisTwo <= (valueTwo + offSet)) {
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
  }
  else {
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
  stroke('#fff')
  strokeWeight(5);
  // Boundries for x-Tracking
  //line(xMargin, 0, xMargin, height);
  //line(width - xMargin, 0, width - xMargin, height);

  // Boundries for y-Tracking
  //line(0, yMargin, width, yMargin);
  //line(0, height - yMargin*2, width, height - yMargin*2);

  if (pose) {

    // let distHands = distKeyPtsX(pose.leftWrist, pose.rightWrist);
    // let axisTwo = map(distHands, xMargin, width - xMargin, 0, 1000, true)
    
     let axisTwo = map(pose.nose.y, yMargin, height - yMargin*2, 0, 1000, true);  
    // console.log(distHands, axisOne);

    // Map the second Axes value to Nose-x position
    let axisOne = map(pose.nose.x, xMargin, width - xMargin, 0, 1000, true);

    newSettings = createCSSSettings(axisOne, axisTwo);
    document.getElementById("sampleGlyph").style.setProperty("font-variation-settings", newSettings);

    // Draw Ellipse at Nose and Wrist Positions
    strokeWeight(0);
    // fill('#F55428');
     
     fill('#fff')
     ellipse(pose.nose.x, pose.nose.y, 15)
     
    fill('#fff')
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
    

    if (checkValues(axisOne, axisTwo)) {
      fadeOut = 255;
    }

    
    if (fadeOut > 0) {
      text('🤨', pose.nose.x, pose.nose.y);
      fill(0, 0, 0, fadeOut);
      noStroke();
      text('😎', pose.nose.x, pose.nose.y);
      fadeOut -= 45;
    }
    else {
      text('🤨', pose.nose.x, pose.nose.y);
    }
    */
    pop();
  }
}

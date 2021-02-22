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
  socket.addEventListener('message', function (event) {
      document.getElementById("myDIV").style.transform = "scale(${x}, ${y})";
  });
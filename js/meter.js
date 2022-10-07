
var slider1 = document.getElementById("video-audio-length");
function updateGradient1(rangeValue) {
  const percentage = (rangeValue - slider1.min) / (slider1.max - slider1.min) * 100;
  slider1.style.backgroundImage = `linear-gradient(90deg, #DF3840 ${percentage}%, transparent ${percentage}%)`;
}
updateGradient1(slider1.value);// Update gradient onload
slider1.addEventListener('input', (e) => {updateGradient1(e.target.value);});// Update gradient oninput

var slider2 = document.getElementById("video-number-length");
function updateGradient2(rangeValue) {
  const percentage = (rangeValue - slider2.min) / (slider2.max - slider2.min) * 100;
  slider2.style.backgroundImage = `linear-gradient(90deg, #DF3840 ${percentage}%, transparent ${percentage}%)`;
}
updateGradient2(slider2.value);// Update gradient onload
slider2.addEventListener('input', (e) => {updateGradient2(e.target.value);});// Update gradient oninput

var slider3 = document.getElementById("trans-audio-length");
function updateGradient3(rangeValue) {
  const percentage = (rangeValue - slider3.min) / (slider3.max - slider3.min) * 100;
  slider3.style.backgroundImage = `linear-gradient(90deg, #DF3840 ${percentage}%, transparent ${percentage}%)`;
}
updateGradient3(slider3.value);// Update gradient onload
slider3.addEventListener('input', (e) => {updateGradient3(e.target.value);});// Update gradient oninput

var slider4 = document.getElementById("trans-number-length");
function updateGradient4(rangeValue) {
  const percentage = (rangeValue - slider4.min) / (slider4.max - slider4.min) * 100;
  slider4.style.backgroundImage = `linear-gradient(90deg, #DF3840 ${percentage}%, transparent ${percentage}%)`;
}
updateGradient4(slider4.value);// Update gradient onload
slider4.addEventListener('input', (e) => {updateGradient4(e.target.value);});// Update gradient oninput


let total = 0;
document.getElementById("show-mins-video").innerHTML = "1 mins";
document.getElementById("show-mins-trans").innerHTML = "1 mins";

document.getElementById("total-cost-video").innerHTML = "$ 0.01";
document.getElementById("total-cost-trans").innerHTML = "$ 0.05";

document.getElementById("video-audio-length").defaultValue = 1;
document.getElementById("trans-audio-length").defaultValue = 1;
document.getElementById("video-number-length").defaultValue = 1;
document.getElementById("trans-number-length").defaultValue = 1;

let transcripton_permin = 0.00;
let video_permin = 0.08;

function load(){
  console.log("Load");
  level1_show();
  totalCostCalc();
  totalCostCalcTrans();

}

function sliderChange() {
  var val = document.getElementById("video-audio-length").value;
  document.getElementById("show-mins-video").innerHTML = val + " mins";
  totalCostCalc();
  finalCost();
}

function sliderChangeNumberVideos() {
  var val = document.getElementById("video-number-length").value;
  document.getElementById("videos").innerHTML = val + " video(s)";
  totalCostCalc();
  finalCost();
}

function totalCostCalc() {
  let cost1 = parseFloat(document.getElementById("video-audio-length").value);
  let cost2 = parseFloat(document.getElementById("video-number-length").value);

  let totalCost = (cost1 * cost2 * video_permin).toFixed(2);
  document.getElementById("total-costhdn").innerHTML = totalCost;
  document.getElementById("total-cost-video").innerHTML = "$" + totalCost;
  finalCost();
}

function sliderChangeTrans() {
  var val = document.getElementById("trans-audio-length").value;
  document.getElementById("show-mins-trans").innerHTML = val + " mins";
  totalCostCalcTrans();
  finalCost();
}

function sliderChangeNumberVideosTrans() {
  var val = document.getElementById("trans-number-length").value;
  document.getElementById("videos-trans").innerHTML = val + " video(s)";
  totalCostCalcTrans();
  finalCost();
}

function totalCostCalcTrans() {
  let cost1 = parseFloat(document.getElementById("trans-audio-length").value);
  let cost2 = parseFloat(document.getElementById("trans-number-length").value);

  let totalCost = (cost1 * cost2 * transcripton_permin).toFixed(2);
  document.getElementById("total-cost-transhdn").innerHTML = totalCost;
  document.getElementById("total-cost-trans").innerHTML = "$" + totalCost;

 finalCost();
}


function level1_show() {
  var l1 = document.getElementById("level1");
  var l2 = document.getElementById("level2");
  var l3 = document.getElementById("level3");
    l1.style.display = "block";
    l2.style.display = "none";
    l3.style.display = "none";

}

function level2_show() {
  var l1 = document.getElementById("level1");
  var l2 = document.getElementById("level2");
  var l3 = document.getElementById("level3");
    l1.style.display = "none";
    l2.style.display = "block";
    l3.style.display = "none";

}

function level3_show() {
  var l1 = document.getElementById("level1");
  var l2 = document.getElementById("level2");
  var l3 = document.getElementById("level3");
    l1.style.display = "none";
    l2.style.display = "none";
    l3.style.display = "block";
}


function finalCost() {

  total =
    parseFloat(document.getElementById("total-cost-transhdn").innerHTML) +
    parseFloat(document.getElementById("total-costhdn").innerHTML);
  if (isNaN(total)) {
    total = 0;
  }
  total = total.toFixed(2);
  if( total <=200 ) { 
    level1_show(); 
    document.getElementById("final-cost").innerHTML = "$" + total;
  }
  else if
    (total <= 1000) { level2_show();  
    document.getElementById("final-cost").innerHTML = "$" + total;
  }
  else { 
    level3_show();
    document.getElementById("final-cost").innerHTML = "$";
  }
 
  
}

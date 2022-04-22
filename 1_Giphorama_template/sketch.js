//*******************************************
// GIPHORAMA
//Use the Giphy API to extract multiple gifs
//More info here: https://developers.giphy.com/branch/master/docs/api/
//*******************************************

//Giphy API URL & Key
let apiUrl = "https://api.giphy.com/v1/gifs/search?q="
let apiKey = "&api_key=XXXXX"; //REPLACE XXXXX with your API key (from Giphy)

function setup() {
  let canvasDiv = document.getElementById('sketchID');
  let width = canvasDiv.offsetWidth;
  let height = canvasDiv.offsetHeight;
  let sketchCanvas = createCanvas(width, height);

  background(255);
}

function draw() {
  background(80);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

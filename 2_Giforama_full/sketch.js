//*******************************************
// GIFORAMA
//Use the Giphy API to extract multiple gifs
//More info here: https://developers.giphy.com/branch/master/docs/api/
//*******************************************

//Inteface variables
let p, notifications, input, button, saveButton;

//Giphy API URL & Key
let apiUrl = "https://api.giphy.com/v1/gifs/search?q="
let apiKey = "&api_key=XXXXX"; //REPLACE XXXXX with your API key (from Giphy)

let giphyData; //Store the Giphy callback
let giphyLength = 20; //How many GIFs to load

let gifs = []; //Class instances
let getGifs = []; //Get the GIFs from the API

let gifImg;

function setup() {
  let canvasDiv = document.getElementById('sketchID');
  let width = canvasDiv.offsetWidth;
  let height = canvasDiv.offsetHeight;
  let sketchCanvas = createCanvas(width, height);
  sketchCanvas.parent("sketchID");

  background(255);

  //////////////////////////////////////////////Interface Setup
  p = createP('Enter a keyword:');
  p.style('font-size', '24px');
  p.position(80, 220);

  notifications = createP('');
  notifications.style('font-size', '14px');
  notifications.position(80, 350);

  //Text input
  input = createInput();
  input.position(80, 280);
  input.style('font-size', '18px');

  //Submit button
  button = createButton('submit');
  button.position(285, 280);
  button.style('font-size', '18px');
  button.mousePressed(sendMessage); //When this is pressed, run function sendMessage

  //Save button (for screenshots)
  saveButton = createButton('Save a Screenshot');
  saveButton.position(80, 317);
  saveButton.style('font-size', '18');
  saveButton.size(275,35);
  saveButton.mousePressed(saveScreen);
  //////////////////////////////////////////////
}

//This function executes when the Submit button of the interface has been pressed
//It will form a message to send to the Giphy API, and return the results
function sendMessage() {
  let searchWord = input.value();
  //Create an HTTP call to the Giphy API, using the API URL,
  //the search term set by the user, and the API key
  let fullURL = apiUrl +searchWord+ apiKey;
  //Load the JSON response from the Giphy API and pass it on the giphyLoaded function
  loadJSON(fullURL, giphyLoaded);
}

function giphyLoaded(respObj) {
  //Add a notification on the sideBar that the call is successful
  notifications = createP('Call successful!\nClick on the canvas for GIFs!');
  notifications.style('font-size', '14px');
  notifications.position(80, 350);
  //The respoObje contains the result from the API call
  //Here, we need to extract the content and convert it to images in P5
  giphyData = respObj;
  giphyLength = 20;
  //Or use the full return value: giphyData.data.length

  //On every new keyword selection, reset the array
  getGifs = [];

  //Run a for loop (based on the number of the image links received)
  for (let i=0; i<giphyLength; i++){
    //Load the GIFs on the array
    getGifs[i] = loadImage(giphyData.data[i].images.original.url);
    //The .data[i].images.original.url locates the image URLs that are contained within
    //the JSON object received from the API. Following that, we use the loadImage and save
    //each image to our getGifs array
  }
}

function mouseReleased(){
  //For every mouse event (released), a new instance will be created that
  //contains a GIF from the downloaded content
  let giphySelected = parseInt(random(giphyLength));
  //console.log("Sel: " + giphySelected);
  let startFrame = gifs.length % getGifs[giphySelected].numFrames();
  //Push a new instance
  gifImg = cloneGif(getGifs[giphySelected], startFrame);
  gifs.push(new Gif( gifImg, mouseX, mouseY ));

  //Remove the sideBar notification when the user clicks on the canvas
  notifications.remove();
}

function draw() {
  //background(80);
  if (gifs!=null){
    //Visualize the GIFs
    for (let i = 0; i < gifs.length; i++){
      gifs[i].update();
    }
  }
}

//The class allows us to use multiple image instances of the GIFs
class Gif {
  constructor(img, x, y) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.counterX = 0;
  }
  update(){
    this.counterX++;
    image(this.img, this.x+this.counterX, this.y);
  }
}

//The function serves in passing a GIF manually to our image class
//A solution found here:
//https://stackoverflow.com/questions/66549075/in-p5-js-is-it-possible-to-load-a-gif-in-the-setup-or-preload-function-and-the
function cloneGif(gif, startFrame){
  let gifClone = gif.get();
  //console.log(gifClone);
  //Access original gif properties
  gp = gif.gifProperties;
  //Make a new object for the clone
  gifClone.gifProperties = {
    //displayIndex: gp.displayIndex,
    //We still point to the original array of frames
    frames: gp.frames,
    lastChangeTime: gp.lastChangeTime,
    loopCount: gp.loopCount,
    loopLimit: gp.loopLimit,
    numFrames: gp.numFrames,
    playing: gp.playing,
    timeDisplayed: gp.timeDisplayed
  };
  //Optional tweak the start frame
  gifClone.setFrame(startFrame);
  return gifClone;
}

//Function to save the canvas in an image file
function saveScreen() {
  saveCanvas(canvas, 'myCanvas', 'jpg');
}

//The canvas window can be resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

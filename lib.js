var TourGuide = TourGuide || {};
TourGuide.__helpers = TourGuide.__helpers || {};

TourGuide.getElementsInFrame = function(num){
  // Add code for caching and checking if in dom
  return document.getElementById("tour-guide-" + num);
};

TourGuide.__helpers.setOptions = function(options){
  options = options || {};
  options.backgroundColor = options.backgroundColor || "#000000";
  options.padding = options.padding || 0;
  options.opacity = options.opacity || 0.5;
  TourGuide.__helpers.options = options;
};

TourGuide.startTour = function(options){
  TourGuide.__helpers.setOptions(options);
  TourGuide.currentFrameNum = 1; // Reset tour
  TourGuide.frames = TourGuide.frames || [];

  if(TourGuide.frames.length == 0){
    var i = 1;
    var ele = TourGuide.getElementsInFrame(i);
    while(ele){
      TourGuide.frames.push(ele);
      ele = TourGuide.getElementsInFrame(++i);
    }
  }
  TourGuide.showFrame(TourGuide.currentFrameNum);
};

TourGuide.stopTour = function(){
  if(TourGuide.currentFrame.showing)
    TourGuide.removeCurrentFrame();
};

TourGuide.isTourGoing = function(){
  return TourGuide.currentFrame && TourGuide.currentFrame.showing;
};

TourGuide.showFrame = function(frameNum){
  if(frameNum < 1){
    console.error("You're frame number is less than one.");
    return;
  }
  if(frameNum > TourGuide.frames.length){
    console.error("You're frame number is higher than the number of frames.");
    return;
  }
  console.log("Showing frame " + frameNum);
  TourGuide.currentFrame = TourGuide.currentFrame || {};
  TourGuide.currentFrame.num = frameNum;
  TourGuide.currentFrame.element = TourGuide.frames[frameNum - 1];
  TourGuide.currentFrame.popover = {};
  TourGuide.currentFrame.shaders = TourGuide.currentFrame.shaders || TourGuide.createShaders();
  TourGuide.positionShaders(TourGuide.currentFrame.element, TourGuide.currentFrame.shaders);
  TourGuide.showShaders(TourGuide.currentFrame.shaders);
  TourGuide.currentFrame.showing = true;
};

TourGuide.showNextFrame = function(){
  TourGuide.currentFrameNum = TourGuide.currentFrame.num + 1;
  if(TourGuide.currentFrame.showing)
    TourGuide.removeCurrentFrame();
  if(TourGuide.currentFrameNum <= TourGuide.frames.length)
    TourGuide.showFrame(TourGuide.currentFrameNum);
  else
    TourGuide.stopTour();
};

TourGuide.removeCurrentFrame = function(){
  console.log("Removing frame " + TourGuide.currentFrame.num);
  TourGuide.hideShaders(TourGuide.currentFrame.shaders);
  //TourGuide.currentFrame.popover.remove();
  TourGuide.currentFrame.showing = false;

};

TourGuide.createShaders = function(){
  var shaders = [];
  for(var i = 0 ; i < 4 ; i ++){
    var e = document.createElement("DIV");
    e.style.position  = "absolute";
    e.style.backgroundColor = TourGuide.__helpers.options.backgroundColor;
    e.style.display = "none";
    e.style.opacity = TourGuide.__helpers.options.opacity;
    document.body.appendChild(e);
    shaders.push(e);
  }
  return shaders;
};

TourGuide.showShaders = function(shaders){
  shaders.forEach(function(s){
    s.style.display = "block";
  });
};

TourGuide.hideShaders = function(shaders){
  shaders.forEach(function(s){
    s.style.display = "none";
  });
};

TourGuide.__helpers.positionOfElement = function(ele){
  var topPos = leftPos = 0;
  if(ele.offsetParent){
    do{
      topPos += ele.offsetTop;
      leftPos += ele.offsetLeft;
    }while(ele = ele.offsetParent);
  }
  return {"top" : topPos, "left" : leftPos};
};

TourGuide.positionShaders = function(ele, shaders){
  if(shaders.length != 4)
    console.error("Internal error: You don't have enough shaders.");
  console.log("Positioning shaders");

  var position = TourGuide.__helpers.positionOfElement(ele);
  var screenWidth = document.body.offsetWidth;
  var screenHeight = window.innerHeight;

  // Left
  shaders[0].style.left = 0;
  shaders[0].style.top = 0;
  shaders[0].style.right = screenWidth - position.left + TourGuide.__helpers.options.padding;
  shaders[0].style.bottom = 0;

  // Top
  shaders[1].style.left = position.left - TourGuide.__helpers.options.padding;
  shaders[1].style.top = 0;
  shaders[1].style.right = screenWidth - ele.offsetWidth - position.left - TourGuide.__helpers.options.padding;
  shaders[1].style.bottom = screenHeight - position.top + TourGuide.__helpers.options.padding;

  // Right
  shaders[2].style.left = position.left + ele.offsetWidth + TourGuide.__helpers.options.padding;
  shaders[2].style.top = 0;
  shaders[2].style.right = 0;
  shaders[2].style.bottom = 0;

  // Bottom
  shaders[3].style.left = position.left - TourGuide.__helpers.options.padding;
  shaders[3].style.top = position.top + ele.offsetHeight + TourGuide.__helpers.options.padding;
  shaders[3].style.right = screenWidth - ele.offsetWidth - position.left - TourGuide.__helpers.options.padding;
  shaders[3].style.bottom = 0;
}


window.onscroll = function(){
  TourGuide.positionShaders(TourGuide.currentFrame.element, TourGuide.currentFrame.shaders);
};

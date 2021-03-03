var PLAY = 1;
var END = 0;

var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var Game_Over,gameOver;
var reset, resetButton;
var jump;
var check;
var die;
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameOver = loadImage("gameOver.png");
  groundImage = loadImage("ground2.png");
  resetButton  = loadImage("restart.png");
  cloudImage = loadImage("cloud.png");
  check = loadSound("checkPoint.mp3");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-30,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.debug = true;
  trex.setCollider("circle",0,0,40);
  
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  
   reset = createSprite(width/2,height/2,20,20);
  reset.addAnimation("reset",resetButton);
  reset.scale = 0.39;
  reset.visible = false;
  
  
  Game_Over = createSprite(width/2,height/2 - 90,30,30);
  Game_Over.addImage("GameOver",gameOver);
  Game_Over.scale = 0.101;
  Game_Over.visible = false;

  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  
  score = 0;
}

function draw() {
  background(180);
  
 ground.velocityX = -4 -score/50;
      
  
  text("Score: "+ Math.round(score), 500,50);
  
  if (score>300){
      background(50);
     
  text("Score: "+ Math.round(score), 500,50);
      }
   if (score>800){
      background(180);
  
  text("Score: "+ Math.round(score), 500,50);
      }
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -4;
    
    
    
    if (ground.x < 0){
    ground.x = ground.width/2;
    }
    // score = Math.floor(frameRate/5) ;//
    score = score+(getFrameRate()/6)
    
    
      if(keyDown("space")&& trex.y >= height-50 || touches.length>0 ) {
    trex.velocityY = -17;
        touches = [];
        }
    if (keyWentDown("space") || touches.length>0){
      jump.play();
       touches = [];
    }
    
     trex.velocityY = trex.velocityY + 0.8
  //spawn the clouds
  spawnClouds();
  
  //spawn obstacles on the ground
  spawnObstacles();
  
    
    if (score%100===0 && score>0){
        check.play();
    
        }
    
    if (obstaclesGroup.isTouching(trex)){
        gameState=END;
      die.play();
        }
    
  }
  else if(gameState === END){
    //stop the ground
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided",trex_collided);
    trex.velocityY = 0;
    reset.visible = true;
    Game_Over.visible = true;
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-2);
    
    if (mousePressedOver(reset)){
        gameState=PLAY;
      cloudsGroup.destroyEach();
      obstaclesGroup.destroyEach();
      score=0;
      trex.changeAnimation("running",trex_running);
      reset.visible = false;
    Game_Over.visible = false;
        }
       
  }
  
  
  
  
  trex.collide(invisibleGround);
 
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-40,10,40);
   obstacle.velocityX = ground.velocityX;

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = width/3;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(width,100,40,10);
    cloud.y = Math.round(random(height-150,height/2));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = width/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
}

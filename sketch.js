const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

var background_img;
var player;
var playerImg, playerMovingImg,playerLeft;
var edges;
var obstacle,obstacleImg;
var coin, coinImg, coinBag, coinBagImg;
var positions = [],positions2 = [];
var fuel = 200,fuelBar,fuelImage,fuelGroup,fuelcollect;
var obstacleGroup;
var coinGroup;
var gameState;
var score = 0;
var trophy;

function preload(){
  background_img = loadImage('background.jpg');
  playerImg = loadImage('player.png');
  playerMovingImg = loadImage('player_flying.png');
  playerLeft = loadImage('player_flying_left.png');
  coinImg = loadImage('coin.png');
  coinBagImg = loadImage('coin_bag.png');
  obstacleImg = loadImage('obstacle.png');
  trophy = loadImage('trophy.png');
  fuelImage = loadImage('fuel.png');
}

function setup() {
  gameState = 'play';
  createCanvas(windowWidth,windowHeight);

  player = createSprite(100,height-100,50,50);
  player.addImage('standing',playerImg);
  player.addImage('moving',playerMovingImg);
  player.addImage('left',playerLeft);
  
  player.scale = 0.3;

  edges = createEdgeSprites();

  coinBag = createSprite(50,50,50,50);
  coinBag.addImage(coinBagImg);
  coinBag.scale = 0.2;

  for(var i = 0; i < 10;i++){
    var x = Math.round(random(200,width));
    var y = Math.round(random(0,height));
    var pos = [x,y];
    positions.push(pos);
  }

  for(var i = 0; i < 6;i++){
    var x = Math.round(random(200,width));
    var y = Math.round(random(0,height));
    var pos = [x,y];
    positions2.push(pos);
  }

  obstacleGroup = new Group();
  coinGroup = new Group();
  fuelGroup = new Group();

  spawnCoins();
  spawnFuel();
  
}

function draw() {
  
  if(gameState === 'play'){
    background(background_img);
    
    player.changeImage('standing');

    player.velocityY += 3;

    playerControls();

    if(fuel <= 0 || score < 0){
         gameState = 'end';
    }

    player.collide(edges);

    if(!coinGroup[0]){
      gameState = 'win';
    }

    if(fuel > 200){
      fuel = 200;
    }

    obstacleSpawn();
    handleObstacles();
    showFuelBar();
    handleCoins();
    handleFuel();
    drawSprites();
  }else if(gameState === 'end'){
    clear();
    obstacleGroup.destroyEach();
    coinGroup.destroyEach();
    background('grey');
    fill("black");
    textSize(30);
    text("Game Over",width/2,height/2);
  }else if(gameState === 'win'){
    clear();
    obstacleGroup.destroyEach();
    coinGroup.destroyEach();
    background('green');
    fill("blue");
    textSize(35);
    text("You won!",width/2,height/2);
    image(trophy,width/2,height/2+100,100,100);

  }
  
  textSize(20);
  text("Score: "+score,100,50);

}

function obstacleSpawn(){
  var ob1;

  if(frameCount%60 === 0){
    obstacleGroup.destroyEach();
 

    for(var i = 0;i<5;i++){
      ob1 = createSprite(random(200,width),random(0,height));
      ob1.addImage(obstacleImg);
      ob1.scale = 0.3;
      obstacleGroup.add(ob1);
    }

  }


}

function spawnCoins(){
 
  for(var i = 0;i < positions.length;i++){
    coin = createSprite(positions[i][0],positions[i][1]);
    coin.addImage(coinImg);
    coin.scale = 0.1;
    coinGroup.add(coin);
  }

}

function showFuelBar(){
  fill('white');
  rect(width-250,50,200,12);
  fill('red');
  rect(width-250,50,fuel,12);
}

function playerControls(){
  if(keyIsDown(LEFT_ARROW)){
    player.x -= 8;
    player.changeImage('left');
    fuel -= 0.25;
  }

  if(keyIsDown(RIGHT_ARROW)){
    player.x += 8;
    player.changeImage('moving');
    fuel -= 0.25;
  }

  if(keyIsDown(UP_ARROW)){
    player.velocityY = -8;
    fuel -= 0.75;
  }
}

function handleCoins(){
  player.overlap(coinGroup,function(collector, collected){
    score += 3;
    collected.remove();
  })
}

function handleObstacles(){
  player.overlap(obstacleGroup,function(collector,collected){
    score -= 1;
    collected.remove();
  })
}

function spawnFuel(){
  for(var i = 0;i < positions2.length;i++){
    fuelcollect = createSprite(positions2[i][0],positions2[i][1]);
    fuelcollect.addImage(fuelImage);
    fuelcollect.scale = 0.1;
    fuelGroup.add(fuelcollect);
  }
}

function handleFuel(){
  player.overlap(fuelGroup,function(collector,collected){
    fuel += 50;
    collected.remove();
  })
}


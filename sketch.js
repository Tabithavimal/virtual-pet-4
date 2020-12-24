//Create variables here
var dog,happyDog
var database
var foodS,foodStock;
var dogImg,dogImg1;
var fedTime,lastFed;
var foodObj;
var feedDog;
var addFoodS;
var milkImg,bedroomImg,gardenImg,washroomImg;
var changingGameState;
var readingGameState;
var readState;
var bedroom,garden,washroom;
var currentTime,Playing,Sleeping;
var Bathing,Hungry;

function preload()
{
dogImg=loadImage("images/dogImg.png")
milkImg=loadImage("images/Milk.png")
dogImg1=loadImage("images/dogImg1.png")
bedroomImg=loadImage("images/Bed Room.png")
gardenImg=loadImage("images/Garden.png")
washroomImg=loadImage("images/Wash Room.png")


}

function setup() {
	createCanvas(500, 500);
  foodObj=new Food();

  database=firebase.database();
dog=createSprite(400,300,20,40)
dog.addImage(dogImg)
dog.scale=0.2

fedTime=database.ref('feedTime')
fedTime.on("value",function(data){
lastFed=data.val();

})
foodStock=database.ref('Food')
foodStock.on("value",readStock)

feed=createButton("Feed the Dog")
feed.position(700,95)
feed.mousePressed(feedDog)

addFood=createButton("Add Food")
addFood.position(800,95)
addFood.mousePressed(addFoodS)

readState=database.ref('gameState')
readState.on("value",function(data){
gameState=data.val();

})


}

function draw() {  
background("green")

currentTime=hour();
if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
}
else if(currentTime==(lastFed+2)){
update("Sleeping")
foodObj.bedroom();
}

else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
update("Bathing")
foodObj.washroom();
}

else {
    update("Hungry")
foodObj.display();
}





if(gameState!="Hungry"){
feed.hide();
addFood.hide();
dog.remove();

}
else{
feed.show();
addFood.show();
dog.addImage(dogImg1)

}


  drawSprites();
 

}

function readStock(data)
{
foodS=data.val();
foodObj.updateFoodStock(foodS)
}

function feedDog(){

dog.addImage(dogImg1)
foodObj.updateFoodStock(foodObj.getFoodStock()-1)
database.ref('/').update({
Food:foodObj.getFoodStock(),
feedTime:hour(),
gameState:"Hungry"

})

}

function addFoodS(){

foodS=foodS+1
database.ref('/').update({

Food:foodS

})

}

function update(state){
database.ref('/').update({

  gameState:state
})



}
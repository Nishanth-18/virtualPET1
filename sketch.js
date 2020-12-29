//Create variables here

var dog,dogImage,happyDog,database,foodS,foodStock
var database
var fedTime, lastFed, feed, addFood, foodObj

var gameState
var readState
var sadDog,garden,washroom,bedroom

function preload()
{
  //load images here
  dogImage = loadImage("images/dogImg.png")
  happyDog = loadImage("images/dogImg1.png")
  sadDog = loadImage("images/Lazy.png")
  garden = loadImage("images/Garden.png")
  washroom = loadImage("images/Wash Room.png")
  bedroom = loadImage("images/Bed Room.png")



}

function setup() {
  createCanvas(1000, 1000);
  database = firebase.database()
  dog = createSprite (250,250,50,50)
  dog.addImage(dogImage)
  dog.scale = 0.25

  foodStock=database.ref('Food');
   foodStock.on("value",readStock);

  foodObj = new Food ()

  feed = createButton ("feed the dog")   
  feed.position(700,100)
  feed.mousePressed(feedDog)

  addFood = createButton ("add food")   
  addFood.position(800,100)
  addFood.mousePressed(addFoods)

  readState=database.ref('gameState');
  readState.on("value",function(data){gameState=data.val();});
   
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){lastFed=data.val();});

  
}


function draw() 
{  
  
  
  currentTime=hour();
  if(currentTime==(lastFed+1))
  {
    update("Playing");
    foodObj.garden();
  }
  else if (currentTime==(lastFed+2))
  {
    update("Sleeping");
    foodObj.bedroom();
  }
  else if (currentTime>(lastFed+2)&& currentTime<=(lastFed+4))
  {
    update("Bathing");
    foodObj.washroom();
  }
  else
  {
   update("Hungry")
   foodObj.display();
  }
  
  foodObj.display();
  
  if(gameState!="Hungry")
  {
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else
  {
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  

 
  drawSprites();
  
  

}



function feedDog()
{
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update
  (
    {
      Food:foodObj.getFoodStock(),
      FeedTime:hour(),
      gameState:"hungry"
    }
  )
}

function addFoods()
{
  foodS++;
  database.ref('/').update
  (
    {
     Food:foodS
    }
  )
}

function readStock(data)
{
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

function update(state)
{
  database.ref("/").update({gameState:state})
}

/*function writeStock(x)
{
  if(x<=0)
  {
    x=0;
  }
  else{
    x=x-1
  }
  
  database.ref('/').update({Food:x})
}
*/



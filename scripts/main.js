const GAME_SIZE = {x: 800, y: 600};
const TILE_SIZE = {x: 40, y: 40};

AssetLoader.loadAllAssets(() => {
  startGame();
});

function startGame() {
  let gameBoard = new GameBoard();
  let app = new PIXI.Application(GAME_SIZE.x, GAME_SIZE.y, {backgroundColor : 0x1099bb});
  document.body.appendChild(app.view);
  
  let boardSprite = new PIXI.Container();
  for (var col = 0; col < GAME_SIZE.x / TILE_SIZE.x; col ++) {
    for (var row = 0; row < GAME_SIZE.y / TILE_SIZE.y; row ++) {
      let groundType = gameBoard.getGroundType(col, row);
      let sprite = new PIXI.Sprite(AssetLoader.getAssetTexture(groundType.asset));
      sprite.x = col * TILE_SIZE.x;
      sprite.y = row * TILE_SIZE.y;
      sprite.width = TILE_SIZE.x;
      sprite.height = TILE_SIZE.y;
      boardSprite.addChild(sprite);
    }
  }
  app.stage.addChild(boardSprite);
  console.log(boardSprite);
  
  // create a new Sprite from an image path
  var bunny = PIXI.Sprite.fromImage('assets/robot.png')

  // center the sprite's anchor point
  bunny.anchor.set(0.5);
  
  bunny.width = TILE_SIZE.x;
  bunny.height = TILE_SIZE.y;

  // move the sprite to the center of the screen
  bunny.x = app.renderer.width / 2;
  bunny.y = app.renderer.height / 2;

  app.stage.addChild(bunny);

  // Listen for animate update
  app.ticker.add(function(delta) {
      // just for fun, let's rotate mr rabbit a little
      // delta is 1 if running at 100% performance
      // creates frame-independent tranformation
      //bunny.rotation += 0.1 * delta;
  });
}
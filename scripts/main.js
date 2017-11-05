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
  for (var x = 0; x < GAME_SIZE.x / TILE_SIZE.x; x ++) {
    for (var y = 0; y < GAME_SIZE.y / TILE_SIZE.y; y ++) {
      let sprite = gameBoard.buildTileSprite(x, y);
      sprite.x = x * TILE_SIZE.x;
      sprite.y = y * TILE_SIZE.y;
      
      boardSprite.addChild(sprite);
    }
  }
  app.stage.addChild(boardSprite);
  
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

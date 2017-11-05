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


  const LEFT_ARROW = 37;
  const UP_ARROW = 38;
  const RIGHT_ARROW = 39;
  const DOWN_ARROW = 40;
  const KEY_W = 87;
  const KEY_A = 65;
  const KEY_S = 83;
  const KEY_D = 68;

  function moveFunc(x, y) {
    boardSprite.x -= x * TILE_SIZE.x;
    boardSprite.y -= y * TILE_SIZE.y;
  }
  keyboard(LEFT_ARROW).press = function() {
    moveFunc(-1, 0);
  };
  keyboard(KEY_A).press = function() {
    moveFunc(-1, 0);
  };
  keyboard(UP_ARROW).press = function() {
    moveFunc(0, -1);
  };
  keyboard(KEY_W).press = function() {
    moveFunc(0, -1);
  };
  keyboard(RIGHT_ARROW).press = function() {
    moveFunc(1, 0);
  };
  keyboard(KEY_D).press = function() {
    moveFunc(1, 0);
  };
  keyboard(DOWN_ARROW).press = function() {
    moveFunc(0, 1);
  };
  keyboard(KEY_S).press = function() {
    moveFunc(0, 1);
  };
}

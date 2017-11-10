const GAME_SIZE = {x: 800, y: 600};
const TILE_SIZE = {x: 32, y: 32, centerX: 16, centerY: 16};

AssetLoader.loadAllAssets(() => {
  startGame();
});

function startGame() {
  let gameContainer = new PIXI.Container();

  let gameObject = new GameObject();
  let gameBoard = new GameBoard(gameObject, gameContainer);
  gameObject.setGameBoard(gameBoard);
  
  let robot = gameBoard.createRobot(5 * TILE_SIZE.x, 5 * TILE_SIZE.y);
  let factory = gameBoard.createBuilding(14, 7);
  robot.dropoffItem(factory.getPixelX(), factory.getPixelY());
  
  let app = new PIXI.Application(GAME_SIZE.x, GAME_SIZE.y, {backgroundColor : 0x1099bb});
  document.getElementById('canvasContainer').appendChild(app.view);
  
  let boardSprite = gameBoard.getPixiContainer();
  app.stage.addChild(gameContainer);
  
  app.view.addEventListener('click', (event) => {
    let clickCoord = gameBoard.getCoordFromPosition(event.offsetX, event.offsetY);
    
    gameObject.setSelected(clickCoord);
  });
  
  document.getElementById('controlsContainer').addEventListener('click', (event) => {
    let command = event.target.getAttribute('data-command');
    if (!command || !gameObject.selectedCoord) {
      return;
    }
    let currBuilding = gameBoard.getBuilding(
      gameObject.selectedCoord.x, 
      gameObject.selectedCoord.y,
    );
    switch (command) {
      case 'build-robot':
        gameBoard.createRobot(
          (gameObject.selectedCoord.x + Math.random() * 3 - 1) * TILE_SIZE.x, 
          (gameObject.selectedCoord.y + Math.random() * 3 - 1) * TILE_SIZE.y,
        );
        break;
      case 'build-factory':
        if (currBuilding === null) {
          gameBoard.createBuilding(
            gameObject.selectedCoord.x, 
            gameObject.selectedCoord.y,
          );
        }
        break;
      case 'pick-recipe':
        const recipeDiv = gameObject.focusDiv('recipe');

        recipeDiv.innerHTML = "";

        let craftable = getCraftable();
        for (let c of craftable) {
          let recipeItem = document.createElement('div');
          recipeItem.textContent = "Craft: " + c.name;
          recipeItem.setAttribute('data-command', 'onclick');
          recipeItem.onclick = function() {
            currBuilding.setCraftTarget(c);    
            gameObject.focusDiv('factory');
          };
          recipeDiv.appendChild(recipeItem);
        }
            
        break;
    }
    
  });

  // Listen for animate update
  app.ticker.add(function(delta) {
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent tranformation
    //bunny.rotation += 0.1 * delta;
    for (r of gameBoard.getRobots()) {
      r.onTick(delta);
    }
    for (b of gameBoard.getBuildings()) {
      b.onTick(delta);
    }
    for (r of gameBoard.getRobots()) {
      r.onTick(delta);
    }
    gameBoard.updateIdleRobots();
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

function updateTextContent(element, toStringFunc) {
  let intId = setInterval(function() {
    if (document.body.contains(element)) {
      element.textContent = toStringFunc();
    } else {
      clearInterval(intId);
    }
  });
  element.textContent = toStringFunc();
}

function createElement(container, tagName, style) {
  let element = document.createElement(tagName);
  style = style || {};
  for (let s of Object.keys(style)) {
    element.style[s] = style[s];
  }
  container.appendChild(element);
  return element;
}

function createDynamicLabel(container, toStringFunc, options) {
  options = options || {};
  let textNode = createElement(container, options.newline ? 'div' : 'span');
  updateTextContent(textNode, toStringFunc);
  return textNode;
}

Array.prototype.remove = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === val) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
}

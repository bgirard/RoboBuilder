const GroundType = {
  SPACE: {
    id: 0,
    name: 'space',
    asset: 'terrain_grass',
  },
  DIRT: {
    id: 1,
    name: 'dirt',
    asset: 'terrain_dirt',
  },
};

class GameBoard {
  constructor(container) {
    this.buildings = [];
    this.robots = [];
    this.container = container;
    this.pixiObject = this.createPixiObject();
    this.pixiBuildingContainer = new PIXI.Container();
    this.pixiObject.addChild(this.pixiBuildingContainer);
    this.pixiRobotContainer = new PIXI.Container();
    this.pixiObject.addChild(this.pixiRobotContainer);
    
    this.selectionSprite = new PIXI.Graphics();
    this.selectionSprite.lineStyle(3, 0xFFFF00);
    this.selectionSprite.drawRect(0, 0, TILE_SIZE.x, TILE_SIZE.y);
    this.selectionSprite.visible = false;

    container.addChild(this.pixiObject);
    container.addChild(this.selectionSprite);
    
    this.updateIdleRobots();
  }
  
  updateIdleRobots() {
    let idleCount = document.getElementsByClassName("idleCount");
    idleCount[0].innerText = this.getIdleRobots().length;
  }

  createPixiObject() {
    let boardSprite = new PIXI.Container();
    for (var x = 0; x < GAME_SIZE.x / TILE_SIZE.x; x ++) {
      for (var y = 0; y < GAME_SIZE.y / TILE_SIZE.y; y ++) {
        let sprite = this.buildTileSprite(x, y);
        sprite.x = x * TILE_SIZE.x;
        sprite.y = y * TILE_SIZE.y;
        
        boardSprite.addChild(sprite);
      }
    }
    return boardSprite;
  }
  
  getCoordFromPosition(posX, posY) {
    return {x: Math.floor(posX / TILE_SIZE.x), y: Math.floor(posY / TILE_SIZE.y)};
  }

  getGroundType(x, y) {
    if (x * x + y * y < 100) {
      return GroundType.DIRT;
    }
    return GroundType.SPACE;
  }

  getOre(x, y) {
    if (2 <= x && x <= 5 && 3 <= y && y <= 6) {
      return Item.IRON_ORE; 
    }
    
    if (1 <= x && x <= 2 && 1 <= y && y <= 2) {
      return Item.COPPER_ORE; 
    }
    
    if (3 <= x && x <= 4 && 1 <= y && y <= 3) {
      return Item.GOLD_ORE;
    }
    return null;
  }

  getBuilding(x, y) {
    for (let b of this.buildings) {
      if (b.x === x && b.y === y) {
        return b;
      }
    }
    return null;
  }

  getRobots() {
    return this.robots;
  }

  getIdleRobots() {
    let array = [];
    for (let r of this.robots) {
      if (r.isIdle()) {
        array.push(r);
      }
    }
    return array;
  }
  
  getPixiContainer() {
    return this.pixiObject;
  }

  buildTileSprite(x, y) {
    let groundType = this.getGroundType(x, y);
    let sprite = new PIXI.Sprite(AssetLoader.getAssetTexture(groundType.asset));
    
    let ore = this.getOre(x, y);
    if (ore) {
      let oreSprite = new PIXI.Sprite(AssetLoader.getAssetTexture(ore.asset));
      sprite.addChild(oreSprite);
    }
    
    sprite.width = TILE_SIZE.x;
    sprite.height = TILE_SIZE.y;
    
    return sprite;
  }

  createBuilding(x, y) {
    let factory = new Building(this.pixiBuildingContainer, 'factory', x, y);
    this.buildings.push(factory);
    return factory;
  }

  createRobot(x, y) {
    let robot = new Robot(this.pixiRobotContainer, 'robot', x, y);
    this.robots.push(robot);
    this.updateIdleRobots();
    return robot;
  }
  
  setSelectedCoord(coord) {
    if (coord === null) {
      this.selectionSprite.visible = false;
      return;
    }
    this.selectionSprite.x = coord.x * TILE_SIZE.x;
    this.selectionSprite.y = coord.y * TILE_SIZE.y;
    this.selectionSprite.visible = true;
  }
}

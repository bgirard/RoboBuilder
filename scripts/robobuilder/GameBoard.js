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

const Item = {
  IRON_ORE: {
    asset: 'ore_iron',
  },
  COPPER_ORE: {
    asset: 'ore_copper',
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

    container.addChild(this.pixiObject);
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
    return robot;
  }
}

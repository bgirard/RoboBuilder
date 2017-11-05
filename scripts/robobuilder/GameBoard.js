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
  constructor() {
    this.buildings = [];
    this.robots = [];
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
    for (let b of buildings) {
      if (b.x === x || b.y === y) {
        return b;
      }
    }
    return null;
  }

  getRobots() {
    return [];
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
    this.buildings.push(new Building('factory', x, y)); 
  }

  createRobot(x, y) {
    this.robots.push(new Robot('robot', x, y));
  }
}

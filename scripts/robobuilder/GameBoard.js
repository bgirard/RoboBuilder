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
  },
  COPPER_ORE: {
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
    if (x == 0 && y == 0) {
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

  createBuilding(x, y) {
    this.buildings.push(new Building('factory', x, y)); 
  }

  createRobot(x, y) {
    this.robots.push(new Robot('robot', x, y));
  }
}

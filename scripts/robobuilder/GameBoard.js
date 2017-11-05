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
    return null;
  }

  getRobots() {
    return [];
  }
}

const OrderType = {
  PICKUP: {
  },
  DROPOFF: {
  },
};

class Robot {
  constructor(container, type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.cargo = Item.IRON_ORE;
    this.order = null;
    this.orderX = 0;
    this.orderY = 0;
    this.container = container;

    this.pixiObject = this.createPixiObject();
  }

  createPixiObject() {
    let robot = new PIXI.Sprite(AssetLoader.getAssetTexture('robot'));

    // center the sprite's anchor point
    robot.anchor.set(0.5);

    robot.width = TILE_SIZE.x;
    robot.height = TILE_SIZE.y;

    // move the sprite to the center of the screen
    robot.x = this.x;
    robot.y = this.y;

    this.container.addChild(robot);

    return robot;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getSpeed() {
    return 120;
  }

  getCargo() {
    return this.cargo;
  }

  getType() {
    return this.type;
  }

  onTick() {
    let pos = this.getCurrentPos();
    this.pixiObject.x = pos[0];
    this.pixiObject.y = pos[1];
  }

  getCurrentPos() {
    if (this.order === null) {
      return [this.x, this.y];
    }
    let dx = this.orderX - this.x;
    let dy = this.orderY - this.y;
    let dt = performance.now() - this.orderStart;
    let totalDist = Math.sqrt(dx * dx + dy * dy);
    let speed = this.getSpeed();
    let travelDist = dt / 1000.0 * speed;
    let progress = travelDist / totalDist;
    if (progress > 1 ) {
      progress = 1;
    }
    
    return [this.x + progress * dx, this.y + progress * dy];
  }

  pickupItem(x, y) {
    this.order = OrderType.PICKUP;
    this.orderX = x;
    this.orderY = y;
    this.orderStart = performance.now();
  }

  dropoffItem(x, y) {
    this.order = OrderType.DROPOFF;
    this.orderX = x; 
    this.orderY = y;
    this.orderStart = performance.now();
  }
}

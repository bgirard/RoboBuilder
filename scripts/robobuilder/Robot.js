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
    return 1;
  }

  getCargo() {
    return this.cargo;
  }

  getType() {
    return this.type;
  }

  pickupItem(x, y) {
    this.order = OrderType.PICKUP;
    this.orderX = x;
    this.orderY = y;
  }

  dropoffItem(x, y) {
    this.order = OrderType.DROPOFF;
    this.orderX = this.orderX;
    this.orderY = this.orderY;
  }
}

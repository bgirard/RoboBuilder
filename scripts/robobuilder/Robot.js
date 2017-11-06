const OrderType = {
  PICKUP: {
  },
  DROPOFF: {
  },
};

class Robot {
  constructor(gameObject, container, type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.gameObject = gameObject;
    this.assignedTo = null;
    this.cargo = null; //Item.IRON_ORE;
    this.order = null;
    this.orderX = 0;
    this.orderY = 0;
    this.container = container;
    this.gameObject = gameObject;

    this.pixiObject = this.createPixiObject();
  }

  createPixiObject() {
    let robot = new PIXI.Sprite(AssetLoader.getAssetTexture('robot'));

    // center the sprite's anchor point
    robot.anchor.set(0.5);

    robot.width = TILE_SIZE.x / 4 * 3;
    robot.height = TILE_SIZE.y / 4 * 3;

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

  isIdle() {
    return this.assignedTo === null;
  }

  isAssigned() { 
    return !isIdle();
  }

  getAssignedFactory() {
    return this.assignedTo;
  }

  onTick() {
    this.updateOrder();
    let pos = this.getCurrentPos();
    this.pixiObject.x = pos[0];
    this.pixiObject.y = pos[1];
  }

  updateOrder() {
    if (!this.order) {
      if (!this.cargo && this.assignedTo && this.assignedTo.getCraftTarget()) {
        let targetInput = Item[this.assignedTo.getCraftTarget().recipe.input];
        let pos = this.getCurrentPos();
        let target = this.gameObject.gameBoard.findItem(targetInput, pos[0], pos[1]);
        if (target) {
          this.pickupItem(target[0] * TILE_SIZE.x + TILE_SIZE.centerX, target[1] * TILE_SIZE.y + TILE_SIZE.centerY);
        }
      }
    }
  }

  assignTo(factory) {
    this.stopOrder();
    this.assignedTo = factory;
  }

  stopOrder() {
    let pos = this.getCurrentPos();
    this.x = pos[0];
    this.y = pos[1];
    this.order = null;
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

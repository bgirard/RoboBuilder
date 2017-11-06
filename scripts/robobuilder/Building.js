class Building {
  constructor(gameObject, container, type, x, y) {
    this.container = container;
    this.type = type;
    this.x = x;
    this.y = y;
    this.pixiObject = this.createPixiObject();
    this.haulers = [];
    this.craftTarget = null;
    this.inputItem = null;
    this.outputItem = null;
    this.gameObject = gameObject;
  }

  createPixiObject() {
    let factory = new PIXI.Sprite(AssetLoader.getAssetTexture('factory'));

    // center the sprite's anchor point
    factory.anchor.set(0.5);

    factory.width = TILE_SIZE.x;
    factory.height = TILE_SIZE.y;

    // move the sprite to the center of the screen
    factory.x = (this.x + 0.5) * TILE_SIZE.x;
    factory.y = (this.y + 0.5) * TILE_SIZE.y;

    this.container.addChild(factory);

    return factory;
  }

  getPixelX() {
    return this.x * TILE_SIZE.x + TILE_SIZE.centerX;
  }

  getPixelY() {
    return this.y * TILE_SIZE.y + TILE_SIZE.centerY;
  }

  assignRobot(robot) {
    this.haulers.push(robot);
    robot.assignTo(this);
  }

  unassignRobot(robot) {
    if (this.haulers.indexOf(robot) === -1) {
      throw new Error("not assigned to this");
    }
    this.haulers.remove(robot);
    robot.assignTo(null);
  }

  getHaulers() {
    return this.haulers;
  }

  setCraftTarget(item) {
    this.craftTarget = item;
  }

  getCraftTarget() {
    return this.craftTarget;
  }

  getInputItem() {
    return this.inputItem;
  }

  takeInputItem() {
    let r = this.inputItem;
    this.inputItem = null;
    return r;
  }

  takeOutputItem() {
    let r = this.outputItem;
    this.outputItem = null;
    return r;
  }

  putInputItem(item) {
    if (this.inputItem) {
      throw new Error('Already have an input item, cant destroy item.');
    }
    this.inputItem = item;
  }

  getOutputItem() {
    return this.outputItem;
  }
};

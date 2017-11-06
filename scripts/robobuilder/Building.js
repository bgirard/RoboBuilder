class Building {
  constructor(container, type, x, y) {
    this.container = container;
    this.type = type;
    this.x = x;
    this.y = y;
    this.pixiObject = this.createPixiObject();
    this.haulers = [];
    this.craftTarget = null;
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
    robot.assignedTo = this;
  }

  unassignRobot(robot) {
    if (this.haulers.indexOf(robot) === -1) {
      throw new Error("not assigned to this");
    }
    this.haulers.remove(robot);
    robot.assignedTo = null;
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
};

class Building {
  constructor(container, type, x, y) {
    this.container = container;
    this.type = type;
    this.x = x;
    this.y = y;
    this.pixiObject = this.createPixiObject();
  }

  createPixiObject() {
    let factory = PIXI.Sprite.fromImage('assets/robot.png');
    factory.rotation = 3.14 / 2;

    // center the sprite's anchor point
    factory.anchor.set(0.5);

    factory.width = TILE_SIZE.x;
    factory.height = TILE_SIZE.y;

    // move the sprite to the center of the screen
    factory.x = this.x;
    factory.y = this.y;

    this.container.addChild(factory);

    return factory;
  }
};

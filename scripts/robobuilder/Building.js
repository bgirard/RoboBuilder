class Building {
  constructor(container, type, x, y) {
    this.container = container;
    this.type = type;
    this.x = x;
    this.y = y;
    this.pixiObject = this.createPixiObject();
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
};

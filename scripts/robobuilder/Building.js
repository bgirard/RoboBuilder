class Building {
  constructor(gameObject, container, type, x, y) {
    this.container = container;
    this.type = type;
    this.x = x;
    this.y = y;
    this.pixiObject = this.createPixiObject();
    this.haulers = [];
    this.storage = {
      allow: {
        // Item -> true
      },
      content: {
        // Item -> count
      },
    };
    this.craftTarget = null;
    this.inputItem = null;
    this.outputItem = null;
    this.gameObject = gameObject;
    this.craftStarted = null;
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

  startCraft() {
    this.takeInputItem();
    this.craftStarted = performance.now();
  }

  finishCraft() {
    this.craftStarted = null;
    this.outputItem = this.craftTarget;
  }

  getCraftProgress() {
    if (!this.craftStarted) {
      return null;
    }
    let fraction = (performance.now() - this.craftStarted) / this.craftTarget.recipe.energy / 1000;
    if (fraction > 1) {
      fraction = 1;
    }
    return fraction;
  }

  storeItem(item) {
    this.storage.content[item.name] = (this.storage.content[item.name] || 0) + 1;
  }

  getAllowedStorage() {
    return this.storage.allow;
  }

  setAllowStorage(item, value) {
    this.storage.allow[item.name] = (value != null ? value : false);
  }

  getStorageControls(container) {
    let caption = createElement(container, 'div', {});
    caption.textContent = 'Storage:';

    for (let i of Object.values(Item)) {
      let itemDiv = createElement(container, 'div', {});
      let name = createElement(itemDiv, 'text', {});
      name.textContent = i.name + ": ";
      createDynamicLabel(itemDiv, () => {
        return "x" + (this.storage.content[i.name] || 0);
      });
      let allowDisallowBtn = createElement(itemDiv, 'span', {});
      allowDisallowBtn.setAttribute('data-command', 'onclick');
      allowDisallowBtn.onclick = function() {
        this.storage.allow[i.name] = !this.storage.allow[i.name];
      }.bind(this);
      createDynamicLabel(allowDisallowBtn, () => {
        return this.storage.allow[i.name] ? 'Disallow' : 'Allow';
      });
    }

    return container;
  }

  onTick() {
    if (this.craftStarted) {
      // Check finish craft
      if (this.getCraftProgress() >= 1) {
        this.finishCraft();
      }
    } else if (!this.getOutputItem() && this.getInputItem() && !this.craftStarted) {
      // Start Craft
      this.startCraft();
    }
    if (this.getOutputItem() && this.storage.allow[this.getOutputItem().name]) {
      this.storeItem(this.takeOutputItem());
    }
  }

};

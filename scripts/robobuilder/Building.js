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
    this.constructed = false;
  }

  setConstructed() {
    this.constructed = true;
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

  unstoreItem(item) {
    this.storage.content[item.name] = (this.storage.content[item.name] || 0) - 1;
    if (this.storage.content[item.name] < 0) {
      throw new Error('unstored item we didnt have');
    }
    return item;
  }

  getStorageCount(item) {
    return this.storage.content[item.name] || 0;
  }

  getAllowedStorage() {
    return this.storage.allow;
  }

  setAllowStorage(item, value) {
    this.storage.allow[item.name] = (value != null ? value : false);
  }

  isStorageAllows(item) {
    return !!this.storage.allow[item.name];
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
    if (this.craftTarget) {
      let requiredInputItem = Item[this.craftTarget.recipe.input];
      if (!this.getInputItem() && this.getStorageCount(requiredInputItem)) {
        let inputItem = this.unstoreItem(requiredInputItem);
        this.putInputItem(inputItem);
      }
    }
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

  populateTab(craftingDiv) {
    craftingDiv.innerHTML = "";
    let assignRobotDiv = createElement(craftingDiv, 'div', {});
    createDynamicLabel(assignRobotDiv, () => {
      return "Assigned Robots: " + this.getHaulers().length;
    });
    let assignCount = createElement(assignRobotDiv, 'text');
    let assignRobotMinusBtn = createElement(assignRobotDiv, 'span', {});
    assignRobotMinusBtn.textContent = '-';
    assignRobotMinusBtn.setAttribute('data-command', 'onclick');
    assignRobotMinusBtn.onclick = function() {
      let haulers = this.getHaulers();
      if (haulers.length === 0) {
        alert('No hauler robot to unassigned');
        return;
      }
      this.unassignRobot(haulers[0]);
    }.bind(this);
    let assignRobotPlusBtn = createElement(assignRobotDiv, 'span', {});
    assignRobotPlusBtn.textContent = '+';
    assignRobotPlusBtn.setAttribute('data-command', 'onclick');
    assignRobotPlusBtn.onclick = function() {
      let idleRobots = this.gameObject.gameBoard.getIdleRobots();
      if (idleRobots.length === 0) {
        alert('No idle robots to assigned');
        return;
      }
      let idleRobot = idleRobots[0];
      this.assignRobot(idleRobot);
      this.populateTab(craftingDiv);
    }.bind(this);

    if (this.constructed) {
      this.populateTabConstructed(craftingDiv);
    } else {
      this.populateTabUnderconstruction(craftingDiv);
    }
  }

  populateTabUnderconstruction(craftingDiv) {
    let caption= createElement(craftingDiv, 'span', {});
    caption.textContent = 'Under construction, waiting for an assigned robot to place factory';
  }

  populateTabConstructed(craftingDiv) {
    if (this.getCraftTarget()) {
      // Assume that we can't have an in/out item that doesn't match recipe
      createDynamicLabel(craftingDiv, () => {
        let craftTarget = this.getCraftTarget();
        return "Crafting: " + craftTarget.name;
      }, {newline:true});
      createDynamicLabel(craftingDiv, () => {
        let craftTarget = this.getCraftTarget();
        const inputCount = this.getInputItem() ? 1 : 0;
        return "Input: " + Item[craftTarget.recipe.input].name + " (" + inputCount + ")";
      }, {newline:true});
      createDynamicLabel(craftingDiv, () => {
        let craftTarget = this.getCraftTarget();
        const outputCount = this.getOutputItem() ? 1 : 0;
        return "Output: " + craftTarget.name + " (" + outputCount + ")";
      }, {newline:true});
      createDynamicLabel(craftingDiv, () => {
        let craftTarget = this.getCraftTarget();
        const outputCount = this.getOutputItem() ? 1 : 0;
        return "Crafting: " + Math.floor((this.getCraftProgress() || 0) * 100) + "%";
      }, {newline:true});
      this.getStorageControls(craftingDiv);
    }
    let pickRecipeBtn = createElement(craftingDiv, 'div', {});
    pickRecipeBtn.textContent = 'Pick Recipe';
    pickRecipeBtn.setAttribute('data-command', 'pick-recipe');
  }
};

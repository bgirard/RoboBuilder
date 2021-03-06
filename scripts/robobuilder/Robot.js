const OrderType = {
  MINE: {
  },
  MOVE: {
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

  setCargo(item) {
    this.cargo = item;
  }

  takeCargo() {
    let i = this.cargo;
    this.cargo = null;
    return i;
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

  getWorkItemTo(targetItem, building, doWorkCallback) {
    let pos = this.getCurrentPos();
    if (!this.cargo) {
      let target = this.gameObject.gameBoard.findItem(targetItem, pos[0], pos[1]);
      if (target) {
        let targetX = target[0] * TILE_SIZE.x + TILE_SIZE.centerX;
        let targetY = target[1] * TILE_SIZE.y + TILE_SIZE.centerY;
        if (pos[0] != targetX || pos[1] != targetY) {
          this.moveTo(targetX, targetY);
        } else if (target[2] === "ore") {
          this.setCargo(targetItem); 
        } else if (!!target[2].isBuilding) {
          let gotItem = target[2].takeItemFromOutputOrStorage(targetItem);
          if (gotItem) {
            this.setCargo(gotItem); 
          }
        }
      }
    } else if (this.cargo === targetItem) {
      let targetX = building.x * TILE_SIZE.x + TILE_SIZE.centerX;
      let targetY = building.y * TILE_SIZE.y + TILE_SIZE.centerY;
      if (pos[0] != targetX || pos[1] != targetY) {
        this.moveTo(targetX, targetY);
      } else {
        doWorkCallback();
      }
    } else if (this.cargo && building.isStorageAllows(this.cargo)) {
      // Drop wrong item to storage
      let targetX = building.x * TILE_SIZE.x + TILE_SIZE.centerX;
      let targetY = building.y * TILE_SIZE.y + TILE_SIZE.centerY;
      if (pos[0] != targetX || pos[1] != targetY) {
        this.moveTo(targetX, targetY);
      } else {
        let item = this.takeCargo();
        building.storeItem(item);
      }
    } else if (this.cargo && !building.isStorageAllows(this.cargo)) {
      // Destroy cargo to unblock, may want to change this later
      this.takeCargo();
    }

  }

  updateOrder() {
    if (!this.order && this.assignedTo && !this.assignedTo.constructed) {
      this.getWorkItemTo(Item.FACTORY, this.assignedTo, () => {
        if (!this.constructed) {
          let item = this.takeCargo();
          this.assignedTo.setConstructed();
        }
      });
    } else if (!this.order && this.assignedTo && this.assignedTo.constructed && this.assignedTo.getCraftTarget()) {
      let targetInput = Item[this.assignedTo.getCraftTarget().recipe.input];
      this.getWorkItemTo(targetInput, this.assignedTo, () => {
        if (this.assignedTo.getInputItem() === null) {
          let item = this.takeCargo();
          this.assignedTo.putInputItem(item);
        }
      });
    } else if (this.getMoveProgress() === 1) {
      this.stopOrder(); // Done movement
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

  getMoveProgress() {
    if (this.order === null) {
      return null;
    }
    let dx = this.orderX - this.x;
    let dy = this.orderY - this.y;
    let dt = performance.now() - this.orderStart;
    let totalDist = Math.sqrt(dx * dx + dy * dy);
    if (totalDist <= 0) {
      return 1;
    }
    let speed = this.getSpeed();
    let travelDist = dt / 1000.0 * speed;
    let progress = travelDist / totalDist;
    if (progress > 1 ) {
      progress = 1;
    }
    return progress; 
  }

  getCurrentPos() {
    if (this.order === null) {
      return [this.x, this.y];
    }
    let dx = this.orderX - this.x;
    let dy = this.orderY - this.y;
    let progress = this.getMoveProgress();
    
    return [this.x + progress * dx, this.y + progress * dy];
  }

  moveTo(x, y) {
    this.order = OrderType.MOVE;
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

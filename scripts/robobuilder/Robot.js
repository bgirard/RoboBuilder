const OrderType = {
  PICKUP: {
  },
  DROPOFF: {
  },
};

class Robot {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.cargo = Item.IRON_ORE;
    this.order = null;
    this.orderX = 0;
    this.orderY = 0;
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

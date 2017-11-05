class Robot {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
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
    return Item.IRON_ORE;
  }
}

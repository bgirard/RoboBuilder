class GameObject {
  constructor(gameBoard) {
    this.selectedCoord = null;
    this.gameBoard = gameBoard;
  }
  
  setSelected(coord) {
    this.selectedCoord = coord;
    let ore = this.gameBoard.getOre(coord.x, coord.y);
    let ground = this.gameBoard.getGroundType(coord.x, coord.y);
    let building = this.gameBoard.getBuilding(coord.x, coord.y);
    
    const controlsContainer = document.getElementById('controlsContainer');
    if (building) {
      controlsContainer.className = 'factorySelected';
    } else if (ore) {
      controlsContainer.className = 'oreSelected';
    } else if (ground.name == "dirt") {
      controlsContainer.className = 'groundSelected';
    } else {
      controlsContainer.className = '';
    }  
  }

  focusDiv(id) {
    const controlsContainer = document.getElementById('controlsContainer');
    controlsContainer.className = id + 'Selected';
    return document.getElementsByClassName(id + 'Controls')[0];
  }
}

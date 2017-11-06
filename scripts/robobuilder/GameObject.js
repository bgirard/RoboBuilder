class GameObject {
  constructor(gameBoard) {
    this.selectedCoord = null;
    this.gameBoard = gameBoard;
  }
  
  setSelected(coord) {
    this.selectedCoord = coord;
    let ore = this.gameBoard.getOre(coord.x, coord.y);
    let ground = this.gameBoard.getGroundType(coord.x, coord.y);
    if (ore) {
      document.getElementById('controlsContainer').className = 'oreSelected';
    } else if (ground.name == "dirt") {
      document.getElementById('controlsContainer').className = 'groundSelected';
    } else {
      document.getElementById('controlsContainer').className = '';
    }
    
  }
}
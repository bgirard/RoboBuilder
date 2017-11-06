class GameObject {
  constructor(gameBoard) {
    this.selectedCoord = null;
    this.gameBoard = gameBoard;
  }
  
  setSelected(coord) {
    this.selectedCoord = coord;
    
    this.gameBoard.setSelectedCoord(coord);
    
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
    this.refreshTab();
  }

  focusDiv(id) {
    const controlsContainer = document.getElementById('controlsContainer');
    controlsContainer.className = id + 'Selected';
    this.refreshTab();
    return document.getElementsByClassName(id + 'Controls')[0];
  }

  refreshTab() {
    let currBuilding = this.gameBoard.getBuilding(
      this.selectedCoord.x, 
      this.selectedCoord.y,
    );

    if (currBuilding) {
      let craftingDiv = document.getElementById('craftingStatus');
      craftingDiv.innerHTML = "";
      createElement(craftingDiv, 'div', {}).textContent = "Assigned Robots: " + currBuilding.getHaulers().length;
      if (currBuilding.getCraftTarget()) {
        createElement(craftingDiv, 'div', {}).textContent = "Crafting: " + currBuilding.getCraftTarget().name;
      }
    }
  }
}

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
      let craftTarget = currBuilding.getCraftTarget();
      if (craftTarget) {
        // Assume that we can't have an in/out item that doesn't match recipe
        const inputCount = currBuilding.getInputItem() ? 1 : 0;
        const outputCount = currBuilding.getOutputItem() ? 1 : 0;
        createElement(craftingDiv, 'div', {}).textContent = "Crafting: " + craftTarget.name;
        createElement(craftingDiv, 'div', {}).textContent = "Input: " + Item[craftTarget.recipe.input].name + " (" + inputCount + ")";
        createElement(craftingDiv, 'div', {}).textContent = "Output: " + craftTarget.name + " (" + outputCount + ")";
      }
    }
  }
}

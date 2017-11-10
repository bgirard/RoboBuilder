class GameObject {
  constructor(gameBoard) {
    this.selectedCoord = null;
  }

  setGameBoard(board) {
    this.gameBoard = board;
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
    let currBuilding = null;
    
    if (this.selectedCoord) {
      currBuilding= this.gameBoard.getBuilding(
        this.selectedCoord.x, 
        this.selectedCoord.y,
      );
    }

    if (currBuilding) {
      let craftingDiv = document.getElementById('craftingStatus');
      craftingDiv.innerHTML = "";
      let assignRobotDiv = createElement(craftingDiv, 'div', {});
      createDynamicLabel(assignRobotDiv, () => {
        return "Assigned Robots: " + currBuilding.getHaulers().length;
      });
      let assignCount = createElement(assignRobotDiv, 'text');
      let assignRobotMinusBtn = createElement(assignRobotDiv, 'span', {});
      assignRobotMinusBtn.textContent = '-';
      assignRobotMinusBtn.setAttribute('data-command', 'onclick');
      assignRobotMinusBtn.onclick = function() {
        let haulers = currBuilding.getHaulers();
        if (haulers.length === 0) {
          alert('No hauler robot to unassigned');
          return;
        }
        currBuilding.unassignRobot(haulers[0]);
      }.bind(this);
      let assignRobotPlusBtn = createElement(assignRobotDiv, 'span', {});
      assignRobotPlusBtn.textContent = '+';
      assignRobotPlusBtn.setAttribute('data-command', 'onclick');
      assignRobotPlusBtn.onclick = function() {
        let idleRobots = this.gameBoard.getIdleRobots();
        if (idleRobots.length === 0) {
          alert('No idle robots to assigned');
          return;
        }
        let idleRobot = idleRobots[0];
        currBuilding.assignRobot(idleRobot);
        this.refreshTab();
      }.bind(this);
      if (currBuilding.getCraftTarget()) {
        // Assume that we can't have an in/out item that doesn't match recipe
        createDynamicLabel(craftingDiv, () => {
          let craftTarget = currBuilding.getCraftTarget();
          return "Crafting: " + craftTarget.name;
        }, {newline:true});
        createDynamicLabel(craftingDiv, () => {
          let craftTarget = currBuilding.getCraftTarget();
          const inputCount = currBuilding.getInputItem() ? 1 : 0;
          return "Input: " + Item[craftTarget.recipe.input].name + " (" + inputCount + ")";
        }, {newline:true});
        createDynamicLabel(craftingDiv, () => {
          let craftTarget = currBuilding.getCraftTarget();
          const outputCount = currBuilding.getOutputItem() ? 1 : 0;
          return "Output: " + craftTarget.name + " (" + outputCount + ")";
        }, {newline:true});
      }
    }
  }
}

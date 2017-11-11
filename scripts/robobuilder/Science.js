const Science = {
  ROBOT_MOVE_SPEED_1: {
    name: 'Robot Move Speed 1',
    prereq: [],
    effect: (effects) => {
      activeModifier['robot_move'].push(5);
    },
  },
  ROBOT_MOVE_SPEED_2: {
    name: 'Robot Move Speed 2',
    prereq: ['ROBOT_MOVE_SPEED_1'],
    effect: (effects) => {
      activeModifier['robot_move'].push(0.1);
    },
  },
};

const activeModifier = {
  // name => [int];
};

function getResearchModifier(name, base) {
   let value = base || 0;
   if (activeModifier[name]) {
     for (let mod of activeModifier[name]) {
       value += mod;
     }
   }
   return value;
}

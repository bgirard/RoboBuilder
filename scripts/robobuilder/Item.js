const Item = {
  IRON_ORE: {
    name: 'Iron Ore',
    asset: 'ore_iron',
  },
  GOLD_ORE: {
    name: 'Gold Ore',
    asset: 'ore_gold',
  },
  COPPER_ORE: {
    name: 'Copper Ore',
    asset: 'ore_copper',
  },
  IRON: {
    name: 'Iron',
    asset: 'ore_iron',
    recipe: {
      energy: 4,
      input: 'IRON_ORE',
    }
  },
  COPPER: {
    name: 'Copper',
    asset: 'ore_copper',
    recipe: {
      energy: 4,
      input: 'COPPER_ORE',
    }
  },
};

function getCraftable() {
  return Object.values(Item).filter(i => {return i.recipe});
}
  

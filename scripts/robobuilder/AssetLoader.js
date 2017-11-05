class AssetLoader {
  static getAssetTexture(assetName) {
    if (!AssetLoader.assetsLoaded) {
      throw new Exception("call loadAllAssets before trying to use assets");
    }
    if (assetName in PIXI.loader.resources) {
      return PIXI.loader.resources[assetName].texture;
    }
    throw new Exception("asset " + assetName + " not loaded");
  }
  
  static loadAllAssets(callback) {
    var loader = PIXI.loader
      .add('ore_copper', '/assets/ore_copper.png')
      .add('ore_gold', '/assets/ore_gold.png')
      .add('ore_iron', '/assets/ore_iron.png')
      .add('robot', '/assets/robot.png')
      .add('terrain_dirt', '/assets/terrain_dirt.png')
      .add('terrain_grass', '/assets/terrain_grass.png')
      .once('complete', function(loader, resources) {
        AssetLoader.assetsLoaded = true;
        callback();
      }).load();
  }
}

AssetLoader.assetsLoaded = false;
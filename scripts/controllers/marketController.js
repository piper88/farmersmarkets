(function(module) {
  var marketController = {};

  marketController.loadMarketsByZip = function() {
    Market.createTable();
  };

  module.marketController = marketController;
})(window);

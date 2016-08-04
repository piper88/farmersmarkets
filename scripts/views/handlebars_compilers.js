var listMarketsCompiler = function(closestMarkets) {
  var marketsToShow = Handlebars.compile($('#list-of-markets').text());
  return marketsToShow(closestMarkets);
};

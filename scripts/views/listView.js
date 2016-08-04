(function(module) {
  var listView = {};

  listView.sortByDistance = function() {
    // $('#list-container').append(listMarketsCompiler(??));
    var source = $('#list-of-markets').html();
    var template = Handlebars.compile(source);
    return template(this);
  };

  listView.sortByDistance();
  module.listView = listView;
})(window);

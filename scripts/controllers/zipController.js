
var chooseZip = function () {
  $('#zip').submit(function() {
    var chosenZip = parseInt($('#zip').val());
    return chosenZip;
  });
};

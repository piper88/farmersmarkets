(function(module) {
  // Permit constructor
  function Market (opts) {
    for (keys in opts) {
      this[keys] = opts[keys];
    }
  }

  Market.all = [];

  Market.getData = function(zip) {
    // webDB.execute('SELECT * FROM marketdata', function(rows) {
    //   if (rows.length) {
    //     console.log('Market.getData: inside if');
    //     Market.all = rows;
    //     Market.all.forEach(function(singleMarket) {
    //       var market = new Market(singleMarket);
    //       $('#list-container').append(market.toHtml());
    //     });
    //   } else {
    $('#list-container').empty();

    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,

      dataType: 'jsonp',
      success: function(data) {
        Market.all = data;
        // console.log(Market.all);
        // if (!rows.length) {
        //   console.log(Market.all);
        Market.all.results.forEach(function(singleMarket) {
          //splice first 4 characters off, set to distance variable
          // singleMarket = singleMarket.marketname.slice(3);
          // console.log(singleMarket);
          // var newMarket = singleMarket.marketname.slice(3);
          var market = new Market(singleMarket);
          // console.log(market);
          market.insertPermit();
          $('#list-container').append(market.toHtml());
        });
        Market.addDetailListener();
        // }
      }

    });
      // }
    // });
  };

//TODO: as soon as list of markets shows up, add event listener to each market, so when clicked, the id is saved and it triggers the Details.getData(with clicked id)
  Market.addDetailListener = function() {
    $('.list-display').on('click', '.show-more', function(ctx) {
      console.log($(this));
      console.log(ctx.toElement.id);
      Details.getData(ctx.toElement.id);
    });
  };

  Market.createTable = function(next) {
    console.log('inside Market.createTable');
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS marketdata (' +
        'id INTEGER PRIMARY KEY, ' +
        'marketname VARCHAR(255)); '
    );
    Market.findMarketsByZip();
  };

  Market.findMarketsByZip = function() {
    // webDB.execute('DELETE * from marketdata');
    $('#formiepoo').on('submit', function(e) {
      e.preventDefault();
      // webDB.execute('DELETE * from marketdata');
      var chosenZip = $('#zip').val();
      if (chosenZip.length === 0) {
        console.log('zip is not present');
        Market.getData(98103);
      } else {
        console.log('zip chosen is' + chosenZip);
        Market.getData(chosenZip);
      }
    });
  };

//eventually sort permits by distance, before inserting
  Market.prototype.insertPermit = function () {
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO marketdata (marketname) VALUES (?);',
          'data': [this.marketname],
        }
      ]
    );
  };

//should eventually go in views
  Market.prototype.toHtml = function() {
    var source = $('#list-of-markets').html();
    var template = Handlebars.compile(source);
    return template(this);
  };

//put this line in the marketController file...perhaps correct, perhaps not
  // Market.createTable();
  marketController.loadMarketsByZip();

  module.Market = Market;
})(window);

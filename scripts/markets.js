(function(module) {

  function Markets (opts) {
    for (keys in opts) {
      this[keys] = opts[keys];
    };
  };

  Markets.all = [];
  //
  // Markets.getFromApi = function(data) {
  //   console.log('in getFromApi');
  //   Markets.all = data;
  //   if (!rows.length) {
  //     Markets.all.results.forEach(function(singleMarket) {
  //       var market = new Markets(singleMarket);
  //       market.insertRecord();
  //     });
  //   }
  //   webDB.execute('SELECT * from marketdata', function(rows) {
  //     console.log('oh hai');
  //   });
  // };

  //function to get the data from local database if it exists, if not, get from api
  Markets.getData = function() {
    console.log('in getData');
    webDB.execute('SELECT * from marketdata', function(rows) {
      console.log('in getData 2');
      if (rows.length) {
        console.log('in getData, rows exist');
        Markets.all = rows;
      } else {
        console.log('in getData, rows do not exist');
        $.ajax({
          type: 'GET',
          contentType: "application/json; charset=utf-8",
          url: 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=98103',
          dataType: 'jsonp',
          success: function(data) {
            Markets.all = data;
            if (!rows.length) {
              Markets.all.results.forEach(function(singleMarket) {
                var market = new Markets(singleMarket);
                market.insertRecord();
              });
            }
          }
        });
      }
    });
  };

  //function to create the websql table, then call the get data after created
  Markets.createTable = function() {
    console.log('in createTable');
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS marketdata (' +
      'id INTEGER PRIMARY KEY, ' +
      'marketname VARCHAR(255);',
    function () {
      console.log('successfully set up markets table');
    }
    );
    // Markets.getData();
  };

  //function to insert Markets record into websql table

  Markets.prototype.insertRecord = function() {
    console.log('in insertRecord');
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO marketdata(id, marketname) VALUES (?, ?);',
          'data': [this.results.id, this.results.marketname],
        }
      ]
    );
  };

  Markets.createTable();
  Markets.getData();

  module.Markets = Markets;
})(window);

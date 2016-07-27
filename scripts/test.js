(function(module) {

  function Markets (opts) {
    for (keys in opts) {
      this[keys] = opts[keys];
    };
  };

  Markets.all = [];

  Markets.getFromApi = function(data) {
    console.log('in getFromApi');
    Markets.all = data;
    if (!rows.length) {
      Markets.all.results.forEach(function(singleMarket) {
        var market = new Markets(singleMarket);
        market.insertRecord();
      });
    }
    // webDB.execute('SELECT * from marketdata', function(rows) {
    //   console.log('oh hai');
    // });
  };

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
          url: 'https://data.seattle.gov/resource/3c4b-gdxv.json',
          callback: 'Markets.getFromApi',
        });
      }
    });
  };

  //function to create the websql table, then call the get data after created
  Markets.createTable = function(next) {
    console.log('in createTable');
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS marketdata (' +
      'address VARCHAR(255), ' +
      'city_feature VARCHAR(255);',
      function() {
        console.log('successfully set up marketdata table');
      }
    );
    Markets.getData();
  };

  //function to insert Markets record into websql table

  Markets.prototype.insertRecord = function() {
    console.log('in insertRecord');
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO marketdata(address, city_feature) VALUES (?, ?);',
          'data': [this.address, this.city_feature],
        }
      ]
    );
  };

  Markets.createTable();

  module.Markets = Markets;
})(window);

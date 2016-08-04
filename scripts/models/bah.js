//safe js that actually works and inserts data into websql db
(function(module) {
  // Permit constructor
  function Market (opts) {
    for (keys in opts) {
      this[keys] = opts[keys];
    }
  }

  Market.all = [];

  Market.getData = function() {
    webDB.execute('SELECT * FROM marketdata', function(rows) {
      if (rows.length) {
        console.log('Market.getData: inside if');
        Market.all = rows;
      } else {
        console.log('Market.getData: inside else');
        $.get('https://data.seattle.gov/resource/3c4b-gdxv.json',
        function(data) {
          Market.all = data;
          if (!rows.length) {
            Market.all.forEach(function(singleMarket) {
              var market = new Market(singleMarket);
              market.insertPermit();
            });
          }
        });
      }
    });
  };

  Market.createTable = function(next) {
    console.log('inside Market.createTable');
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS marketdata (' +
        'id INTEGER PRIMARY KEY, ' +
        'address VARCHAR(255), ' +
        'city_feature VARCHAR(255));'

    );
    Market.getData();
  };

  Market.prototype.insertPermit = function () {
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO marketdata(address, city_feature) VALUES (?, ?);',
          'data': [this.address, this.city_feature],
        }
      ]
    );
  };

  Market.createTable();
  // Market.getData();

  module.Market = Market;
})(window);

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
        $.ajax({
          type: "GET",
          contentType: "application/json; charset=utf-8",
          url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=98103",

          dataType: 'jsonp',
          success: function(data) {
            Market.all = data;
            if (!rows.length) {
              Market.all.forEach(function(singleMarket) {
                var market = new Market(singleMarket);
                market.insertPermit();
              });
            }
          }

        });
      }
    });
  };

//   function searchResultsHandler(data) {
//     Market.all = data;
//     if (!rows.length) {
//       Market.all.forEach(function(singleMarket) {
//         var market = new Market(singleMarket);
//         market.insertPermit();
//       });
//     }
//
//   };
//
//   function getResults(zip) {
//     // or
//     // function getResults(lat, lng) {
//     $.ajax({
//         type: "GET",
//         contentType: "application/json; charset=utf-8",
//         // submit a get request to the restful service zipSearch or locSearch.
//         url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
//         // or
//         // url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + lat + "&lng=" + lng,
//         dataType: 'jsonp',
//         jsonpCallback: 'searchResultsHandler'
//     });
// }
// //iterate through the JSON result object.
// function searchResultsHandler(searchResults) {
//     for (var key in searchresults) {
//         alert(key);
//         var results = searchresults[key];
//         for (var i = 0; i < results.length; i++) {
//             var result = results[i];
//             for (var key in result) {
//                 //only do an alert on the first search result
//                 if (i == 0) {
//                     alert(result[key]);
//                 }
//             }
//         }
//     }
// }

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

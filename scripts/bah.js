(function(module) {
  // var sortedByDistancePermits = [];
  // Permit constructor
  function Permit (opts) {
    for (keys in opts) {
      this[keys] = opts[keys];
    }
    // this.URL = opts.Permit_and_complaint_status_url.url;
  }

  Permit.all = [];

  Permit.getData = function(next) {
    webDB.execute('SELECT * FROM Permitdata', function(rows) {
      if (rows.length) {
        console.log('Permit.getData: inside if');
        Permit.all = rows;
        // theMap.dropAllPins(rows, next);
      } else {
        console.log('Permit.getData: inside else');
        //debugger;
        $.get('https://data.seattle.gov/resource/3c4b-gdxv.json', function(data) {
          Permit.all = data;
          if (!rows.length) {
            Permit.all.forEach(function(singlePermit) {
              var Permit = new Permit(singlePermit);
              Permit.insertPermit();
            });
          }
          // webDB.execute('SELECT * FROM Permitdata', function(rows) {
          //   theMap.dropAllPins(rows, next);
          // });
        });
      }
    });
  };

  Permit.createTable = function() {
    console.log('inside Permit.createTable');
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS Permitdata (' +
        'id INTEGER PRIMARY KEY, ' +
        'name VARCHAR(255) NOT NULL); '

      // callback
    );
    Permit.getData();
  };

  Permit.prototype.insertPermit = function () {
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO Permitdata(name) VALUES (?);',
          'data': [this.name],
        }
      ]
    );
  };

  Permit.createTable();
  // Permit.getData();

  module.Permit = Permit;
})(window);

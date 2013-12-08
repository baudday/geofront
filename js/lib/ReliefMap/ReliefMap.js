define("ReliefMap", ["CouchRest", "leaflet"], function(CouchRest, L) {
    function ReliefMap() {
        this.couchRest = new CouchRest({
            couchUrl: config.couchUrl,
            apiUrl: config.baseApiUrl
        });
    };

    ReliefMap.prototype.update = function(opts) {
        if(opts.area) this.area = opts.area;
        if(opts.offline) this.offline = opts.offline;
    };

    ReliefMap.prototype.getTileLayer = function(callback) {
        var _this = this;

        // offline & no area
        if(!this.area && this.offline) {
            callback();
            return;
        }

        // online
        if(!this.offline) {
            callback(L.tileLayer(
                    '//a.tiles.mapbox.com/v3/baudday.map-jos24le8/{z}/{x}/{y}.png'
                )
            );
            return;
        }

        // offline w/ area
        var opts = {local: true, key: this.area};
        var query = {
            fun: {
                map: function (doc) {
                    emit(doc.area, doc);
                }
            },
            opts: opts
        };

        this.couchRest.query('tiles', query, function(err, res) {
            if(err) {
                console.log(err);
                return;
            }

            var lyr = new L.TileLayer.IDBTiles('', {
                minZoom: 13,
                maxZoom: 17,
                tms: true
            }, res.rows);
            callback(lyr);
        });
    };

    return ReliefMap;
});


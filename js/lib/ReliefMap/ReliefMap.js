define("ReliefMap", ["TileDownloader", "leaflet"], function(TileDownloader, L) {
    function ReliefMap() {
        this.downloader = new TileDownloader(config);
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
        this.downloader.open(function() {
            _this.downloader.get(this.area, function(tiles) {
                var lyr = new L.TileLayer.IDBTiles('', {
                    minZoom: 13,
                    maxZoom: 17,
                    tms: true
                }, tiles);
                callback(lyr);
            });
        });
    };

    return ReliefMap;
});


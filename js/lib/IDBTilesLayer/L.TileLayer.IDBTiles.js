define([], function() {
    L.TileLayer.IDBTiles = L.TileLayer.extend({
        initialize: function(url, options, tiles) {
            options = L.setOptions(this, options);

            // detecting retina displays, adjusting tileSize and zoom levels
            if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {

                options.tileSize = Math.floor(options.tileSize / 2);
                options.zoomOffset++;

                if (options.minZoom > 0) {
                    options.minZoom--;
                }
                this.options.maxZoom--;
            }

            this._url = url;

            var subdomains = this.options.subdomains;

            if (typeof subdomains === 'string') {
                this.options.subdomains = subdomains.split('');
            }

            this.tiles = tiles;
        },
        getTileUrl: function (tilePoint) {
            this._adjustTilePoint(tilePoint);
            
            var z = this._getZoomForUrl();
            var x = tilePoint.x;
            var y = tilePoint.y;

            var result = this.tiles.filter(function(row) {
                return (row.value.tile_column === x
                        && row.value.tile_row === y
                        && row.value.zoom_level === z);
            });

            if(result[0]) return result[0].value.tile_data;
            else return;
        }
    });
});
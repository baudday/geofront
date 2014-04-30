define("TileDownloader", [], function() {
    function TileDownloader(config) {
        var _this = this;
        this.config = config;

        // Set up all the IDB stuff
        window.indexedDB = window.indexedDB || window.mozIndexedDB ||
            window.webkitIndexedDB || window.msIndexedDB;
        window.IDBTransaction = window.IDBTransaction ||
            window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange ||
            window.webkitIDBKeyRange || window.msIDBKeyRange;

        if (!window.indexedDB) return false;

        this.db = null;
    };

    TileDownloader.prototype.open = function(callback) {
        var _this = this;
        var version = 1;
        var request = window.indexedDB.open("tiles", version);

        request.onupgradeneeded = function(e) {
            _this.db = e.target.result;

            e.target.transaction.onerror = _this.onerror;

            if(_this.db.objectStoreNames.contains("tiles"))
                _this.db.deleteObjectStore("tiles");

            var store = _this.db.createObjectStore(
                "tiles",
                {keyPath: "_id"}
            );
        };

        request.onsuccess = function(e) {
            _this.db = e.target.result;
            callback();
        };

        request.error = this.onerror
    };

    TileDownloader.prototype.onerror = function() {

    };

    TileDownloader.prototype.downloadTiles = function(area, zoom, callback) {
        var _this = this;
        var trans = this.db.transaction(["tiles"], "readwrite");
        var store = trans.objectStore("tiles");

        jQuery.ajax({
            url: this.config.baseApiUrl + "/tiles/" + area + "/" + zoom,
            async: false,
            success: function(tiles) {
                jQuery.each(tiles, function(key, tile) {
                    var request = store.put(tile);
                });
            },
            error: function(error) {
                callback(error.statusText);
            },
            timeout: function() {
                callback("Request timed out. Please try again. If you continue to experience issues, please contact an administrator.");
            },
            complete: function(res) {
                callback(false, JSON.parse(res.responseText));
            }
        });
    };

    TileDownloader.prototype.clear = function() {
        var trans = this.db.transaction(["tiles"], "readwrite");
        var store = trans.objectStore("tiles");
        var request = store.clear();
    };

    TileDownloader.prototype.get = function(area, callback) {
        var tiles = [];
        var trans = this.db.transaction(["tiles"], "readwrite");
        var store = trans.objectStore("tiles");
        var cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function(evt) {
            var cursor = evt.target.result;
            if (cursor) {
                tiles.push(cursor.value);
                cursor.continue();
            }
        };

        trans.oncomplete = function() {
            callback(tiles);
        };
    };

    return TileDownloader;
});

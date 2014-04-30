define([
    "config",
    "jquery",
    "underscore",
    "backbone",
    "CouchRest",
    "TileDownloader",
    "text!../../templates/tiles/TilesTemplate.html",
    "text!../../templates/static/OfflineTemplate.html"
], function(config, $, _, Backbone, CouchRest, TileDownloader, TilesTemplate, OfflineTemplate) {
    var TilesView = Backbone.View.extend({
        el: '.body',
        couchRest: new CouchRest({
            couchUrl: config.couchUrl,
            apiUrl: config.baseApiUrl
        }),
        maps: [],
        render: function() {
            var that = this;

            this.couchRest.status(function(offline) {
                if(offline) {
                    var offlineTemplate = _.template(OfflineTemplate);
                    that.$el.html(offlineTemplate);
                } else {
                    that.$el.html(_.template(TilesTemplate));
                    that.maps.push(L.map('tacloban-map', {
                        dragging: false,
                        zoomControl: false,
                        touchZoom: false,
                        scrollWheelZoom: false,
                        doubleClickZoom: false,
                        boxZoom: false
                    }).setView([11.24525080471127, 125.00235557556154], 13));

                    that.maps.push(L.map('mass-map', {
                        dragging: false,
                        zoomControl: false,
                        touchZoom: false,
                        scrollWheelZoom: false,
                        doubleClickZoom: false,
                        boxZoom: false
                    }).setView([42.338244963350846, -71.94259643554688], 11));

                    that.maps.push(L.map('minneapolis-map', {
                        dragging: false,
                        zoomControl: false,
                        touchZoom: false,
                        scrollWheelZoom: false,
                        doubleClickZoom: false,
                        boxZoom: false
                    }).setView([44.9833, -93.2667], 11));

                    for (var i = 0; i < that.maps.length; i++) {
                        // add an OpenStreetMap tile layers
                        L.tileLayer('//a.tiles.mapbox.com/v3/baudday.map-jos24le8/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        }).addTo(that.maps[i]);
                    }

                    // DEBUG
                    // map.on('drag', function() {
                    //     console.log(this.getCenter());
                    // });
                }
            });
        },
        events: {
            'click .package-link': 'openModal',
            'click .download': 'download'
        },
        openModal: function(e) {
            this.area = $(e.target).attr('id');
            $("#confirm-download").modal('show');
            return false;
        },
        download: function() {
            var that = this;
            if(!this.area) return false;

            var downloader = new TileDownloader(config);
            if(!downloader) this.idbError("Your browser does not support IndexedDB. Unfortunately you will not be able to download tile packs.");
            return false;

            downloader.open(function() {
                var count = 0;
                that.startLoading();
                downloader.clear(); // Clear the db before

                $("#loading").on("shown.bs.modal", function() {
                    for (var i=10; i<19; i++) {
                        downloader.downloadTiles(that.area, i, function(error, tiles) {
                            if(error) {
                                that.idbError(error);
                                return;
                            }
                            // Count tiles and output
                            count += tiles.length;
                            $("#info").html(count + " tiles downloaded");
                        });
                    }

                    that.stopLoading();
                });
            });

            return false;
        },
        startLoading: function () {
            $("#loading").modal({
                backdrop: 'static',
                keyboard: false
            });
        },
        stopLoading: function () {
            $("#loading").modal('hide');
            $("#download-complete").modal({
                backdrop: 'static'
            });
        },
        idbError: function(str) {
            $(".message").html(str);
            $("#idb-error").modal({
                backdrop: 'static'
            });
        }
    });

    return TilesView;
});

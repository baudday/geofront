define([
    "config",
    "jquery",
    "underscore",
    "backbone",
    "CouchRest",
    "text!../../templates/tiles/TilesTemplate.html",
    "text!../../templates/static/OfflineTemplate.html"
], function(config, $, _, Backbone, CouchRest, TilesTemplate, OfflineTemplate) {
    var TilesView = Backbone.View.extend({
        el: '.body',
        couchRest: new CouchRest({
            couchUrl: config.couchUrl,
            apiUrl: config.baseApiUrl
        }),
        render: function() {
            var that = this;

            this.couchRest.status(function(offline) {
                if(offline) {
                    var offlineTemplate = _.template(OfflineTemplate);
                    that.$el.html(offlineTemplate);
                } else {
                    that.$el.html(_.template(TilesTemplate));
                    map = L.map('tacloban-map', {
                        dragging: false,
                        zoomControl: false,
                        touchZoom: false,
                        scrollWheelZoom: false,
                        doubleClickZoom: false,
                        boxZoom: false
                    }).setView([11.24525080471127, 125.00235557556154], 13);

                    // add an OpenStreetMap tile layer
                    L.tileLayer('//a.tiles.mapbox.com/v3/baudday.map-jos24le8/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

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
            if(window.area) var oldArea = window.area;
            window.area = this.area;

            this.startLoading();

            // Set the replication params
            var opts = {
                filter: function (doc) {
                    if(doc.area) return doc.area === window.area;
                    return false;
                },
                complete: function() {
                    window.area = oldArea;
                    that.stopLoading();
                },
                onChange: function(info) {
                    var status = info.docs_written !== 0 ?
                        info.docs_written + " tiles downloaded..." :
                        "Initializing...";
                    $("#info").html(status);
                }
            };

            // Get the tiles
            this.couchRest.replicateFrom('tiles', opts);

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
        }
    });

    return TilesView;
});

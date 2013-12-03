define([
    "jquery",
    "underscore",
    "backbone",
    "bootstrap",
    "text!../../templates/about/AboutTemplate.html"
], function($, _, Backbone, Bootstrap, AboutTemplate){

    // The map
    var map;

    var AboutView = Backbone.View.extend({
        el: '.body',
        render: function() {
            // Load everything
            var aboutTemplate = _.template(AboutTemplate);
            this.$el.html(aboutTemplate);

            map = L.map('homemap', {
                dragging: false,
                zoomControl: false
            });

            // add an OpenStreetMap tile layer
            L.tileLayer('//a.tiles.mapbox.com/v3/baudday.map-jos24le8/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            map.locate({setView: true, maxZoom: 15});

            map.on('locationfound', this.onLocationFound);

            map.on('locationerror', this.onLocationError);
        },
        onLocationFound: function(e) {
            var greenPin = L.icon({
                iconUrl: './img/pin_green.png',
                shadowUrl: './img/pin_shadow.png',

                iconSize: [25, 42],
                shadowSize: [32, 13],
                iconAnchor: [13, 42],
                shadowAnchor: [5,12],
                popupAnchor: [0,-42]
            });

            L.marker(e.latlng, {icon: greenPin}).addTo(map)
                    .bindPopup('Welcome to GeoRelief!').openPopup();
        },
        onLocationError: function(e) {
            alert(e.message);
        }
    });

    return AboutView;
});
define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'leaflet',
    'heatmap',
    'heatmapL',
    'text!templates/map/MapTemplate.html',
    'models/LoginModel',
    'collections/LocationsCollection',
    'models/LocationModel',
    'text!templates/forms/AddLocationTemplate.html',
    'forms/NewLocationForm',
    'views/EventLogView',
    'views/ServiceLogView',
    'collections/AreasCollection',
    'text!templates/logs/LogsTemplate.html',
    'text!templates/map/FiltersTemplate.html',
    'text!templates/map/AreasTemplate.html',
    'forms/AreaFilterForm',
    'text!templates/forms/AreaFilterFormTemplate.html',
    'forms/NewAreaForm',
    'text!templates/forms/AddAreaTemplate.html',
    'models/AreaModel',
    'text!templates/forms/SearchLocationsTemplate.html',
    'forms/SearchLocationsForm'
], function($, _, Backbone, Bootstrap, L, heatmapL, heatmap, MapTemplate, LoginModel, 
            LocationsCollection, LocationModel, AddLocationTemplate, NewLocationForm, EventLogView, 
            ServiceLogView, AreasCollection, LogsTemplate, FiltersTemplate, AreasTemplate, 
            AreaFilterForm, AreaFilterFormTemplate, NewAreaForm, AddAreaTemplate, AreaModel,
            SearchLocationsTemplate, SearchLocationsForm){

    var that;

    // Where we'll store the user's credentials
    var userCreds;

    // Define the icons
    var pin = L.Icon.extend({
        options: {
            shadowUrl: './img/pin_shadow.png',
            iconSize: [25, 42],
            shadowSize: [32, 13],
            iconAnchor: [13, 42],
            shadowAnchor: [5,12],
            popupAnchor: [-1,-42]
        }
    });

    var greenPin = new pin({iconUrl: './img/pin_green.png'}),
        redPin = new pin({iconUrl: './img/pin_red.png'}),
        purpPin = new pin({iconUrl: './img/pin_purp.png'}),
        grayPin = new pin({iconUrl: './img/pin_gray.png'}),
        bluePin = new pin({iconUrl: './img/pin_blue.png'});

    var newMarker = L.marker().bindPopup('Add new location here', {
        offset: new L.Point(-1, -35)
    });

    // The add location form
    var form;

    // The add log form
    var logform;

    // The map
    var map;

    // Variable for location id of new log entry
    var loc_id;

    var MapView = Backbone.View.extend({
        el: '.body',
        template: _.template(MapTemplate),
        eventLogView: new EventLogView(),
        serviceLogView: new ServiceLogView(),
        newLocation: new LocationModel(),
        locations: new Array(),
        paneVisible: false,
        render: function() {
            // Get the user's credentials
            userCreds = JSON.parse($.cookie('UserInfo'));

            that = this;

            // Load the map template
            this.$el.html(this.template());

            // Load the filters
            var filtersTemplate = _.template(FiltersTemplate);
            $("#filters").html(filtersTemplate);

            // Load the areas navigation
            var areasTemplate = _.template(AreasTemplate, userCreds);
            $("#areanav").html(areasTemplate);

            // Create the map
            map = L.map('map', {
                dragging: true
            });

            // Add layer to map
            L.tileLayer('//{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

            // Find the user's location before mapping locations. 
            // Locations are more important and need to be on top.
            map.locate({setView: true, maxZoom: 15});

            // Map the locations
            var url = "/locations";
            this.mapLocations(url);

            function onLocationFound(e) {
                // Set the latlng to be used for other stuff!
                that.userLocation = e.latlng;

                // User current location initially
                that.useCurrentLocation();

                // Set the marker for where the user is
                L.marker(e.latlng, {icon: grayPin}).addTo(map)
                    .bindPopup('You are here').openPopup()
                    .setZIndexOffset(-250)
                    .on('click', that.useCurrentLocation);
            }

            map.on('locationfound', onLocationFound);

            function onLocationError(e) {
                alert(e.message);
            }

            map.on('locationerror', onLocationError);

            function onMapClick(e) {
                // Set the new lat long
                newMarker.setLatLng(e.latlng);

                // Set to gray pin
                newMarker.setIcon(grayPin);

                // Open the popup
                newMarker.addTo(map).openPopup();

                // Store the new coordinates
                that.newLocation.lat = e.latlng.lat;
                that.newLocation.lon = e.latlng.lng;

                // Update the button
                $(".mainbtn").html("<img src='img/add.png' />").attr("id", "addlocbtn");

                // Render the add location form
                that.useMarkedLocation();
            }

            map.on('click', onMapClick);


        },
        events: {
            'submit #addlocation': 'addLocation',
            'click #addlocbtn': 'toggleAddLocPane',
            'click #loclogbtn': 'toggleLogPane',
            'click #mapfiltersbtn': 'toggleMapFiltersPane',
            'click #areanavbtn': 'toggleAreaNavPane',
            'click #listlocbtn': 'toggleLocationList',
            'click #searchlocbtn': 'toggleSearchLocations',
            'click .mapfilter': 'filterMap',
            'change #location-image': 'handleFileSelect',
            'click #usemylocation': 'useCurrentLocation',
            'click .close-pane': 'hidePane',
            'change #filterareaselect': 'goToArea',
            'submit #addarea': 'addArea',
            'click .location': 'goToLocation',
            'submit #searchlocations': 'returnFalse'
        },
        showPane: function(height) {
            $("#main-pane-content").animate({
                "height": height,
                "padding": "0 20px",
                "padding-top": "20px"
            }, {
                "duration": "fast", 
                "queue": false
            }).css("overflow", "auto");
            $(".map-menu-btn").removeClass('close-pane');
        },
        hidePane: function() {
            $("#main-pane-content").animate({
                "height": 0,
                "padding": 0
            }, {
                "duration": "fast", 
                "queue": false
            }).css("overflow", "hidden");
            $(".map-menu-btn").removeClass('close-pane');
        },
        toggleAddLocPane: function(ev) {
            // Hide everything else
            $(".content").hide();

            // Show the add location form
            $("#main").show();

            // Get the height
            var height = (($(window).innerHeight())/2) - 20; // 20 comes from the padding we set in animate()

            this.showPane(height);
            $(".mainbtn").addClass('close-pane');
        },
        toggleLogPane: function(ev) {
            // Hide everything else
            $(".content").hide();

            // Show the main area
            $("#main").show();

            // Info is being loaded from onMarkerClick()

            // Set the height of the pane
            var height = ($(window).height())-($(".info-pane-title").outerHeight()) - 20; // 20 comes from the padding we set in animate()
            this.showPane(height);
            $(".mainbtn").addClass('close-pane');
        },
        toggleMapFiltersPane: function(ev) {
            // Hide everything else
            $(".content").hide();

            // Show the main area
            $("#filters").show();

            // Toggle the pane
            this.showPane("100%");
            $("#mapfiltersbtn").addClass('close-pane');
        },
        toggleAreaNavPane: function(ev) {
            // Hide everything else
            $(".content").hide();

            // Show the areanav area
            $("#areanav").show();

            // Toggle the pane
            this.showPane("100%");
            $("#areanavbtn").addClass('close-pane');

            // Create the areas collection
            var areas = new AreasCollection();

            // Get the areas
            areas.fetch({
                success: function(areas) {
                    // Load the form
                    that.areaFilterForm = new AreaFilterForm({
                        template: _.template(AreaFilterFormTemplate)
                    }).render();

                    var options = [];
                    options.push({val: '',label: 'Select One'});
                    $.each(areas.models, function(index, value) {
                        options.push({
                            val: escape(value.attributes.coordinates), 
                            label: value.attributes._id
                        });
                    });

                    that.areaFilterForm.fields.filterareaselect.editor.setOptions(options);

                    // Render the form
                    $("#jumptoarea").html(that.areaFilterForm.el);
                }
            });

            // Load the area form
            this.newAreaForm = new NewAreaForm({
                template: _.template(AddAreaTemplate),
                model: new AreaModel()
            }).render();

            $("#area-form").html(this.newAreaForm.el);

            this.newAreaForm.on('change', function(newAreaForm) {
                $("#area-form .control-group").removeClass("error").addClass("success");
                $("#area-form input").closest(".control-group").find(".text-error").html("");
                var errors = newAreaForm.commit();
                if(errors) {
                    $.each(errors, function(key, value) {
                        $("[name='" + key + "']").closest(".control-group").removeClass("success").addClass("error");
                        $("[name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                    });
                }
            });
        },
        toggleLocationList: function(ev) {
            // Hide everything else
            $(".content").hide();

            // Show the areanav area
            $("#loclist").show();

            // Toggle the pane
            // Get the height
            var height = ($(window).innerHeight())/2;
            this.showPane(height);

            $("#listlocbtn").addClass('close-pane');

            // Where we'll store the locations that are in view
            var visibleLocations = [],

            // Getting the visible area
            bounds = map.getBounds();

            var string = "<tr><th>Name</th><th>Type</th><th>Population</th><th>Relief Area</th><th>Notes</th></tr>";

            // Check if marker is in bounds
            that.locationsLayer.eachLayer(function(marker) {
                if (bounds.contains(marker.options.latlng)) {
                    string += "<tr class='location' id='" + marker.options._id + "'>";

                    string += "<td>";
                    string += marker.options.name;
                    string += "</td>";

                    string += "<td>";
                    string += marker.options.type;
                    string += "</td>";

                    string += "<td>";
                    string += marker.options.population;
                    string += "</td>";

                    string += "<td>";
                    string += marker.options.area;
                    string += "</td>";

                    string += "<td>";
                    string += marker.options.notes;
                    string += "</td>";

                    string += "</tr>";
                }
            });
            $("#locationslist").html(string);
        },
        toggleSearchLocations: function(ev) {
            // Hide everything else
            $(".content").hide();

            // Show the areanav area
            $("#search").show();

            // Toggle the pane
            // Get the height
            var height = ($(window).innerHeight())/2;
            this.showPane(height);

            $("#searchlocbtn").addClass('close-pane');

            // Load the area form
            this.searchForm = new SearchLocationsForm({
                template: _.template(SearchLocationsTemplate)
            }).render();

            $("#search-form").html(this.searchForm.el);

            this.searchForm.on('change', function(searchForm) {
                var query = $("#query").val();

                var string = "<tr><th>Name</th><th>Type</th><th>Population</th><th>Relief Area</th><th>Notes</th></tr>";

                $.each(that.markers, function(key, marker) {
                    console.log(query);
                    if(marker.options.name.indexOf(query) !== -1) {

                        string += "<tr class='location' id='" + marker.options._id + "'>";

                        string += "<td>";
                        string += marker.options.name;
                        string += "</td>";

                        string += "<td>";
                        string += marker.options.type;
                        string += "</td>";

                        string += "<td>";
                        string += marker.options.population;
                        string += "</td>";

                        string += "<td>";
                        string += marker.options.area;
                        string += "</td>";

                        string += "<td>";
                        string += marker.options.notes;
                        string += "</td>";

                        string += "</tr>";
                    }
                });

                $("#searchresults").html(string);
            });
        },
        addLocation: function(ev) {
            var errors = form.commit();
            var that = this;
            
            if(!errors) {
                this.newLocation = $(ev.currentTarget).serializeForm();
                if(this.newLocationImage) {
                    this.newLocation.image = this.newLocationImage;
                }

                var location = new LocationModel();
                location.save(this.newLocation, {
                    success: function(location) {
                        $("#error").hide();
                        $("#error").removeClass("alert-error").addClass("alert-success").html("Location successfully added!").show();
                        $("input[type='text']").val("");
                        $("textarea").val("");
                        $("input").closest(".control-group").removeClass("success");
                        $("textarea").closest(".control-group").removeClass("success").find(".text-error").html("");
                        $("#main-pane-content").scrollTop(0);

                        that.render();
                    },
                    error: function(model, response) {
                        $("#error").show().html(response.responseText);
                    }
                });
            } else {
                $.each(errors, function(key, value) {
                    $("[name='" + key + "']").closest(".control-group").addClass("error");
                    $("[name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                });
            }
            return false;
        },
        loadLogView: function(location) {
            // Load the logs template
            var logsTemplate = _.template(LogsTemplate);
            $("#main").html(logsTemplate);

            // Load the event log view and pass in the location
            this.eventLogView.location = location;
            this.eventLogView.render();

            // Load the service log view and pass in the location
            this.serviceLogView.location = location;
            this.serviceLogView.render();

            // Can't imagine why it would need to be visible
            this.hidePane();

            // Have to clear the close thing
            $(".map-menu-btn").removeClass('close-pane');

            // Hide everything else
            $(".content").hide();

            // Show logs
            $("#main").show();
        },
        filterMap: function(ev) {
            // Reset the button and form
            $(".mainbtn").html("<img src='img/add.png' />").attr("id", "addlocbtn");
            this.hidePane();
            this.useCurrentLocation();

            var filter = ev.currentTarget.id;

            // Remove all the locations
            map.removeLayer(that.locationsLayer);
            map.removeLayer(that.heatmapLayer);


            if(filter == "all") {
                var url = "/locations";
            } else {
                var url = "/locations/type/" + filter;
            }

            // Map the locations
            this.mapLocations(url);
        },
        goToArea: function(ev) {
            var target = ev.target,
                coordinates = JSON.parse(unescape($(target).val()));
                
            map.panTo(new L.LatLng(coordinates.lat, coordinates.lon));
            map.setZoom(coordinates.zoom);
            
            

            // Hide the pane
            this.hidePane();
        },
        addArea: function(ev) {
            var errors = this.newAreaForm.commit();
            
            if(!errors) {
                // Get the center of the map
                var mapCenter = map.getCenter();

                // Get the map's zoom level
                var mapZoom = map.getZoom();

                // Get the form info
                var newArea = $(ev.currentTarget).serializeForm();

                // Add the coordinates to the object. Have to do our own bit of parsing here
                newArea.coordinates = "{\"lat\":" + mapCenter.lat + ", \"lon\":" + mapCenter.lng + ", \"zoom\":" + mapZoom + "}";

                var area = new AreaModel();

                // Save that ish
                area.save(newArea, {
                    success: function(institution) {
                        // Reset the form
                        $("#area-error").hide();
                        $("#area-error").removeClass("alert-error").addClass("alert-success").html("Area successfully added!").show();
                        $("#area-form input[type='text']").val("");
                        $("#area-form input").closest(".control-group").removeClass("success");
                        $("#area-form textarea").closest(".control-group").removeClass("success").find(".text-error").html("");

                        // Create the areas collection
                        var areas = new AreasCollection();

                        // Get the areas
                        areas.fetch({
                            success: function(areas) {
                                // Load the form
                                that.areaFilterForm = new AreaFilterForm({
                                    template: _.template(AreaFilterFormTemplate)
                                }).render();

                                var options = [];
                                options.push({val: '',label: 'Select One'});
                                $.each(areas.models, function(index, value) {
                                    options.push({
                                        val: escape(value.attributes.coordinates), 
                                        label: value.attributes._id
                                    });
                                });

                                that.areaFilterForm.fields.filterareaselect.editor.setOptions(options);

                                // Render the form
                                $("#jumptoarea").html(that.areaFilterForm.el);
                            }
                        });
                    },
                    error: function(model, response) {
                        $("#area-error").removeClass("alert-success").addClass("alert-error");
                        if(response.status == 409) {
                            $("#area-error").show().html("That area already exists");
                        } else {
                            $("#area-error").show().html(response.responseText);
                        }
                    }
                });
            } else {
                $.each(errors, function(key, value) {
                    $("[name='" + key + "']").closest(".control-group").addClass("error");
                    $("[name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                });
            }
            return false;
        },
        goToLocation: function(ev) {
            var target = ev.target;
            var location = this.locations[$(target).parent().attr('id')];
            var geometry = location.feature.geometry;

            location.openPopup();
            map.panTo(new L.LatLng(geometry.coordinates[1], geometry.coordinates[0]));

            // Hide the pane
            this.hidePane();
        },
        handleFileSelect: function(ev) {
            var file = ev.target.files[0]; // Get the files (We only allow one)
            this.resizeFile(file);
        },
        onEachFeature: function(feature, layer) {
            var geometry = feature.geometry;
            var properties = feature.properties;
            switch(properties.amenity) {
                case "school":
                    layer.setIcon(purpPin);
                    break;
                case "medicine":
                    layer.setIcon(greenPin);
                    break;
                case "camp":
                    layer.setIcon(redPin);
                    break;
                case "water":
                    layer.setIcon(bluePin);
                    break;
            }

            var string = "<table>";
            string += "<tr>";

            string += "<td>";
            string += "Name: " + properties.name + "<br />";
            string += "Type: " + properties.amenity + "<br />";
            string += "Population: " + properties.population;
            string += "</td>";

            if(properties.image) {
                string += "<td>";
                string += "<img class='loc-img' src='" + properties.image + "' width='100' />";
                string += "</td>";
            }

            string += "</tr>";

            string += "<tr>";
            string += "<td colspan='2'>";
            string += "<small class='muted'>";
            string += "Relief Area: " + properties.area + "<br />";
            string += "Lat: " + geometry.coordinates[1] + "&deg;<br />";
            string += "Lon: " + geometry.coordinates[0] + "&deg;";
            string += "</small>";
            string += "</td>";

            string +="</tr>";
            
            string += "</table>";

            layer.bindPopup(string);
            that.locations[properties._id] = layer;

        },
        onMarkerClick: function(e) {
            // Remove that pesky marker
            map.removeLayer(newMarker);

            var properties = e.layer.feature.properties;
            var geometry = e.layer.feature.geometry;

            // Move to the selected marker
            map.panTo([geometry.coordinates[1], geometry.coordinates[0]]);
            
            // Change to the appropriate icon
            $(".mainbtn").html("<img src='img/log.png' />").attr("id", "loclogbtn");
            that.loadLogView(properties);
        },
        useCurrentLocation: function() {
            // Remove that pesky marker
            map.removeLayer(newMarker);

            // Render the add location form
            that.renderAddLocationForm(that.userLocation.lat, that.userLocation.lng, function() {
                // Tell the user you're using their current location
                $("#info").html("<p><i class='icon-globe'></i> Using your current Location.</p>");
            }); 

            // Update the button
            $(".mainbtn").html("<img src='img/add.png' />").attr("id", "addlocbtn");

            // Have to clear the close thing
            $(".map-menu-btn").removeClass('close-pane');

            // Hide everything else
            $(".content").hide();

            // Show location form
            $("#main").show();
        },
        useMarkedLocation: function() {
            // Render the add location form
            that.renderAddLocationForm(that.newLocation.lat, that.newLocation.lon, function() {
                // Tell the user you're using the marked location
                $("#info").html("<p><i class='icon-globe'></i> Using the marked Location. <a id='usemylocation'>Use my current Location.</a></p>");
            });
        },
        renderAddLocationForm: function(lat, lon, callback) {
            // Create the areas collection
            var areas = new AreasCollection();

            areas.fetch({
                success: function(areas) {
                    // Load the form
                    form = new NewLocationForm({
                        template: _.template(AddLocationTemplate),
                        model: new LocationModel()
                    }).render();

                    var options = [];

                    $.each(areas.models, function(index, value) {
                        options[index] = {val: value.attributes._id, label: value.attributes._id}
                    });

                    form.fields.area.editor.setOptions(options);

                    // Render the form
                    $("#main").html(form.el);
                    
                    // Set the fields
                    $("[name='lat']").val(lat);
                    $("[name='lon']").val(lon);

                    // Validate the form on change
                    form.on('change', function(form) {
                        $(".control-group").removeClass("error").addClass("success");
                        $("input").closest(".control-group").find(".text-error").html("");
                        var errors = form.commit();
                        if(errors) {
                            $.each(errors, function(key, value) {
                                $("[name='" + key + "']").closest(".control-group").removeClass("success").addClass("error");
                                $("[name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                            });
                        }
                    });

                    callback();
                }
            });
        },
        mapLocations: function(url) {
            var locations = new LocationsCollection();
            this.heatmapLayer = L.TileLayer.heatMap({
                radius: {value: 20, absolute: false},
                opacity: 0.8,
                gradient: {
                    0.45: "rgb(59, 151, 211)", // also lt blue
                    0.55: "rgb(59, 151, 211)", // lt blue
                    0.65: "rgb(1, 149, 71)", // green
                    0.95: "rgb(240, 196, 25)", // yellow
                    1.00: "rgb(231,76,61)" // red
                }
            });

            locations.fetch({
                url: url,
                success: function(locations) {
                    that.markers = new Array();
                    var heatData = new Array();
                    _.each(locations.models, function(location) {
                        var geometry = location.get('geoJSON').geometry,
                            properties = location.get('geoJSON').properties;

                        heatData.push({
                            lon: geometry.coordinates[0], 
                            lat: geometry.coordinates[1],
                            value: properties.serviceCount
                        });

                        location.get('geoJSON').properties._id = location.get('_id');
                        var marker = L.geoJson(location.get('geoJSON'), {
                            _id: location.get('_id'),
                            name: properties.name,
                            type: properties.amenity,
                            population: properties.population,
                            notes: properties.notes,
                            area: properties.area,
                            latlng: new L.LatLng(geometry.coordinates[1], geometry.coordinates[0]),
                            onEachFeature: that.onEachFeature
                        });

                        marker.on('click', that.onMarkerClick);
                        that.markers.push(marker);
                    });

                    that.locationsLayer = L.layerGroup(that.markers).addTo(map);
                    that.heatmapLayer.setData(heatData);
                    that.heatmapLayer.addTo(map);
                }
            });
        },
        resizeFile: function(file) {
            var reader = new FileReader();
            reader.onloadend = function() {

                var tempImg = new Image();
                tempImg.src = reader.result;
                tempImg.onload = function() {

                    var MAX_WIDTH = 200;
                    var MAX_HEIGHT = 200;
                    var tempW = tempImg.width;
                    var tempH = tempImg.height;

                    if (tempW > tempH) {
                        if (tempW > MAX_WIDTH) {
                            tempH *= MAX_WIDTH / tempW;
                            tempW = MAX_WIDTH;
                        }
                    } else {
                        if (tempH > MAX_HEIGHT) {
                            tempW *= MAX_HEIGHT / tempH;
                            tempH = MAX_HEIGHT;
                        }
                    }

                    var canvas = document.createElement('canvas');
                    canvas.width = tempW;
                    canvas.height = tempH;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0, tempW, tempH);
                    that.newLocationImage = canvas.toDataURL("image/jpeg");
                }

            }
            reader.readAsDataURL(file);
        },
        returnFalse: function(ev) {
            return false;
        }
    });

    return MapView;
});
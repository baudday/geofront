define([
    'jquery',
    'underscore',
    'backbone',
    'models/LocationModel'
], function($, _, Backbone, LocationModel){

    var LocationsCollection = Backbone.Collection.extend({
        model: LocationModel,
        url: '/locations'
    });

    return LocationsCollection;
});
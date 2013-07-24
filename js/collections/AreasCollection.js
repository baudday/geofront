define([
    'jquery',
    'underscore',
    'backbone',
    'models/AreaModel'
], function($, _, Backbone, AreaModel){

    var AreasCollection = Backbone.Collection.extend({
        model: AreaModel,
        url: '/areas'
    });

    return AreasCollection;
});
define([
    'jquery',
    'underscore',
    'backbone',
    'models/ServiceModel'
], function($, _, Backbone, ServiceModel){

    var ServiceLogCollection = Backbone.Collection.extend({
        model: ServiceModel,
        url: '/services'
    });

    return ServiceLogCollection;
});
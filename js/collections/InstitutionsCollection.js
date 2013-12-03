define([
    "jquery",
    "underscore",
    "backbone",
    "models/InstitutionModel"
], function($, _, Backbone, InstitutionModel){

    var InstitutionsCollection = Backbone.Collection.extend({
        model: InstitutionModel,
        url: '/institutions'
    });

    return InstitutionsCollection;
});
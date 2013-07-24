define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var InstitutionModel = Backbone.Model.extend({
        urlRoot: '/institutions'
    });
    
    return InstitutionModel;
});
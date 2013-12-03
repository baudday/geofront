define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone){

    var LogModel = Backbone.Model.extend({
        urlRoot: '/log'
    });
    
    return LogModel;
});
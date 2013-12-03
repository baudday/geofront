define([
    "jquery",
    "underscore",
    "backbone",
    "models/LogModel"
], function($, _, Backbone, LogModel){

    var LogsCollection = Backbone.Collection.extend({
        model: LogModel,
        url: '/log'
    });

    return LogsCollection;
});
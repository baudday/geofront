define([
    "jquery",
    "underscore",
    "backbone",
    "models/LogoutModel"
], function($, _, Backbone, LogoutModel){
    var logoutModel = new LogoutModel();

    var LogoutView = Backbone.View.extend({
        el: '.body',
        render: function() {
            // Log the user out
            logoutModel.fetch({
                success: function() {
                    window.location="";
                }
            }); // This sends a get request to the server, clearing the cookies
        }
    });
    return LogoutView;
});
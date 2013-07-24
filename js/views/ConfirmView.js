define([
    'jquery',
    'underscore',
    'backbone',
    'models/ConfirmModel'
], function($, _, Backbone, ConfirmModel){
    var that;
    var ConfirmView = Backbone.View.extend({
        el: '.body',
        render: function() {
            that = this;
            var key = Backbone.history.fragment.split('/')[1];

            var confirm = new ConfirmModel();

            confirm.fetch({
                url: '/users/confirm/' + key,
                success: function(body) {
                    that.$el.html("<h1>Congratulations!</h1><p>Your account has been verified. Go ahead and <a href='#/SignIn'>Sign In</a>!</p>");
                    setTimeout(function() {
                        Backbone.history.navigate('#/SignIn');
                    }, 5000);
                },
                error: function(model, response) {
                    that.$el.html("<h1>" + response.responseText + "</h1>");
                }
            });
        }
    });
    return ConfirmView;
});
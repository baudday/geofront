define([
    'jquery',
    'underscore',
    'backbone',
    'serializeForm',
    'backboneForms',
    'text!templates/account/AccountTemplate.html'
], function($, _, Backbone, serializeForm, backboneForms, AccountTemplate){

    var AccountView = Backbone.View.extend({
        el: '.body',
        render: function() {
            // Data to pass to the template
            var userCreds = JSON.parse($.cookie('UserInfo'));

            // Load everything
            var accountTemplate = _.template(AccountTemplate, userCreds);
            this.$el.html(accountTemplate);
        }
    });
    return AccountView;
});
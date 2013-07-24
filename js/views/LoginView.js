define([
    'jquery',
    'underscore',
    'backbone',
    'serializeForm',
    'backboneForms',
    'forms/LoginForm',
    'models/LoginModel',
    'text!templates/forms/LoginTemplate.html',
    'text!templates/header.html'
], function($, _, Backbone, serializeForm, backboneForms, LoginForm, LoginModel, LoginTemplate, 
            HeaderTemplate){
    var form;
    var userCreds = new LoginModel();

    var LoginView = Backbone.View.extend({
        el: '.body',
        render: function() {
            form = new LoginForm({
                template: _.template(LoginTemplate),
                model: userCreds
            }).render();

            this.$el.html(form.el);

            form.on('change', function(form) {
                $(".control-group").removeClass("error").addClass("success");
                $("input").closest(".control-group").find(".text-error").html("");
                var errors = form.commit();
                if(errors) {
                    $.each(errors, function(key, value) {
                        $("[name='" + key + "']").closest(".control-group").removeClass("success").addClass("error");
                        $("[name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                    });
                }
            });
        },
        events: {
            'submit .login-user': 'loginUser'
        },
        loginUser: function(ev) {
            var errors = form.commit();
            
            if(!errors ) {
                var loginUser = $(ev.currentTarget).serializeForm();
                userCreds.save(loginUser, {
                    success: function(user) {
                        $("#error").hide();
                        
                        // Update the header
                        var header = _.template(HeaderTemplate);
                        $('.header').html(header);

                        Backbone.history.navigate("#/ReliefAreas");
                    },
                    error: function(model, response) {
                        $("#error").show().html(response.responseText);
                    }
                });
            } else {
                $.each(errors, function(key, value) {
                    $("[name='" + key + "']").closest(".control-group").addClass("error");
                    $("[name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                });
            }
            return false;
        }
    });
    return LoginView;
});
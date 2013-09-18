define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'serializeForm',
    'backboneForms',
    'collections/InstitutionsCollection',
    'forms/NewUserForm',
    'models/UserModel',
    'text!templates/forms/RegisterTemplate.html',
    'text!templates/static/ThankYouTemplate.html',
    'text!templates/static/OfflineTemplate.html'
], function($, _, Backbone, Bootstrap, serializeForm, backboneForms, InstitutionsCollection, NewUserForm, 
            UserModel, RegisterTemplate, ThankYouTemplate, OfflineTemplate) {
    // The form
    var form;
    var that;

    var RegisterView = Backbone.View.extend({
        el: '.body',
        render: function() {
            that = this;
            var institutions = new InstitutionsCollection();

            institutions.fetch({
                success: function(institutions) {

                    form = new NewUserForm({
                        template: _.template(RegisterTemplate),
                        model: new UserModel()
                    }).render();

                    var options = [];

                    $.each(institutions.models, function(index, value) {
                        options[index] = {val: value.attributes._id, label: value.attributes.name}
                    });

                    form.fields.institution.editor.setOptions(options);

                    that.$el.html(form.el);

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
                error: function() {
                    var offlineTemplate = _.template(OfflineTemplate);
                    that.$el.html(offlineTemplate);
                }
            });
        },
        events: {
            'submit .register-user': 'registerUser'
        },
        registerUser: function(ev) {
            var errors = form.commit();
            
            if(!errors) {
                var newUser = $(ev.currentTarget).serializeForm();
                var user = new UserModel();
                user.save(newUser, {
                    success: function(user) {
                        that.$el.html(_.template(ThankYouTemplate, newUser));
                    },
                    error: function(model, response) {
                        $("#error").addClass("alert-error");
                        if(response.status === 409) {
                            $("[name='username']").closest(".control-group").removeClass("success").addClass("error");
                            $("[name='username']").closest(".control-group").find(".text-error").html("<small class='control-group error'>Username already exists</small>");
                        } else if(response.status === 404) {
                            $("[name='email']").closest(".control-group").removeClass("success").addClass("error");
                            $("[name='email']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + response.responseText + "</small>");
                        } else if(response.status === 0) {
                            var offlineTemplate = _.template(OfflineTemplate);
                            that.$el.html(offlineTemplate);
                        } else {
                            $("#error").show().html(response.responseText);
                        }
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

    return RegisterView;
});
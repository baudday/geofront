define([
    'jquery',
    'underscore',
    'backbone',
    'serializeForm',
    'backboneForms',
    'text!templates/services/ServicesTemplate.html',
    'models/ServiceModel',
    'forms/NewServiceForm',
    'text!templates/forms/ServiceFormTemplate.html',
    'collections/AreasCollection',
    'collections/UsersCollection'
], function($, _, Backbone, serializeForm, backboneForms, ServicesTemplate, ServiceModel, 
            NewServiceForm, ServiceFormTemplate, AreasCollection, UsersCollection){

    // The form
    var form;

    // What's gonna be clicked
    var clicked;

    // The model for the form
    var serviceModel = new ServiceModel();

    // Where we'll store the user's credentials
    var userCreds;

    var ServicesView = Backbone.View.extend({
        el: '.body',
        render: function() {
            // Get the user's credentials only on render
            userCreds = JSON.parse($.cookie('UserInfo'));
            
            // Load everything
            var servicesTemplate = _.template(ServicesTemplate);
            this.$el.html(servicesTemplate);

            var serviceFormTemplate = _.template(ServiceFormTemplate);

            // Create the form
            form = new NewServiceForm({
                template: serviceFormTemplate,
                model: serviceModel
            }).render();
        },
        events: {
            'click .cluster': 'loadForm',
            'submit #addservice': 'addService',
            'click .expand-contact': 'showServiceContact'
        },
        loadForm: function(ev) {
            // Save what was clicked
            clicked = $(ev.target).text();

            // Save the scope
            var that = this;

            // Create the areas collection
            var areasCollection = new AreasCollection();

            // Get the areas
            areasCollection.fetch({
                success: function(areas) {
                    var options = [];
                    options.push({val: "", label: "Select One"});

                    // Create the options array
                    $.each(areas.models, function(index, value) {
                        options.push({val: value.attributes._id, label: value.attributes._id});
                    });

                    // Add the options to the area field
                    form.fields.area.editor.setOptions(options);
                }
            });

            // Create the users collection
            var usersCollection = new UsersCollection();

            // Get the users
            usersCollection.fetch({
                url: "/users/institution/" + userCreds.institution,
                success: function(users) {
                    var options = [];
                    options.push({val: "", label: "Select One"});

                    // Create the options array
                    $.each(users.models, function(index, value) {
                        var label = value.attributes.realname + " (" + value.attributes.name + ")";
                        options.push({val: value.attributes._id, label: label});
                    });                    

                    // Add the options to the contact field
                    form.fields.contact.editor.setOptions(options);
                }
            });

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
        addService: function(ev) {
            var errors = form.commit();
            
            if(!errors) {
                var newService = $(ev.currentTarget).serializeForm();
                var services = new ServiceModel();

                newService.cluster = clicked;
                newService.email = userCreds.email;
                newService.phone = userCreds.phone;
                services.save(newService, {
                    success: function(service) {
                        $("#error").hide();
                        $("#error").removeClass("alert-error").addClass("alert-success").html("Service successfully added!").show();
                        $("textarea").val("");
                        $("textarea").closest(".control-group").removeClass("success").find(".text-error").html("");
                        $("select").val("");
                        $("select").closest(".control-group").removeClass("success").find(".text-error").html("");
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
    return ServicesView;
});
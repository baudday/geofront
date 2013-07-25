define([
    'jquery',
    'underscore',
    'backbone',
    'serializeForm',
    'backboneForms',
    'models/ServiceModel',
    'forms/NewServiceForm',
    'text!templates/forms/ServiceFormTemplate.html',
    'collections/UsersCollection',
    'collections/ServiceLogCollection',
    'text!templates/services/ServiceLogTemplate.html'
], function($, _, Backbone, serializeForm, backboneForms, ServiceModel, NewServiceForm, ServiceFormTemplate, 
            UsersCollection, ServiceLogCollection, ServiceLogTemplate) {

    // Where we'll store the user's credentials
    var userCreds;
    var that;

    var ServiceLogView = Backbone.View.extend({
        el: '.body',
        render: function() {
            that = this;

            // Get the user's credentials
            userCreds = JSON.parse($.cookie('UserInfo'));

            var data = this.location;
            data.institution = userCreds.institutionName;

            var serviceFormTemplate = _.template(_.template(ServiceFormTemplate, data));

            // Create the form
            this.serviceform = new NewServiceForm({
                template: serviceFormTemplate,
                model: new ServiceModel()
            }).render();

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
                    that.serviceform.fields.contact.editor.setOptions(options);
                }
            });

            // Render the form
            $("#addservice").html(this.serviceform.el);

            // Build the service log
            this.buildServiceLog("/services/" + this.location._id);

            // Validate the form on change
            this.serviceform.on('change', function(form) {
                $("#addservice .control-group").removeClass("error").addClass("success");
                $("#addservice input").closest(".control-group").find(".text-error").html("");
                var errors = that.serviceform.commit();
                if(errors) {
                    $.each(errors, function(key, value) {
                        $("#addservice [name='" + key + "']").closest(".control-group").removeClass("success").addClass("error");
                        $("#addservice [name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                    });
                }
            });
        },
        events: {
            'submit #addservice': 'addServiceEntry',
            'change #servicesfilter': 'filterServices',
            'change .updateservicestage': 'updateServiceStage',
            'click .expand-contact': 'showServiceContact'
        },
        addServiceEntry: function(ev) {
            var errors = this.serviceform.commit();
            var that = this;
            
            if(!errors) {
                newEntry = $(ev.currentTarget).serializeForm();
                newEntry.loc_id = this.location._id;
                newEntry.user_id = userCreds._id;
                newEntry.realname = userCreds.realname;
                newEntry.institution_name = userCreds.institutionName;
                newEntry.institution_id = userCreds.institution;

                var entry = new ServiceModel();
                entry.save(newEntry, {
                    success: function(location) {
                        $("#error").hide();
                        $("#error").removeClass("alert-error").addClass("alert-success").html("Entry successfully logged!").show();
                        $("textarea").val("");
                        $("textarea").closest(".control-group").removeClass("success").find(".text-error").html("");
                        that.render();
                    },
                    error: function(model, response) {
                        $("#error").show().html(response.responseText);
                    }
                });
            } else {
                $.each(errors, function(key, value) {
                    $("#addservice [name='" + key + "']").closest(".control-group").addClass("error");
                    $("#addservice [name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                });
            }
            return false;
        },
        filterServices: function(ev) {
            var filter = $("#servicesfilter").val();

            if(filter == "All") {
                var url = "/services/" + this.location._id;
            } else {
                var url = "/services/cluster/" + this.location._id + "/" + filter;
            }

            // Build the service log
            this.buildServiceLog(url);
        },
        buildServiceLog: function(url) {
            var serviceLogEntries = new ServiceLogCollection();
            serviceLogEntries.fetch({
                url: url,
                success: function(entries) {
                    var data = {
                        entries: entries,
                        userCreds: userCreds
                    };

                    var log = _.template(ServiceLogTemplate, data);
                    $("#servicestable").html(log);
                }
            });
        },
        updateServiceStage: function(ev) {
            var serviceId = ev.currentTarget.id;
            var service = new ServiceModel();
            service.id = serviceId;
            var stage = $("#" + serviceId).val();

            // if(stage == "Planned") {
            //     $(ev.target).parent().parent().parent().fadeOut('fast')
            // }

            service.save({
                stage: stage,
                success: function() {
                    console.log("success");
                    $("#stage-error").hide();
                    $("#stage-error").removeClass("alert-error").addClass("alert-success").html("Stage successfully updated!").show();
                },
                error: function() {
                    console.log("fail");
                    $("#stage-error").show().removeClass("alert-success").addClass("alert-error").html("Oops! Looks like there was a problem. Please try again.").show();
                }
            });

            $("#" + serviceId + "-stage-error").hide();
            $("#" + serviceId + "-stage-error").removeClass("alert-error").addClass("alert-success").html("Stage successfully updated!").show();
            setTimeout(function() {$("#" + serviceId + "-stage-error").fadeOut('fast')}, 2000);
        },
        showServiceContact: function(ev) {
            var target = ev.target;

            $(target).next(".contact").slideToggle('fast');
            var span = $(target).children('span');
            $(span).text($(span).text() == '+' ? '-' : '+');
        }
    });
    return ServiceLogView;
});
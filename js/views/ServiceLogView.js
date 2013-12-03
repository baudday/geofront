define([
    "config",
    "jquery",
    "underscore",
    "backbone",
    "serializeForm",
    "backboneForms",
    "CouchRest",
    "models/ServiceModel",
    "forms/NewServiceForm",
    "text!../../templates/forms/ServiceFormTemplate.html",
    "collections/UsersCollection",
    "collections/ServiceLogCollection",
    "text!../../templates/services/ServiceLogTemplate.html"
], function(config, $, _, Backbone, serializeForm, backboneForms, CouchRest,
            ServiceModel, NewServiceForm, ServiceFormTemplate, UsersCollection,
            ServiceLogCollection, ServiceLogTemplate) {

    // Where we'll store the user's credentials
    var userCreds;
    var that;

    var ServiceLogView = Backbone.View.extend({
        el: '.body',
        couchRest: new CouchRest({
            couchUrl: config.couchUrl,
            apiUrl: config.baseApiUrl
        }),
        render: function() {
            that = this;

            // Get the user's credentials
            userCreds = JSON.parse($.cookie('UserInfo'));

            this.couchRest.status(function(offline) {
                window.offline = offline;
            });

            var data = this.location;
            data.institution = userCreds.institutionName;

            var serviceFormTemplate = _.template(_.template(ServiceFormTemplate, data));

            // Create the form
            this.serviceform = new NewServiceForm({
                template: serviceFormTemplate,
                model: new ServiceModel()
            }).render();

            // Get the users
            this.couchRest.fetch('inst_users',
                {
                    include_docs: true,
                    local: true
                }, function(err, res) {
                    var options = [];
                    options.push({val: "", label: "Select One"});

                    // Create the options array
                    $.each(res.rows, function(index, value) {
                        var label = value.doc.realname +
                            " (" + value.doc.name + ")";

                        options.push({
                            val: escape(JSON.stringify(value.doc)),
                            label: label
                        });
                    });                    

                    // Add the options to the contact field
                    that.serviceform.fields.contact.editor.setOptions(options);
                });

            // Render the form
            $("#addservice").html(this.serviceform.el);

            // Build the service log
            this.getServices(function(err, services) {
                var data = {
                    services: services,
                    userCreds: userCreds
                };

                var log = _.template(ServiceLogTemplate, data);
                $("#servicestable").html(log);
            });

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
                var tmp = $(ev.currentTarget).serializeForm();
                tmp.contact = JSON.parse(unescape(tmp.contact));
                var newEntry = {
                    cluster: tmp.cluster,
                    institution_id: userCreds.institution,
                    institution_name: userCreds.institutionName,
                    loc_id: this.location._id,
                    area: this.location.area,
                    stage: tmp.stage,
                    description: tmp.description,
                    contact: tmp.contact,
                    confirmed: "false",
                    user_id: userCreds._id,
                    realname: userCreds.realname,
                    date: new Date()
                };

                this.couchRest.save('services', newEntry, function(err, res) {
                    if(err) {
                        $("#service-error").show().html(err.reason);
                        return;
                    }

                    $("#service-error").hide();

                    $("#service-error").removeClass("alert-error")
                        .addClass("alert-success")
                        .html("Entry successfully logged!").show();

                    $("textarea").val("");

                    $("textarea").closest(".control-group")
                        .removeClass("success").find(".text-error").html("");

                    that.render();
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

            this.getServices(function(err, services) {
                if(filter != "All") {
                    services.rows = services.rows.filter(function(service) {
                        return (service.value.cluster == filter || 
                                service.value.cluster == "All")
                    });
                }

                var data = {
                    services: services,
                    userCreds: userCreds
                };

                var log = _.template(ServiceLogTemplate, data);
                $("#servicestable").html(log);
            });
        },
        getServices: function(callback) {
            // Set the query params
            var query = {
                fun: {
                    map: function (doc) {
                        if(doc.loc_id && doc.loc_id === window.loc_id) {
                            emit(doc, doc);
                        }
                    }
                }
            };

            // Set the replication params
            var rep = {
                opts: {
                    filter: function (doc) {
                        if(doc.loc_id) return doc.loc_id === window.loc_id;
                        return false;
                    }
                }
            };

            // Get the event services
            this.couchRest.query('services', query, rep, function(err, res) {
                res.rows.map(function(service) {
                    if(
                       service.value.confirmed == false &&
                       service.value.stage == "Planned"
                      ) {
                        service.value.stage = "Plan Pending";
                    }

                    return service;
                });

                callback(err, res);
            });
        },
        updateServiceStage: function(ev) {
            var serviceId = ev.currentTarget.id;
            var stage = $("#" + serviceId).val();

            this.couchRest.get('services', serviceId, function(err, doc) {
                if(err) {
                    $("#stage-error").show().removeClass("alert-success")
                        .addClass("alert-error")
                        .html("Oops! Looks like there was a problem. Please try again.")
                        .show();
                    return false;
                }

                doc.stage = stage;

                if(stage === 'Planned') {
                    doc.confirmed = false;
                    $(ev.target).parent().html("Plan Pending");
                }

                that.couchRest.save('services', doc, function(err, res) {
                    if(err) {
                        $("#stage-error").show().removeClass("alert-success")
                            .addClass("alert-error")
                            .html("Oops! Looks like there was a problem. Please try again.")
                            .show();
                        return false;
                    }

                    $("#" + serviceId + "-stage-error").hide();
                    $("#" + serviceId + "-stage-error")
                        .removeClass("alert-error").addClass("alert-success")
                        .html("Stage successfully updated!").show();

                    setTimeout(function() {
                        $("#" + serviceId + "-stage-error").fadeOut('fast')
                    }, 2000);
                });
            });
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
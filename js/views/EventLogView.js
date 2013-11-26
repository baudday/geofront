define([
    'config',
    'jquery',
    'underscore',
    'backbone',
    'serializeForm',
    'backboneForms',
    'CouchRest',
    'collections/LogsCollection',
    'forms/NewLogForm',
    'text!templates/forms/AddLogTemplate.html',
    'models/LogModel',
    'text!templates/eventlog/EventLogTemplate.html'
], function (config, $, _, Backbone, serializeForm, backboneForms, CouchRest,
             LogsCollection, NewLogForm, AddLogTemplate, LogModel,
             EventLogTemplate) {

    // Where we'll store the user's credentials
    var userCreds;
    var that;

    var EventLogView = Backbone.View.extend({
        el: '.body',
        couchRest: new CouchRest({
            couchUrl: config.couchUrl,
            apiUrl: config.baseApiUrl
        }),
        render: function () {
            that = this;

            window.loc_id = this.location._id;

            this.couchRest.status(function(offline) {
                window.offline = offline;
            });

            // Get the user's credentials
            userCreds = JSON.parse($.cookie('UserInfo'));

            this.logform = new NewLogForm({
                template: _.template(AddLogTemplate),
                model: new LogModel()
            }).render();

            // Render the form
            $("#addtolog").html(this.logform.el);

            // Build the event log
            this.getLogs(function(err, logs) {
                var log = _.template(EventLogTemplate, logs);
                $("#eventstable").html(log);
            });

            // Validate the form on change
            this.logform.on('change', function (form) {
                $("#addlogentry .control-group").removeClass("error").addClass("success");
                $("#addlogentry input").closest(".control-group").find(".text-error").html("");
                var errors = that.logform.commit();
                if(errors) {
                    $.each(errors, function (key, value) {
                        $("#addlogentry [name='" + key + "']").closest(".control-group").removeClass("success").addClass("error");
                        $("#addlogentry [name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                    });
                }
            });
        },
        events: {
            'submit #addlogentry': 'addLogEntry',
            'change #eventsfilter': 'filterEvents'
        },
        addLogEntry: function (ev) {
            var errors = this.logform.commit();
            var that = this;
            
            if(!errors) {
                var tmp = $(ev.currentTarget).serializeForm();
                var newEntry = {
                    "loc_id": this.location._id,
                    "name": userCreds.realname,
                    "date": new Date(),
                    "message": tmp.message,
                    "cluster": tmp.cluster,
                    "institution": userCreds.institutionName,
                    "area": this.location.area
                };

                this.couchRest.save('logs', newEntry, function(err, res) {
                    if(err) {
                        $("#event-error").show().html(err.reason);
                        return;
                    }

                    $("#event-error").hide();

                    $("#event-error").removeClass("alert-error")
                        .addClass("alert-success")
                        .html("Entry successfully logged!").show();

                    $("textarea").val("");

                    $("textarea").closest(".control-group")
                        .removeClass("success").find(".text-error").html("");

                    that.render();
                });
            } else {
                $.each(errors, function (key, value) {
                    $("#addlogentry [name='" + key + "']").closest(".control-group").addClass("error");
                    $("#addlogentry [name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                });
            }
            return false;
        },
        filterEvents: function (ev) {
            var filter = $("#eventsfilter").val();

            // Build the event log
            this.getLogs(function(err, logs) {
                if(filter == "All") {
                    var log = _.template(EventLogTemplate, logs);
                    $("#eventstable").html(log);
                } else {
                    logs.rows = logs.rows.filter(function(log) {
                        return (log.value.cluster == filter ||
                                log.value.cluster == "All")
                    });

                    var log = _.template(EventLogTemplate, logs)
                }

                $("#eventstable").html(log);
            });
        },
        getLogs: function (callback) {
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

            // Get the event logs
            this.couchRest.query('logs', query, rep, callback);
        }
    });
    return EventLogView;
});
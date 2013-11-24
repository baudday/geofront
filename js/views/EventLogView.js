define([
    'jquery',
    'underscore',
    'backbone',
    'serializeForm',
    'backboneForms',
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
        render: function() {
            that = this;

            // Get the user's credentials
            userCreds = JSON.parse($.cookie('UserInfo'));

            this.logform = new NewLogForm({
                template: _.template(AddLogTemplate),
                model: new LogModel()
            }).render();

            // Render the form
            $("#addtolog").html(this.logform.el);

            // Build the event log
            var url = "/log/" + this.location._id;
            this.buildEventLog(url);

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
                newEntry = $(ev.currentTarget).serializeForm();
                newEntry.loc_id = this.location._id;
                newEntry.institution = userCreds.institutionName;
                var entry = new LogModel();
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
                    $("#addlogentry [name='" + key + "']").closest(".control-group").addClass("error");
                    $("#addlogentry [name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                });
            }
            return false;
        },
        filterEvents: function(ev) {
            var filter = $("#eventsfilter").val();

            if(filter == "All") {
                var url = "/log/" + this.location._id;
            } else {
                var url = "/log/cluster/" + this.location._id + "/" + filter;
            }

            // Build the service log
            this.buildEventLog(url);
        },
        buildEventLog: function(url) {
            var logentries = new LogsCollection();
            logentries.fetch({
                url: url,
                success: function(entries) {
                    var log = _.template(EventLogTemplate, entries);
                    $("#eventstable").html(log);
                }
            });
        }
    });
    return EventLogView;
});
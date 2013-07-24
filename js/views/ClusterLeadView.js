define([
    'jquery',
    'underscore',
    'backbone',
    'serializeForm',
    'backboneForms',
    'text!templates/account/ClusterLeadTemplate.html',
    'collections/ServiceLogCollection',
    'models/ServiceModel'
], function($, _, Backbone, serializeForm, backboneForms, ClusterLeadTemplate, ServiceLogCollection, ServiceModel) {

    var that;
    var ClusterLeadView = Backbone.View.extend({
        el: '.body',
        render: function() {
            that = this;
            // Get the user's credentials
            var userCreds = JSON.parse($.cookie('UserInfo'));

            // Get all unconfirmed services for cluster
            var services = new ServiceLogCollection();

            services.fetch({
                url: "/services/cluster/" + userCreds.cluster,
                success: function(services) {
                    var data = {
                        userCreds: userCreds,
                        services: services.models
                    };

                    // Load the template
                    var clusterLeadTemplate = _.template(ClusterLeadTemplate, data);
                    that.$el.html(clusterLeadTemplate);
                }
            });
        },
        events: {
            'click .confirm-service': 'confirmService'
        },
        confirmService: function(ev) {
            var serviceId = ev.currentTarget.id;
            var service = new ServiceModel();
            service.id = serviceId;

            service.save({
                confirmed: "true",
                stage: "Planned"
            });

            $("#" + serviceId).parent().parent().fadeOut('fast');
        }
    });
    return ClusterLeadView;
});
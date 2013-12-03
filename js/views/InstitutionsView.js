define([
    "jquery",
    "underscore",
    "backbone",
    "bootstrap",
    "collections/InstitutionsCollection",
    "text!../../templates/institutions/InstitutionsTemplate.html",
    "collections/UsersCollection"
], function($, _, Backbone, Bootstrap, InstitutionsCollection, InstitutionsTemplate, UsersCollection){

    var InstitutionsView = Backbone.View.extend({
        el: '.body',
        render: function() {
            var that = this;
            var institutions = new InstitutionsCollection();

            institutions.fetch({
                success: function(institutions) {
                    $.each(institutions.models, function(key, institution) {
                        // Create the users collection
                        var usersCollection = new UsersCollection();
                        // Get the users
                        usersCollection.fetch({
                            url: "/users/institution/" + institution.get('_id'),
                            success: function(users) {
                                $.each(users.models, function(index, user) {
                                    if(
                                        user.get('level') == 'admin' || 
                                        user.get('level') == 'superadmin') {
                                        institution.set('admin', user.attributes);
                                    }

                                    var template = _.template(InstitutionsTemplate, {institutions: institutions.models});
                                    that.$el.html(template);
                                });
                            }
                        });
                    });
                }
            });
        }
    });

    return InstitutionsView;
});
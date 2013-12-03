define([
    "jquery",
    "underscore",
    "backbone",
    "serializeForm",
    "backboneForms",
    "text!../../templates/account/AdminTemplate.html",
    "forms/AddApprovedUserForm",
    "models/ApprovedUserModel",
    "text!../../templates/forms/AddApprovedUserTemplate.html",
    "models/InstitutionModel"
], function($, _, Backbone, serializeForm, backboneForms, AdminTemplate, AddApprovedUserForm,
            ApprovedUserModel, AddApprovedUserTemplate, InstitutionModel){
    var that;
    var AdminView = Backbone.View.extend({
        el: '.body',
        render: function() {
            that = this;
            // Get the user's credentials
            var userCreds = JSON.parse($.cookie('UserInfo'));
            this.data = {};
            this.data.userCreds = userCreds;

            this.getApprovedEmails(function() {
                // Load the template
                var adminTemplate = _.template(AdminTemplate, that.data);
                that.$el.html(adminTemplate);

                // Load the form
                that.approvedUserForm = new AddApprovedUserForm({
                    template: _.template(AddApprovedUserTemplate),
                    model: new ApprovedUserModel()
                }).render();

                $("#approve-user-form").html(that.approvedUserForm.el);

                // Approved User form validation
                that.approvedUserForm.on('change', function(form) {
                    $(".control-group").removeClass("error").addClass("success");
                    $("#addapproveduser :input").closest(".control-group").find(".text-error").html("");
                    var errors = form.commit();
                    if(errors) {
                        $.each(errors, function(key, value) {
                            $("[name='" + key + "']").closest(".control-group").removeClass("success").addClass("error");
                            $("[name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                        });
                    }
                });
            });
        },
        events: {
            'submit #addapproveduser': 'addApprovedUser'
        },
        addApprovedUser: function(ev) {
            var errors = this.approvedUserForm.commit();
            
            if(!errors) {
                this.newApprovedUser = $(ev.currentTarget).serializeForm();

                var contact = new ApprovedUserModel();
                contact.save(this.newApprovedUser, {
                    success: function(contact) {
                        $("#approveduser-error").hide();
                        $("#approveduser-error").removeClass("alert-error")
                                                .addClass("alert-success")
                                                .html($("#addapproveduser [name=email]").val() + " was successfully added!")
                                                .show();
                        $("#addapproveduser :text").val("")
                                                .removeClass("success");
                        $("#addapproveduser :input").closest(".control-group")
                                                .removeClass("success");

                        that.getApprovedEmails(function() {
                            var row = "<tr><td>" + that.newApprovedUser.email + "</td></tr>";
                            $("#approved-users").append(row);
                        });
                    },
                    error: function(model, response) {
                        $("#approveduser-error").hide();
                        $("#approveduser-error").removeClass("alert-success")
                                                .addClass("alert-error");
                        $("#approveduser-error").show().html(response.responseText);
                    }
                });
            } else {
                $.each(errors, function(key, value) {
                    $("[name='" + key + "']").closest(".control-group")
                                             .addClass("error");
                    $("[name='" + key + "']").closest(".control-group")
                                             .find(".text-error")
                                             .html("<small class='control-group error'>" + value.message + "</small>");
                });
            }
            return false;
        },
        getApprovedEmails: function(callback) {
            var institution = new InstitutionModel();
            institution.fetch({
                url: '/institutions/' + this.data.userCreds.institution,
                success: function(institution) {
                    that.data.institution = institution;
                    callback();
                }
            });
        }
    });
    return AdminView;
});
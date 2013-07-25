define([
    'jquery',
    'underscore',
    'backbone',
    'serializeForm',
    'backboneForms',
    'text!templates/account/SuperAdminTemplate.html',
    'models/InstitutionModel',
    'forms/NewInstitutionForm',
    'text!templates/forms/AddInstitutionTemplate.html',
    'models/AreaModel',
    'forms/NewAreaForm',
    'text!templates/forms/AddAreaTemplate.html'
], function($, _, Backbone, serializeForm, backboneForms, SuperAdminTemplate, InstitutionModel, 
            NewInstitutionForm, AddInstitutionTemplate, AreaModel, NewAreaForm, 
            AddAreaTemplate){

    // The institution form
    var institutionForm;

    // The area form
    var areaForm;

    var SuperAdminView = Backbone.View.extend({
        el: '.body',
        render: function() {
            // Get the user's credentials
            var userCreds = JSON.parse($.cookie('UserInfo'));

            if(userCreds.level !== "superadmin") {
                window.location = "";
            }

            // Load the template
            var superadminTemplate = _.template(SuperAdminTemplate, userCreds);
            this.$el.html(superadminTemplate);

            // Load the institution form
            institutionForm = new NewInstitutionForm({
                template: _.template(AddInstitutionTemplate),
                model: new InstitutionModel()
            }).render();

            $("#institution-form").html(institutionForm.el);

            institutionForm.on('change', function(institutionForm) {
                $(".control-group").removeClass("error").addClass("success");
                $("input").closest(".control-group").find(".text-error").html("");
                var errors = institutionForm.commit();
                if(errors) {
                    $.each(errors, function(key, value) {
                        $("[name='" + key + "']").closest(".control-group").removeClass("success").addClass("error");
                        $("[name='" + key + "']").closest(".control-group").find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                    });
                }
            });
        },
        events: {
            'submit #addinst': 'addInstitution'
        },
        addInstitution: function(ev) {
            var errors = institutionForm.commit();
            
            if(!errors) {
                var newInstitution = $(ev.currentTarget).serializeForm();
                var institution = new InstitutionModel();
                institution.save(newInstitution, {
                    success: function(institution) {
                        $("#institution-error").hide();
                        $("#institution-error").removeClass("alert-error").addClass("alert-success").html("Institution successfully added!").show();
                        $("input[type='text']").val("");
                        $("input[type='url']").val("");
                        $("textarea").val("");
                        $("input").closest(".control-group").removeClass("success");
                        $("textarea").closest(".control-group").removeClass("success").find(".text-error").html("");
                    },
                    error: function(model, response) {
                        $("#institution-error").show().html(response.responseText);
                    }
                });
            } else {
                $.each(errors, function(key, value) {
                    $("[name='" + key + "']").closest(".control-group").addClass("error");
                    $("[name='" + key + "']").closest(".control-group".find(".text-error").html("<small class='control-group error'>" + value.message + "</small>");
                });
            }
            return false;
        }
    });
    return SuperAdminView;
});
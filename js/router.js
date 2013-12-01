define([
    'jquery',
    'underscore',
    'backbone',
    'views/HomeView',
    'views/MapView',
    'views/InstitutionsView',
    'views/RegisterView',
    'views/LoginView',
    'views/LogoutView',
    'views/AccountView',
    'views/SuperAdminView',
    'views/ServicesView',
    'views/AboutView',
    'views/ContactView',
    'views/ClusterLeadView',
    'views/AdminView',
    'views/ConfirmView',
    'views/TilesView'
], function($, _, Backbone, HomeView, MapView, InstitutionsView, RegisterView,
            LoginView, LogoutView, AccountView, SuperAdminView, ServicesView,
            AboutView, ContactView, ClusterLeadView, AdminView, ConfirmView,
            TilesView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'About': 'about',
            'Contact': 'contact',
            'Institutions': 'institutions',
            'ReliefAreas': 'map',
            'SignUp': 'register',
            'SignIn': 'login',
            'Logout': 'logout',
            'Account': 'account',
            'SuperAdmin': 'superadmin',
            'Admin': 'admin',
            'ClusterLead': 'clusterlead',
            'Confirm/:code': 'confirm',
            'TilePackages': 'tiles'
        }
    });

    var initialize = function() {
        var router = new Router();

        router.on('route:home', function() {
            var homeView = new HomeView();
            homeView.render();
        });

        router.on('route:about', function() {
            var aboutView = new AboutView();
            aboutView.render();
        });

        router.on('route:contact', function() {
            var contactView = new ContactView();
            contactView.render();
        });

        router.on('route:map', function() {
            if($.cookie('UserInfo')) {
                var mapView = new MapView();
                mapView.render();
            } else {
                router.navigate("#/SignIn", true);
            }
        });

        router.on('route:institutions', function() {
            var institutionsView = new InstitutionsView();
            institutionsView.render();
        });

        router.on('route:register', function() {
            var registerView = new RegisterView();
            registerView.render();
        });

        router.on('route:login', function() {
            if($.cookie('UserInfo')) {
                router.navigate("", true);
            } else {
                var loginView = new LoginView();
                loginView.render();
            }
            
        });

        router.on('route:logout', function() {
            var logoutView = new LogoutView();
            logoutView.render();
        });

        router.on('route:account', function() {
            if($.cookie('UserInfo')) {
                var accountView = new AccountView();
                accountView.render();
            } else {
                router.navigate("#/SignIn", true);
            }
        });

        router.on('route:superadmin', function() {
            if($.cookie('UserInfo')) {
                var superadminView = new SuperAdminView();
                superadminView.render();
            } else {
                router.navigate("#/SignIn", true);
            }
        });

        router.on('route:admin', function() {
            if($.cookie('UserInfo')) {
                var adminView = new AdminView();
                adminView.render();
            } else {
                router.navigate("#/SignIn", true);
            }
        });

        router.on('route:clusterlead', function() {
            if($.cookie('UserInfo')) {
                var clusterLeadView = new ClusterLeadView();
                clusterLeadView.render();
            } else {
                router.navigate("#/SignIn", true);
            }
        });

        router.on('route:confirm', function() {
            var confirmView = new ConfirmView();
            confirmView.render();
        });

        router.on('route:tiles', function() {
            var tilesView = new TilesView();
            tilesView.render();
        });

        Backbone.history.start();
    };
    return { 
        initialize: initialize
    };
});
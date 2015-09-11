// =========== [ configure ] ===========
Router.configure({
    layoutTemplate: 'layout'
});

// =========== [ automatically ] ===========

// =========== [ preinstalled ] ===========
Router.map(function() {
    this.route('about', {
        path: '/about',
        data: {
            title: "About"
        }
    });
});
Router.map(function() {
    this.route('user', {
        path: '/user',
        data: {
            title: "User"
        }
    });
});
Router.map(function() {
    this.route('settings', {
        path: '/settings',
        data: {
            title: "Settings"
        }
    });

});
Router.map(function() {
    this.route('home', {
        path: '/home',
        data: {
            title: "Home"
        }
    });

});

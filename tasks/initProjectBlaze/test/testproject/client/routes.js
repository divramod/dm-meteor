Router.configure({
    layoutTemplate: 'layout'
});
Router.map(function() {
    this.route('about', {
        path: '/about',
        data: {
            title: "About"
        }
    });
    this.route('home', {
        path: '/home',
        data: {
            title: "Home"
        }
    });
    this.route('user', {
        path: '/user',
        data: {
            title: "User"
        }
    });
});

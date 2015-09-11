Template.footer.events({
    'click .ka-header .navbar li a': function(e) {
        var navbar = $('.ka-header .navbar-toggle');
        console.log(navbar);
        if (navbar && typeof(navbar) !== 'undefined') {
            navbar.click();
        }
    }
});

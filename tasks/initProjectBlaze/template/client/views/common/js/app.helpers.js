Template.registerHelper('activeIfTemplateIs', function(template) {
    var currentRoute = Router.current();
    return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
});
Template.registerHelper('getRouteTitle', function() {
    var currentRoute = Router.current();
    var data = currentRoute.data();
    return data.title;
});

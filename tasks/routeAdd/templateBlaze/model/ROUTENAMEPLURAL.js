ROUTENAMEPLURALCAPITALIZE = new Mongo.Collection("ROUTENAMEPLURAL");

ROUTENAMEPLURALCAPITALIZE.allow({
    insert: function(userId, ROUTENAMEPLURAL) {
        return userId && ROUTENAMEPLURAL.owner === userId;
    },
    update: function(userId, ROUTENAMEPLURAL, fields, modifier) {
        return userId && ROUTENAMEPLURAL.owner === userId;
    },
    remove: function(userId, ROUTENAMEPLURAL) {
        return userId && ROUTENAMEPLURAL.owner === userId;
    }
});

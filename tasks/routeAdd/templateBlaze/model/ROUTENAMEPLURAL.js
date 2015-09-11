ROUTENAMEPLURALCAPITALIZE = new Mongo.Collection("ROUTENAMEPLURAL");

ROUTENAMEPLURALCAPITALIZE.allow({
    insert: function(userId, ROUTENAME) {
        return userId && ROUTENAME.owner === userId;
    },
    update: function(userId, ROUTENAME, fields, modifier) {
        return userId && ROUTENAME.owner === userId;
    },
    remove: function(userId, ROUTENAME) {
        return userId && ROUTENAME.owner === userId;
    }
});

// =========== [ PLURAL publis ] ===========
Meteor.publish("PLURAL", function () {
    return PLURAL.find();
});

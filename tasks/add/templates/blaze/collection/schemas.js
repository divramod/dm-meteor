// =========== [ PLURAL default schema ] ===========
PLURALSchema = new SimpleSchema({
  title: {
    type: String,
    optional: false
  }
});

// =========== [ PLURAL default schema i18n ] ===========
Meteor.startup(function() {
  PLURALSchema.i18n("schemas.PLURAL");
  PLURAL.attachSchema(PLURALSchema);
});

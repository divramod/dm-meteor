// =========== [ PLURAL default schema ] ===========
PLURALCSchema = new SimpleSchema({
  title: {
    type: String,
    optional: false
  }
});

// =========== [ PLURAL default schema i18n ] ===========
Meteor.startup(function() {
  PLURALCSchema.i18n("schemas.PLURAL");
  PLURALC.attachSchema(PLURALCSchema);
});

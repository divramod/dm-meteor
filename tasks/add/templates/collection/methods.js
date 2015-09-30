// =========== [ PLURAL methods ] ===========
Meteor.methods({
  PLURALInsert: function(doc) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    doc.owner = Meteor.userId();
    doc.creator = Meteor.userId();
    doc.createdAt = new Date();
    PLURALC.insert(doc);
  },
  PLURALRemove: function(id) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("PLURALRemove not-authorized because not logged in!");
    } else {
      if (Meteor.userId() !== doc.owner) {
        throw new Meteor.Error("PLURALRemove not-authorized because not user not document owner!");
      } else {
        PLURALC.remove(id);
      }
    }
  }
});

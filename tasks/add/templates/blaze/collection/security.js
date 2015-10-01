// =========== [ PLURAL allow ] ===========
PLURAL.allow({
  // =========== [ insert ] ===========
  insert: function(userId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("PLURALInsert not-authorized because not logged in!");
    } else {
      return true;
    }
  },
  // =========== [ update ] ===========
  update: function(userId, doc) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("PLURALUpdate not-authorized because not logged in!");
    } else {
      if (Meteor.userId() !== doc.owner) {
        throw new Meteor.Error("PLURALUpdate not-authorized because not user not document owner!");
      } else {
        return true;
      }
    }
  },
  // =========== [ remove ] ===========
  remove: function(userId, doc) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("PLURALRemove not-authorized because not logged in!");
    } else {
      if (Meteor.userId() !== doc.owner) {
        throw new Meteor.Error("PLURALRemove not-authorized because not user not document owner!");
      } else {
        return true;
      }
    }
  },
  fetch: ['owner']
});

// =========== [ PLURAL deny ] ===========
PLURAL.deny({
  insert: function(userId) {
    return false;
  },
  update: function(userId, doc) {
    return false;
  },
  remove: function(userId, doc) {
    return false;
  },
  fetch: ['locked']
});

// =========== [ PLURAL methods ] ===========
Meteor.methods({
  // =========== [ PLURALInsert ] ===========
  PLURALInsert: function(doc) {
    // common fields
    doc.owner = Meteor.userId();
    doc.creator = Meteor.userId();
    doc.createdAt = new Date();

    PLURAL.insert(doc);
  },
  // =========== [ PLURALUpdate] ===========
  PLURALUpdate: function(id, doc) {
    PLURAL.update(id, doc);
  },
  // =========== [ PLURALRemove ] ===========
  PLURALRemove: function(id) {
    PLURAL.remove(id);
  },
  // =========== [ PLURALFind ] ===========
  PLURALFind: function(search) {
    PLURAL.find(search);
  },
  // =========== [ PLURALFind ] ===========
  PLURALFetch: function(search) {
    PLURAL.fetch(search);
  }
});

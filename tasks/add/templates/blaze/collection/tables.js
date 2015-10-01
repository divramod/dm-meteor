// =========== [ PLURAL TabularTables ] ===========
TabularTables = {};

// =========== [ default ] ===========
TabularTables.PLURAL = new Tabular.Table({
  name: "PLURAL",
  collection: PLURAL,
  columns: [{
    title: "Actions",
    tmpl: Meteor.isClient && Template.rowTemplate,
    tmplContext: function(rowData) {
      return {
        item: rowData,
        column: 'title',
        collection: 'PLURAL'
      }
    }
  }, {
    data: "title",
    title: "Title"
  }]
});

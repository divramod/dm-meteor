// =========== [ PLURAL delte route ] ===========
Router.map(function() {
  this.route('/PLURAL/:_id/delete', function() {
    var entity = PLURAL.findOne({
      _id: this.params._id
    });
    this.title = "routes.PLURAL.delete";
    this.render('PLURALUpdate', {
      data: entity
    });
  });
});

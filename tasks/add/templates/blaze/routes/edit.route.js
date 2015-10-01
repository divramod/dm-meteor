// =========== [ PLURAL edit route ] ===========
Router.map(function() {
  this.route('/PLURAL/:_id/edit', function() {
    var entity = PLURAL.findOne({
      _id: this.params._id
    });
    this.title = "routes.PLURAL.edit";
    this.render('PLURALEdit', {
      data: entity
    });
  });
});

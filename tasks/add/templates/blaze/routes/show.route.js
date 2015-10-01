// =========== [ PLURAL show route ] ===========
Router.map(function() {
  this.route('/PLURAL/:_id/show', function() {
    var entity = PLURAL.findOne({
      _id: this.params._id
    });
    this.title = "routes.PLURAL.show";
    this.render('PLURALShow', {
      data: entity
    });
  });
});

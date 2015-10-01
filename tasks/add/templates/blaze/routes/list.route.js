// =========== [ PLURAL edit route ] ===========
Router.map(function() {
  this.route('PLURAL/list/all', {
    path: '/PLURAL/list/all',
    template: 'PLURALListAll',
    data: {
      title: "routes.PLURAL.list.all"
    }
  });
});

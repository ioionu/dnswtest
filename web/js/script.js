var dnswtest = dnswtest || {};

dnswtest.Accommodation = function(params){
  this.options = {
    apiURL: '/api1/hotels',
    listTarget: '#accommodation',
    productTarget: '#product',
    pageLength: 10,
  };

  //override defaults with whatever was passed in
  jQuery.extend(this.options, params);

  //handlebars templates
  this.templates = {
    listItem: {},
    product: {}
  };

  //list item template
  this.templates.listItem.source = jQuery("#index-template").html();
  this.templates.listItem.template = Handlebars.compile(this.templates.listItem.source);

  //product template
  this.templates.product.source = jQuery("#product-template").html();
  this.templates.product.template = Handlebars.compile(this.templates.product.source);

  //which page are we upto?
  this.page = 0;
  this.data = {};
};

dnswtest.Accommodation.constructor = dnswtest.Accommodation;

dnswtest.Accommodation.prototype.load = function(){
  var _this = this;
  var _page = this.page;
  jQuery.ajax({
    url: this.options.apiURL,
    dataType: 'json',
    data: {page: 1}
  })
  .then(function(data){
    _this.data = data;
  })
  .done(_this.render.bind(_this));
}

dnswtest.Accommodation.prototype.render = function(data){
  var _this = this;
  var data = this.data;
  var element, item, product;
  console.log(data);

  //create list items and append to document
  for(var i = 0; i < data.products.length; i++) {

    item = this.templates.listItem.template(this.data.products[i]);
    item = jQuery(item);
    product = _this.data.products[i];
    jQuery(item).click(product, function(e){
      var product = e.data;
      _this.displayProduct(product);
    });
    element = jQuery(this.options.listTarget).append(item);
  }

};

dnswtest.Accommodation.prototype.displayProduct = function(product){
  console.log("display product", product);
  var productDisplay = this.templates.product.template(product);
  var element = jQuery(this.options.productTarget).html(productDisplay);
};

var accom = new dnswtest.Accommodation();
jQuery(document).ready(function(){
  accom.load();
});

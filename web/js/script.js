var dnswtest = dnswtest || {};

dnswtest.Accommodation = function(params){
  this.options = {
    apiURL: '/api1/hotels',
    listTarget: '#accommodation',
    productTarget: '#product',
    footerTarget: '#footer',
    countTarget: '#count',
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
    data: {page: (this.page+1)}
  })
  .then(function(data){
    if(typeof _this.data.products == 'undefined') {
      _this.data = data;
    } else {
      _this.data.products = _this.data.products.concat(data.products);
    }
  })
  .done(_this.render.bind(_this));
}

dnswtest.Accommodation.prototype.next = function(){
  this.page++;
  this.load();
};

dnswtest.Accommodation.prototype.addNextButton = function(){
  //add a button to load next page
  var $button = jQuery("<button>Load More</button>");
  var _this = this;
  $button.click(function(){
    _this.next();
  });
  jQuery(this.options.footerTarget).append($button);

};

dnswtest.Accommodation.prototype.getProductDataByPage = function(page){
  var istart = page * this.options.pageLength;
  var iend = istart + this.options.pageLength;
  return this.data.products.slice(istart, iend);
};

dnswtest.Accommodation.prototype.render = function(data){
  var _this = this;
  var products = this.getProductDataByPage(this.page);
  var element, item, product;
  console.log(products);

  //create list items and append to document
  for(var i = 0; i < products.length; i++) {
    item = this.templates.listItem.template(products[i]);
    item = jQuery(item);
    product = products[i];
    jQuery(item).click(product, function(e){
      var product = e.data;
      _this.displayProduct(product);
    });
    element = jQuery(this.options.listTarget).append(item);
  }

  //add total products found
  var $count = jQuery("<span>Count:" + this.data.products.length + " of " + this.data.numberOfResults + "</span>");
  jQuery(this.options.countTarget).html($count);

};

dnswtest.Accommodation.prototype.displayProduct = function(product){
  var _this = this;
  var productDisplay = this.templates.product.template(product);
  productDisplay = jQuery(productDisplay);
  productDisplay.click(function(){
    jQuery(_this.options.productTarget).hide();
    jQuery(_this.options.footerTarget).show();
    jQuery(_this.options.listTarget).show();
  });
  var element = jQuery(this.options.productTarget).html(productDisplay);
  jQuery(this.options.listTarget).hide();
  jQuery(this.options.footerTarget).hide();
  jQuery(this.options.productTarget).show();
};

var accom = new dnswtest.Accommodation();
jQuery(document).ready(function(){
  accom.load();
  accom.addNextButton();
});

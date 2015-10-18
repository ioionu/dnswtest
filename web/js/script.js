var dnswtest = dnswtest || {};

dnswtest.Accommodation = function(params){
  this.options = {
    apiURL: '/api1/hotels',
    listTarget: '#accommodation',
    productTarget: '#product',
    nextTarget: '#footer',
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
      console.log("joining", _this.data.products.length, data.products.length);
      _this.data.products = _this.data.products.concat(data.products);
      console.log("joined", _this.data.products, _this.data.products.length);
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
  jQuery(this.options.nextTarget).append($button);
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
    console.log("creating item:", products[i].productName);
    item = this.templates.listItem.template(products[i]);
    item = jQuery(item);
    product = products[i];
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
  accom.addNextButton();
});

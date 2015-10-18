var dnswtest = dnswtest || {};

dnswtest.Accommodation = function(params){
  this.options = {
    apiURL: '/api1/hotels',
    target: '#accommodation'
  };

  //override defaults with whatever was passed in
  jQuery.extend(this.options, params);

  this.data = {};
};

dnswtest.Accommodation.prototype.load = function(){
  var _this = this;

  jQuery.ajax({
    url: this.options.apiURL
  })
  .done(function(data){
    console.log(data);
    jQuery(_this.options.target).append(data);
  });
}

var accom = new dnswtest.Accommodation();
jQuery(document).ready(function(){
  accom.load();
});

var request = require('request');
var fs = require('fs');
var jquery = fs.readFileSync('./node_modules/jquery/dist/jquery.js');
var jsdom = require("jsdom");
var url = require("url");
var express = require('express');
var open = require('open');
var _ = require('underscore');
var schedule = require('node-schedule');

var app = express();

app.set('view engine', 'jade')
app.set('title', 'pizza huh')
app.use(express.static('public'))

var pizzas = [];



var opts  = {
	url: 'http://pizzasushiwok.ru/menu.php?cat=1'
};

var takePizza = function(cb){
	request(opts, function(error, response, body){
		jsdom.env({
	        html: body,
	        src: [jquery],
	        done: function(err, window){
	        	$ = window.$
	        	$('.menu-positions-li').each(function(i, e){
	        		var pe = $(e);
	        		var pef = function(selector){return pe.find(selector)};
	        		var peft = function(selector){return pe.find(selector).text().trim()};
	        		var ppd = function(string){
	        			// string is smth like 28T - 230 руб. - 550 гр.
	        			var cutstr = function(str){
	        				return str.slice(str.indexOf('-')+1, str.length).trim();
	        			};
	        			var fval = function(str){
	        				return str.slice(0, str.indexOf('-')).trim();
	        			};
	        			var size = fval(string);
	        			size = parseInt(size);
	        			var isSlim = false;
	        			if (size[size.length-1] == 'T'){
	        				size = size.slice(0, size.length-1);
	        				isSlim = true;
	        			}
	        			string = cutstr(string);
	        			var price = fval(string);
	        			price = price.slice(0, price.indexOf('руб')-1);
	        			price = parseInt(price);
	        			string = cutstr(string);
	        			var weight = string.trim();
	        			weight = weight.slice(0, weight.indexOf('гр')-1);
	        			weight = parseInt(weight);
	        			var obj = {
	        				isSlim: isSlim,
	        				size: size,
	        				weight: weight,
	        				price: price,
	        				rubmg: price/weight  
	        			};
	        			return obj;

	        		};
	        		var pizza = {};
	        		pizza.name  = peft('.title-position-menu');
	        		pizza.img = url.resolve(opts.url, pef('.image-position-menu img').attr('src'));
	        		pizza.ingredients = pef('.image-position-menu img').attr('alt').slice(pizza.name.length+1);
	        		pizza.info = pef('[class*=Adds]').text().trim();
	        		pizza.isHot = pef('img[src="/images/hot.png"]').length?true:false;
	    			pizza.data = [];
	    			pef('.diam input').each(function(index, el) {
	    				var data = $(el).attr('title');
	    				data = ppd(data);
	    				pizza.data.push(data);
	    			});
	    			pizza.data = _.sortBy(pizza.data, function(price){
	    				return price.rubmg
	    			});
	        		
	        		pizzas.push(pizza);
	        	});
				pizzas = _.sortBy(pizzas, function(pizza){
					var sizes = pizza.data;
					return pizza.data[0].rubmg
				});
				fs.writeFileSync('public/pizzas.json', JSON.stringify(pizzas), {encoding: 'utf8'});
			}
		});
	});
};

var getFilters = function(){
	var filters = {
		sizes: []
	};
	var pizzas = JSON.parse(fs.readFileSync('public/pizzas.json'));
	for (var i = 0; i < pizzas.length; i++) {
		for (var j = 0; j < pizzas[i].data.length; j++) {
			filters.sizes.push(pizzas[i].data[j].size)
		};
	};
	filters.sizes = _.uniq(filters.sizes);
	filters.sizes = _.sortBy(filters.sizes, function(size){return size;});
	fs.writeFileSync('public/filters.json', JSON.stringify(filters), {encoding: 'utf8'});
};

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var createIngsList = function() {
	var ingsArr = [];
	var pizzas = JSON.parse(fs.readFileSync('public/pizzas.json'));
	pizzas.forEach(function(pizza){
		pizza.ingredients.split(',').forEach(function(ing){
			ingsArr.push(ing.trim());
		})
	});
	ingsArr = _.uniq(ings);
	var ings = {};
	ingsArr.forEach(function(ing){
		var id = ing.hashCode
		// ings[ing
	})
	fs.writeFileSync('public/ings.json', JSON.stringify(ings), {encoding: 'utf8'});
}

// createIngsList();

app.get('/', function(req, res){
	res.render('results');	
});

var cronlike = schedule.scheduleJob('20 4 * * *', function(){
	console.log('takin sum data yea');
	takePizza();
	getFilters();
});

var port = OPENSHIFT_NODEJS_PORT || 20666;

var server = app.listen(port, function(){
  var host = server.address().address
  var port = server.address().port
  console.log('pizza huh app listening at http://%s:%s', host, port)
});

pizzas.forEach(function(pizza){pizza.ingredients.split(',').forEach(function(ing){ings.push(ing.trim())})})
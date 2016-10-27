var messages = []


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var colors_life = 0
var list_of_colors = []
function getRandomColorFromList() {
  colors_life = colors_life + 1 
  if(colors_life == 0 || colors_life == 1 || colors_life == 2 || colors_life == 3 || colors_life == 4 || colors_life%40 == 0){
    list_of_colors.push(getRandomColor())
    if(colors_life%40 == 0){
      list_of_colors.shift()
    }
  }
  return list_of_colors[getRandomInt(0, list_of_colors.length - 1)];
}

function drawConnection(origin, destination, color, drawing_svg, cb) {
  var bezierLine = d3.svg.line()
    .x(function (d) {
      return d[0]//projection(d)[0];
    })
    .y(function (d) {
      return d[1]//projection(d)[1];
    })
    .interpolate("basis");

  var trayectory = [origin, [parseFloat(origin[0] + (destination[0] - origin[0]) / 2), parseFloat(origin[1] + (destination[1] - origin[1]) / 2) + 3], destination]

  var stroke_width = 1
  var tweenfunction = function () {
    var len = 500
    return function (t) {
      return (d3.interpolateString("0,0,0," + len, "0,0," + len + ",0"))(t)
    };
  }

  var tweenfunction2 = function () {
    var len = 500
    return function (t) {
      return (d3.interpolateString("0,0," + len + ",0", "0," + len + ",0,0"))(t)
    };
  }


  var duration = 200
  //var drawing_svg_element = d3.select(drawing_svg)
  drawing_svg.append('path')
    .attr("d", bezierLine(trayectory))
    .attr("stroke", color)
    .attr("stroke-width", stroke_width)
    .attr("fill", "none")
    .attr("stroke-dasharray", "0,1")
    .transition()
    .duration(duration / 2)
    .attrTween("stroke-dasharray", tweenfunction)
    .transition()
    .duration(duration / 2)
    .attrTween("stroke-dasharray", tweenfunction2)
    .remove()
    .each("end", function(){
      if(cb) cb();
    });

}

var requests_count = 0 
var WikipediaBandwidth = function () {
  console.log(window.innerWidth)
  var self = this
  self.last_request_count = 0

  this.get_x = function () {
    return window.innerWidth / 2 - 1
  }
  this.get_y = function () {
    return 30
  }
  this.get_fill_color = function () {
    return self.color
  }
  this.get_stroke_color = function () {
    return self.color
  }
  this.color = '#1566e6'
  this.color = 'grey'
  this.rx = 62

  this.ry = 22
  this.get_ry = function(){
    return self.ry
  }
  this.get_rx = function(){
    if(self.last_request_count == requests_count){
      requests_count --
    }
    self.last_request_count = requests_count
    if(requests_count < 0){
      requests_count = 0
    }
    if(requests_count > 100){
      requests_count = 100
    }

    return self.rx + requests_count
  }
}

var Wikipedia = function (x, y) {
  console.log(window.innerWidth)
  var self = this

  this.get_x = function () {
    return window.innerWidth / 2
  }
  this.get_y = function () {
    return 30
  }
  this.get_fill_color = function () {
    return self.color
  }
  this.get_stroke_color = function () {
    return self.color
  }
  this.get_ry = function(){
    return self.ry
  }
  this.get_rx = function(){
    return self.rx
  }
  this.color = 'white'
  this.rx = 60
  this.ry = 20
}

function drawLine(origin, destination, color, width){
  var c=document.getElementById("wikicanvas2");
  var ctx=c.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(origin[0], origin[1]);
  ctx.lineTo(destination[0], destination[1]);
  if(width){
    ctx.lineWidth = width;
  } else {
    ctx.lineWidth = 2
  }
  ctx.strokeStyle = color
  ctx.stroke();
}


var Client = function (drawing_element) {
  var self = this
  var x_min = window.innerWidth / 2 - window.innerWidth / 5
  var x_max = window.innerWidth / 2 + window.innerWidth / 5
  self.has_wikipediap2p = getRandomInt(0, 4) > -1 ? true : false
  this.life = 0
  this.x_acc = 0.04
  this.y_acc = -0.01
  this.x_speed = 4
  this.y_speed = 2
  this.x = 0 // window.innerWidth / 2 - window.innerWidth / 5 //getRandomInt(x_min, x_max)
  this.y = getRandomInt(50, 70)
  this.get_rx = function(){
    return self.rx
  }
  this.get_ry = function(){
    return self.ry
  }
  this.get_x = function () {
    return self.x
  }
  this.get_y = function () {
    return self.y
  }
  this.get_fill_color = function () {
    if (!this.received_it) {
      return 'white'
    } else {
      return self.color
    }
  }
  this.get_stroke_color = function () {
    if (!this.received_it) {
      return self.color
    } else {
      return 'white'
    }
  }

  this.he_received_it = function(){
    self.received_it = true
    self.y_speed = - 1.25 + Math.random()*2 //*(getRandomInt(0,2) - 1) 
    // console.log(self.y_speed)
    if(self.has_wikipediap2p){
      self.x_acc = - 0.1
    }
  }

  this.second_turn = false

  this.move = function () {
    // console.log(window.innerWidth/2)
    self.life ++
    self.x_speed = self.x_speed + self.x_acc
    self.y_speed = self.y_speed + self.y_acc
    if(self.x > (window.innerWidth / 2) ){
      self.second_turn = true
    }

    self.x = self.x + self.x_speed //  * (self.x - window.innerWidth / 2 )
    self.y = self.y + self.y_speed //  * (self.x - window.innerWidth / 2 )
    
    if(self.x > window.innerWidth / 2 && !self.received_it){
      self.he_received_it()
    }
  }
  
  this.draw_connections = function(){
    var self = this

    var life_diff = 30

    for( var i = 0 ; i < elements.length ; i++ ) {
      if(element[i].color == self.color && element[i].received_it && self.received_it && Math.abs(self.life-elements[i].life) < life_diff ){
        self.got_it_from = elements[i]
        drawLine([elements[i].get_x(), elements[i].get_y()], [self.get_x(), self.get_y()], self.color)
      }
    }

  }

  this.radius = 5
  this.color = getRandomColorFromList()
  this.received_it = false
  this.requested = false
  this.draw_count = 0
  
  this.received_it_from = false
  this.served = 0

  this.draw_request_to_peer = function () {
    var self = this
    if(!this.received_it_from && !this.received_it){

      elements.reverse()
      var ready_array = elements.filter(function(each){
          return each.received_it && each.x < (window.innerWidth / 2) && each.second_turn && each.color == self.color && each.served < 1
      })

      elements.reverse()
      self.received_it_from = ready_array.shift()
      if(self.received_it_from){
        self.received_it_from.served =  self.received_it_from.served + 1
        self.he_received_it()
      }

    } else {
      if(self.received_it_from){
        drawLine([self.received_it_from.get_x(), self.received_it_from.get_y()], [self.get_x(), self.get_y()], self.color)
      }
    }
    
  }
  // this.rx = 5
  // this.ry = 5

}

var wikipedia_bandwidth = new WikipediaBandwidth()
var wikipedia_circle = new Wikipedia()
var elements = []

window.raf = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(a){ window.setTimeout(a,1E3/60); };

function Simulation(opts) {

  var self = this
  self.p2p_enabled = false
  self.drawing_element = opts.drawing_element
  self.max_rows = opts && opts.max_rows ? opts.max_rows : '8';
  self.ready = false;
  elements = []
  self.paths = d3.select(self.drawing_element).append('g')
  var static_parts = d3.select(self.drawing_element).append('g')
  var drawingsvg = d3.select(self.drawing_element).append('g')
  
  var canvas = document.getElementById('wikicanvas');
  var context = canvas.getContext('2d');

  var radius = 70;

  self.draw_all = function(){
    var canvas = document.getElementById('wikicanvas');
    var context = canvas.getContext('2d');
    context.clearRect(0,0, canvas.width, canvas.height)

    var canvas2 = document.getElementById('wikicanvas2');
    var context2 = canvas2.getContext('2d');
    context2.clearRect(0,0, canvas2.width, canvas2.height)

    if(all_elements[1]){
      clients = all_elements[1]
      for(var a = 0; a < clients.length ; a ++){
        var client = clients[a]
        drawCircle(client.get_x(), client.get_y(), 3, client.get_stroke_color(), client.get_fill_color(), 1)
        client.move()
        client.draw_connections()
        // client.draw_request_to_peer()
      }
    }

    window.raf(self.draw_all);  
  }

  function init_canvas(){
    var canvas = document.getElementById('wikicanvas');
    canvas.width = window.innerWidth;
    canvas.height = 300;
    var canvas2 = document.getElementById('wikicanvas2');
    canvas2.width = window.innerWidth;
    canvas2.height = 300;

    window.raf(self.draw_all);
  }

  var drawCircle = function(x, y, radius, fill_color, stroke_color, stroke_size){
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = fill_color;
    context.fill();
    context.lineWidth = stroke_size;
    context.strokeStyle = stroke_color;
    context.stroke();
  }

  init_canvas()



  var layers = [static_parts, drawingsvg]
  var all_elements = [[wikipedia_bandwidth, wikipedia_circle], elements]
  // elements.push(wikipedia_circle)

  return {
    are_peers_active: function(){
      return self.p2p_enabled
    },
    toggle_p2p: function(){
      self.p2p_enabled = !self.p2p_enabled
    },
    add_client: function () {
      self.element = elements
      self.elements.push(new Client())
      if (self.elements.length > 60) {
        self.elements.splice(1, 1)
      }
      this.show()
    },
    show: function (message) {
      console.log('what!')
    }
  }
}



document.Simulation = Simulation
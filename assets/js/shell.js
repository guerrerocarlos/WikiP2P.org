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
  if(colors_life == 0 || colors_life == 1 || colors_life == 2 || colors_life == 3 || colors_life == 4 || colors_life%20 == 0){
    list_of_colors.push(getRandomColor())
    if(colors_life%20 == 0){
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

var Client = function (drawing_element) {
  var self = this
  var x_min = window.innerWidth / 2 - window.innerWidth / 3
  var x_max = window.innerWidth / 2 - window.innerWidth / 5
  this.x = 0 // window.innerWidth / 2 - window.innerWidth / 5 //getRandomInt(x_min, x_max)
  this.y = getRandomInt(100, 180)
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
      return 'self.color'
    }
  }
  this.move = function () {
    self.x = self.x + 30
  }
  this.radius = 5
  this.color = getRandomColorFromList()
  this.received_it = false
  this.requested = false
  this.draw_count = 0
  this.draw_request = function () {
    this.draw_count = this.draw_count + 1
    console.log(window.innerWidth)
    if (!self.requested && this.draw_count > (window.innerWidth/100)) {
      requests_count ++
      drawConnection([wikipedia_circle.get_x(), wikipedia_circle.get_y()], [self.get_x(), self.get_y()], self.color, drawing_element, function () {
        // drawConnection([wikipedia_circle.get_x(), wikipedia_circle.get_y()], [self.get_x(), self.get_y()], self.color, drawing_element)
        // self.received_it = true
      })
      self.received_it = true

      self.requested = true
    }
  }
  this.draw_request_to_peer = function () {
    var self = this
    elements.reverse()
    var resume_array = elements.map(function(value, index, array){
      return value.color+value.requested
    })
    elements.reverse()
    
    // console.log('resume_array', resume_array)
    var i = elements.length - resume_array.indexOf(self.color+'true') - 1


    if (!self.requested && this.draw_count > (window.innerWidth/200) && i > -1 && i < elements.length) {
      if(i != elements.length){
        drawConnection([elements[i].get_x(), elements[i].get_y()], [self.get_x(), self.get_y()], self.color, drawing_element)
        self.received_it = true
        self.requested = true
      }
    }
  }
  this.rx = 5
  this.ry = 5

}

var wikipedia_bandwidth = new WikipediaBandwidth()
var wikipedia_circle = new Wikipedia()
var elements = []

function Simulation(opts) {
  var self = this
  self.p2p_enabled = false
  self.drawing_element = opts.drawing_element
  self.max_rows = opts && opts.max_rows ? opts.max_rows : '8';
  self.ready = true;
  elements = []
  self.paths = d3.select(self.drawing_element).append('g')
  var static_parts = d3.select(self.drawing_element).append('g')
  var drawingsvg = d3.select(self.drawing_element).append('g')
  
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
      self.elements.push(new Client(self.paths))
      if (self.elements.length > 60) {
        self.elements.splice(1, 1)
      }
      this.show()
    },
    show: function (message) {

      self.element = elements
      for (var i = 0; i < self.elements.length; i++) {
        if (self.elements[i].move) {
          self.elements[i].move()
        }
      }


      var texts = []

      if (self.ready) {
        for(var i = 0 ; i < 2 ; i ++){
          var circlesContainer = layers[i].selectAll('ellipse').data(all_elements[i], function (d, i) {
            return ' ' + d.get_x() + d.get_y()
          })

          var circles = circlesContainer.enter()
            .append('ellipse')
            .attr("cx", function (d) { return 0; })
            .attr("cy", function (d) { return d.get_y(); })
            // .attr("r", function (d) { return d.radius; })
            .attr("rx", function (d) { return d.get_rx(); })
            .attr("ry", function (d) { return d.get_ry(); })
            .style("fill", function (d) { return d.get_fill_color(); })
            .attr("stroke-width", 2)
            .attr("stroke", function (d) { return d.get_stroke_color(); })

          var circlesAttributes = circlesContainer.transition()
            .duration(100)
          
            .attr("cx", function (d) { return d.get_x(); })
            .attr("cy", function (d) { return d.get_y(); })
            // .attr("r", function (d) { return d.radius; })
            .attr("rx", function (d) { return d.get_rx(); })
            .attr("ry", function (d) { return d.get_ry(); })
            .style("fill", function (d) { return d.get_fill_color(); })
            .attr("stroke-width", 2)
            .attr("stroke", function (d) { return d.get_stroke_color(); })
            .each('end', function (e) {
              if (e.draw_request) {
                if(self.p2p_enabled){
                  e.draw_request_to_peer()
                }
                e.draw_request()
              }
            })

          circlesContainer.exit()
            .remove()
            .transition()
            .attr("cx", 1000)

        }

        var left_margin = window_width / 2

        var left_messages = [{text: 'wikipedia.org', get_x: function() { return (window.innerWidth / 2 - 39) }, get_y: function(){ return 33}},
                             {text: 'Wikipedia Users:', get_x: function() { return 20 }, get_y: function(){ return 75}}]

          var window_width = window.innerWidth
          var logsvg = d3.select(self.drawing_element)

          var titles = logsvg.selectAll('text.title').data(left_messages)

          titles.enter()
            .append('text')
            .attr('fill', 'white')
            .attr('class', 'title')
            .attr('font-family', 'Times New Roman')
            .attr('font-size', '13px')
            .attr('x', function (d, i) {
              return d.get_x();
            })
            .attr('y', function (d, i) {
              return d.get_y();
            })
            .text(function (d, i) {
              return d.text
            })
            .transition()
            .attr('y', function (d, i) {
              return 20 + i * 15;
            })
            .attr('font-family', 'Cuprum')
            .attr('fill', function (d, i) {
              if (d.color) {
                return d.color
              } else {
                return 'black';
              }
            })
          titles
            .transition()
            .delay(function (d, i) {
              return i * 100;
            })
            .attr('y', function (d, i) {
              return d.get_y();
            })
            .attr('x', function (d, i) {
              return d.get_x();
            })
            .attr('font-family', 'Open sans')
            
            .attr('fill', function (d, i) {
              if (d.color) {
                return d.color
              } else {
                return 'black';
              }
            })


      }
    }
  }
}
document.Simulation = Simulation
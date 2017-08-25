var System = function(config) {
  this.variables = config.variables;
  this.constants = config.constants;
  this.start = config.start;
  this.rules = config.rules;
  this.current = this.start;
  this.angle = config.angle * Math.PI / 180;
  this.dist = config.dist || 20;
  this.stack = [];
  this.max_iterations = config.max_iterations;
  this.i = 0;
  this.start_x = config.start_x !== undefined ? config.start_x : width / 2;
  this.start_y = config.start_y !== undefined ? config.start_y : height / 2;
};

System.prototype.iterate = function() {
  if (this.i >= this.max_iterations) {
    return;
  }
  var next = '';
  for (var i = 0; i < this.current.length; i++) {
    var c = this.current.charAt(i);
    if (this.constants.includes(c)) {
      continue;
    }
    var rule = this.rules[c];
    next += rule;
  }
  this.current = next;
};

System.prototype.draw = function()  {
  this.i++;
  if (this.i >= this.max_iterations) {
    return;
  }

  this.state = {x: this.start_x, y: this.start_y, a: 0, stroke: '#000'};
  var translations = {
    'P': function() {
      var new_x = this.state.x + Math.cos(this.state.a)*this.dist;
      var new_y = this.state.y + Math.sin(this.state.a)*this.dist;
      stroke(this.state.stroke);
      line(this.state.x, this.state.y, new_x, new_y);
      this.state.x = new_x;
      this.state.y = new_y;
    }.bind(this),
    'R': function() {
      this.state.stroke = '#f00';
    }.bind(this),
    'E': function() {
      this.state.stroke = '#0f0';
    }.bind(this),
    'B': function() {
      this.state.stroke = '#00f';
    }.bind(this),
    '+': function() {
      this.state.a += this.angle;
    }.bind(this),
    '-': function() {
      this.state.a -= this.angle;
    }.bind(this),
    '[': function() {
      this.stack.push(this.state)
    }.bind(this),
    ']': function() {
      this.state = this.stack.pop();
    }.bind(this)
  }
  translations['Q'] = translations['P'];
  
  var commands = this.current.split('');
  for (var i=0; i<commands.length; i++) {
    var func = translations[commands[i]];
    if (func) {
      func();
    }
  }
}

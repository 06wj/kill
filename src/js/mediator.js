var config = require('./config');

var mediator = Hilo.copy({}, Hilo.EventMixin);

config.window('mediator', mediator);
module.exports = mediator;
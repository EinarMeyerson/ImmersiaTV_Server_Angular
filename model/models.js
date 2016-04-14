var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
   // mongoose.connect('mongodb://localhost:27017/ImmersiaTV');

    wagner.factory('db', function() {
        return mongoose;
    });

    var Video =
        mongoose.model('Video', require('./video.model'), 'videolistcollection');


    var models = {
        Video: Video
    };

    // To ensure DRY-ness, register factories in a loop
    _.each(models, function(value, key) {
        wagner.factory(key, function() {
            return value;
        });
    });

    return models;
};

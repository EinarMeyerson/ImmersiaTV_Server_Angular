var mongoose = require('mongoose');

var videoSchema = {
    _id: {type: String },
    Name: {type:String },
    Type: {type: String},
    Size: {type: String}
};

module.exports = new mongoose.Schema(videoSchema);
module.exports.categorySchema = videoSchema;

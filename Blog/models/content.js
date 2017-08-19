

var mongoose = require("mongoose");
var contentSchemas = require("../schemas/content");
//将Schema变成模型（Model），这样你就可以操作Model对象了
module .exports = mongoose.model("Content",contentSchemas)
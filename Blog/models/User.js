
var mongoose = require("mongoose");
var userSchemas = require("../schemas/users");
//将Schema变成模型（Model），这样你就可以操作Model对象了
module .exports = mongoose.model("UserInfo",userSchemas)
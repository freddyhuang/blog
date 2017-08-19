var mongoose = require('mongoose');
//创建Schema，就是相当于创建表的结构，跟关系型的一样//数据表字段
var UserSchema = new  mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
})

module .exports =  UserSchema
var mongoose = require('mongoose');
//创建Schema，就是相当于创建表的结构，跟关系型的一样//数据表字段
var  contentSchema = new  mongoose.Schema({
    //关联字段(关联表)---内容分类的ID
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'categories'
    },
    //关联字段---内容分类的ID
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'UserInfo'
    },
    title:String,//标题

    description:{//简介
        type:String,
        default:''
    },
    content:{//简介
        type:String,
        default:''
    },
    //添加时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }
})

module .exports =  contentSchema

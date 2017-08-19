var express = require('express');
var routers = express.Router();
var User = require('../models/User');//用户模型
var category = require('../models/categories');//分类模型
var contents = require('../models/content');//文章内容模型
var data;
/*通用数据的处理*/
routers.use(function(req,res,next){
    data={
        USERINFO: null,
        categories:[]
    }
    req.userInfo = {};
    // 如果请求中的 cookie 存在 userInfo, 则输出 cookie
    if (req.cookies.userInfo) {
        console.log(req.cookies);
        try{
            req.userInfo = req.cookies.userInfo;
            //是否是管理员
            User.findById(req.userInfo.id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                //console.log("001",req.userInfo.isAdmin)
                global.a =Boolean(userInfo.isAdmin);
                global.userName = userInfo.username;
                global.id = userInfo.id
            })
        }catch(e){

        }
        //res.send("再次欢迎访问");
        data.USERINFO= req.userInfo;
    } else {
        //res.send("欢迎第一次访问");
    }
    data.USERINFO= req.userInfo;
    console.log('查询了cookie信息')
    //读取所有的分类信息
    category.find().then(function(rs){
        data.categories = rs;
    })
    next();
})

//页面入口首页
routers.get('/',function(req,res,next){
    data.content = null;
    data.count = 0;
    data.page=Number( req.query.page||1);
    data.category=req.query.category||'';//通过get传递分类的ID
    data.limit=5;
    data.pages=0;
    var where ={};
    if(data.category){
        where.category = data.category;
    }
        contents.where(where).count().then(function(count){
        data.count = count;
        data.pages = Math.ceil(count/data.limit);//计算总页数

        data.page = Math.min(data.page,data.pages);//取值不能超过pages

        data.page = Math.max(data.page,1);//取值不能小于1；
        var skip = (data.page-1)*data.limit;//(当前页-1)*限制条数;
        return  contents.where(where).find().sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user']);
    }).then(function(content){
        data.content = content;
        //console.log(data)
        res.render('main/index',data)
    })
})
/*读取某一遍文章的内容*/
routers.get("/view",function(req,res){
    var contentid = req.query.contentid ||"";
    contents.findOne({
        _id:contentid
    }).populate(['category','user']).then(function(content){
        data.content = content;
        content.views++;
        content.save();
        console.log(data)
        res.render("main/view",data);
    })
})
module.exports = routers;
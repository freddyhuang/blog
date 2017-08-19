var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/User');
var contents = require('../models/content');//文章内容模型
var routers = express.Router();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//统一返回对象
var responseData;
routers.use(function(req,res,next){
    responseData ={
        code:0,
        message:""
    }
    next();
})

/*增加用户注册路由*/
routers.post('/user/register',urlencodedParser,function(req,res,next){
   // console.log(req.body)
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if(username==""){
        responseData.code = 1;
        responseData.message="用户名不能为空";
        res.json(responseData);
        return;
    }
    if(password==""){
        responseData.code = 2;
        responseData.message = "密码不能为空";
        res.json(responseData);
        return;
    }
    if(password!=repassword){
        responseData.code = 3;
        responseData.message="两次的密码不一致";
        res.json(responseData);
        return;
    }
    //保存到数据库。（没注册保存，已注册提示用户）//返回一个promise对象
    User.findOne({
        username:username
    }).then(function(userInfo){
        //console.log(userInfo)
        if(userInfo){//数据库存在该用户
            responseData.code =4;
            responseData.message = "该用户已经被注册了"
            res.json(responseData);
            return;
        }else{
            var user = new User({
                username:username,
                password:password
            })
            return user.save();
        }
    }).then(function(newUserInfo){
        console.log(newUserInfo);
        responseData.message='恭喜，注册成功!'
        res.json(responseData);
    })
})

//登录逻辑
routers.post('/user/login',urlencodedParser,function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    if(username==""&&password==""){
        responseData.code = 5;
        responseData.message="用户名和密码不能为空"
        res.json(responseData)
        return
    }
    //查询数据库判断登录
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 6
            responseData.message ="用户名或密码错误"
            res.json(responseData);
            return
        }else{
            responseData.message="登录成功";
            responseData.userInfo={
                id:userInfo.id,
                username:userInfo.username
            }
            var userInfo = {
                id:userInfo.id,
                username:userInfo.username
            }
            //设置cookie，配置signed: true的话可以配置签名cookie
            res.cookie("userInfo", userInfo, {maxAge: 1000*60*60*24*30,httpOnly: true}); //, signed: true
            res.json(responseData);
            return;
        }
    })
})
//获取文章的所有评论信息
routers.get('/comment',function(req,res){
    var contentid = req.query.contentid||'';
    contents.findOne({
        _id:contentid
    }).then(function(content){
        responseData.message = '获取评论成功';
        responseData.data = content.comments;
        res.json(responseData);
    })
})
//评论提交接口
routers.post('/comment/post',function(req,res){
    //文章的ID
    var contentid = req.body.contentid||'';
    var postDate ={
        username:global.userName,
        commentTime:new Date(),
        commentCon:req.body.commentCon
    }
    contents.findOne({
        _id:contentid
    }).then(function(content){
        content.comments.push(postDate)
        return content.save();
    }).then(function(newContent){
        responseData.message = '评论成功';
        responseData.data = newContent;
        res.json(responseData);
    })
})
//退出API
routers.get('/user/logout',function(req,res){
    "use strict";
    res.cookie("userInfo", null);
    responseData.message ="退出成功"
    res.json(responseData);
})
module.exports = routers;
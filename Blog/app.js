var express = require('express');//加载express模块
var swig = require('swig');//模板引擎（swig/ejs）
var mongoose = require('mongoose');
var bodyParser = require('body-parser')//加载body-parser模块，用于get。post请求数据处理
var cookieParser = require('cookie-parser')
var app  = express();//创建APP应用
//app.get('/',function(req,res,next){
//    "use strict";
//    res.render('index')
//})

//body-parser设置
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

app.use(cookieParser())
// parse application/json
app.use(bodyParser.json())

app.use('/admin',require('./routers/admin'))
app.use('/api',require('./routers/api'))
app.use('/',require('./routers/main'))
//当用户访问URL以/public开始，那么直接返回__dirname “/public”下的文件
app.use('/public',express.static(__dirname+'/public'))
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');

swig.setDefaults({cache:false})//开发过程中，取消模板缓存
mongoose.connect('mongodb://localhost:27018/BlogMongoose',function(err){
    if(err){
        console.log("数据库链接失败")
    }else{
        console.log("数据库链接成功")
        app.listen(8081);
    }
});
mongoose.connection;


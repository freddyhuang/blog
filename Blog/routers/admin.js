var express = require('express');
var routers = express.Router();

var User = require('../models/User');//用户模型
var category = require('../models/categories');//分类模型
var contents = require('../models/content');//文章内容模型

var USERINF = require('../routers/main');
routers.use( function(req,res,next){
    if(!global.a){
        res.send("对不起，只有管理员才能进入后台管理")
        return;
    }
    next();
})
/*后台首页*/
routers.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo:userName
    })
})

/*用户管理*/
/*分页limit(number)限制获取数据的条数  skip(2)忽略数据的条数*/
routers.get('/user',function(req,res,next){
    var page = Number( req.query.page||1);
    var limit = 10;
    var pages = 0;
    User.count().then(function(count){
       //console.log(count)
        pages = Math.ceil(count/limit);//计算总页数
        page = Math.min(page,pages);//取值不能超过pages
        page = Math.max(page,1);//取值不能小于1；
        var skip = (page-1)*limit//(当前页-1)*限制条数;
        User.find().limit(limit).skip(skip).then(function(user){
            res.render('admin/user_index',{
                user:user,
                pages:pages,
                limit:limit,
                skip:skip,
                count:count,
                page:page
            })
        })
    })
})


/*分类管理*/
routers.get('/category',function(req,res,next){
    var page = Number( req.query.page||1);
    var limit = 10;
    var pages = 0;
    category.count().then(function(count){
        //console.log(count)
        pages = Math.ceil(count/limit);//计算总页数
        page = Math.min(page,pages);//取值不能超过pages
        page = Math.max(page,1);//取值不能小于1；
        var skip = (page-1)*limit//(当前页-1)*限制条数;
        category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index',{
                categories:categories,
                pages:pages,
                limit:limit,
                skip:skip,
                count:count,
                page:page
            })
        })
    })
})

/*分类的添加*/
routers.get('/category/add',function(req,res,next){
    res.render('admin/category_add')
})

/*分类的保存*/
routers.post('/category/add',function(req,res,next){
    //console.log(req.body)
    var name = req.body.name || '';
    if(name==""){
        res.render("admin/error",{
            message:"名称不能为空"
            //url:"https://www.baidu.com/"
        });
        return;
    }
    category.findOne({
        name:name
    }).then(function(er){
        if(er){//分类已经存在了
            res.render("admin/error",{
                message:'分类已经存在'
            })
            return Promise.reject();
        }else{
            return new category({
                name:name
            }).save();
        }
    }).then(function(newcategory){
            res.render("admin/success",{
                message:"创建分类成功"
            })
    })
})
/*分类修改*/
routers.get('/category/edit',function(req,res,next){
    var id = req.query.id;
    category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render("admin/error",{
                message:"该分类不存在"
            })
        }else{
            res.render("admin/category_edit",{
                category:category
            })
        }
    })
})
/*分类修改保存*/
routers.post('/category/edit',function(req,res,next){
    var id = req.query.id;
    var name = req.body.name;//获取post提交过来的名称
    var  categories = category;
    category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render("admin/error",{
                message:"该分类不存在"
            })
            return Promise.reject();
        }else{
            //当用户没有修改时
            if(name == category.name){
                res.render("admin/success",{
                    message:"修改成功",
                    url:"/admin/category"
                })
                return Promise.reject();
            }else{
                //要修改的分类名称在数据库是否已经存在
              return  categories.findOne({
                    _id:{$ne:id},
                    name:name
                })
            }
        }
    }).then(function(samecategory){
        if(samecategory){
            res.render("admin/error",{
                message:'数据库中已经存在同名分类'
            })
            return Promise.reject();
        }else{
           return  category.update(
                {_id:id},
                {name:name}
            )
        }
    }).then(function(){
        res.render("admin/success",{
            message:"修改成功",
            url:"/admin/category"
        })
    })
})
/*分类删除*/
routers.get("/category/delete",function(req,res,next){
    var id = req.query.id||"";
    category.remove({
        _id:id
    }).then(function(){
        res.render("admin/success",{
            message:"删除成功",
            url:"/admin/category"
        })
    })
})

/*内容首页*/
routers.get("/content",function(req,res){
    var page = Number( req.query.page||1);
    var limit = 10;
    var pages = 0;
    contents.count().then(function(count){
        //console.log(count)
        pages = Math.ceil(count/limit);//计算总页数
        page = Math.min(page,pages);//取值不能超过pages
        page = Math.max(page,1);//取值不能小于1；
        var skip = (page-1)*limit//(当前页-1)*限制条数;
        contents.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).then(function(content){
           // console.log(content)
            res.render('admin/content_index',{
                content:content,
                pages:pages,
                limit:limit,
                skip:skip,
                count:count,
                page:page
            })
        })
    })
})

/*内容添加*/
routers.get("/content/add",function(req,res,next){
    category.find().sort({_id:-1}).then(function(rs){
        console.log(rs)
        res.render("admin/content_add",{
            category:rs
        })
    })
})
/*内容添加保存*/
routers.post("/content/add",function(req,res,next){
    //console.log(req.body)
    var category = req.body.category;
    var title = req.body.title;
    var description = req.body.description;
    var contentRes = req.body.content;

    if(category==""){
        res.render("admin/error",{
            message:"不存在这个分类标题"
        })
    }
    if(title==""){
        res.render("admin/error",{
            message:"标题不能为空"
        })
    }
    new contents({
        category:category,
        title:title,
        user: global.id,
        description:description,
        content:contentRes
    }).save().then(function(rs){
            "use strict";
            res.render("admin/success",{
                message:"创建成功",
                url:"/admin/content"
            })
        })
})

/*内容修改*/
routers.get('/content/edit',function(req,res,next){
    var id = req.query.id||'';
    var categories = []
    category.find().sort({_id:1}).then(function(rs){
        categories  = rs ;
        return  contents.findOne({
            _id:id
        }).populate("category")
    }).then(function(content){
        if(!content){
            res.render("admin/error",{
                message:"该内容不存在"
            })
        }else{
            res.render("admin/content_edit",{
                content:content,
                category:categories
            })
        }
    })
})
/*保存内容修改*/
routers.post("/content/edit",function(req,res){
    var id = req.query.id||'';

    var category = req.body.category;
    var title = req.body.title;
    var description = req.body.description;
    var contentRes = req.body.content;

    if(category==""){
        res.render("admin/error",{
            message:"不存在这个分类标题"
        })
        return
    }
    if(title==""){
        res.render("admin/error",{
            message:"标题不能为空"
        })
        return
    }
     contents.update(
         {_id:id},
         {
         category:category,
         title:title,
         description:description,
         content:contentRes
     }).then(function(){
        res.render("admin/success",{
            message:"修改内容保存成功",
            url:"/admin/content/edit?id="+id
        })
    })
})
/*删除内容*/
routers.get("/content/delete",function(req,res){
    var id = req.query.id;
    contents.remove({
      _id:id
    }).then(function(){
        res.render("admin/success",{
            message:"删除成功",
            url:"/admin/content"
        })
    })
})
module.exports = routers;
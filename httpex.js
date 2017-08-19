/**
 * Created by Administrator on 2017/3/15.
 */
const  http = require('http');
        express = require('express');
        app = express();
app.get("/",(req,res)=>{
    res.send("<h2>freddy</h2>");
})
http.createServer(app).listen(233);
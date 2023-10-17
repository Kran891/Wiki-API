const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// ----------------- Mongoose connection and schema and model creation -----------------
mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema=new mongoose.Schema(
    {
        title:String,
        content:String
    });
const article=mongoose.model("Article",articleSchema);
//   ------------ Using route--------------
app.route("/articles")
.get(async function(req,res){
    res.send((await article.find()));
})
.post(async function(req,res){
    var data=new article({
        title:req.body.title,
        content:req.body.content
    });
    console.log(data);
    await data.save();
    res.redirect("/articles")
})
.delete(async function(req,res){
  await article.deleteMany();
  res.redirect("/articles");
});
//    ----------Using get post delete seperate
// app.get("/articles",async function(req,res){
//     var data=(await article.find());
//     console.log(data);
//    res.send(data);
// });
// app.post("/articles",async function(req,res){
//     var data=new article({
//         title:req.body.title,
//         content:req.body.content
//     }
//         );
//     await data.save(); 
//     res.redirect("/articles");
// });
// app.delete("/articles",async function(req,res){
//     await article.deleteMany();
//     res.redirect("/articles");
// });
app.route("/articles/:id")
.get(async function(req,res){
    console.log(req.params.id);
  res.send(await article.findOne({_id:req.params.id}));
})
.put(async function(req,res){
   
  await article.updateOne({_id:req.params.id},
    req.body,{new:true});
   res.redirect("/articles/"+req.params.id);
})
.patch(async function(req,res){
    await article.updateOne({_id:req.params.id},
        req.body);
    res.redirect("/articles/"+req.params.id);
})
.delete(async function(req,res){
    await article.findByIdAndRemove(req.params.id);
    res.redirect("/articles");
});
app.listen(3000,function(){
    console.log("Server is running on Port "+3000);
});
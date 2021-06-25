const fs = require('fs');
const express=require("express");
const app=express();
const jwt=require("jsonwebtoken");

let cron=require("node-cron");
function cronFunction() {

    cron.schedule("* * * * * * ",()=>{
  
      fs.appendFile('mynewfile1.txt', "\n", function (err) {
        if (err) throw err;
        
      });
      var date = new Date();
      var time=date.toLocaleTimeString();
      
      fs.appendFile('mynewfile1.txt', "Current time "+time, function (err) {
        if (err) throw err;
        console.log('Updated!');
      });
    
    });
  }
    

app.post('/api/token',(req,res)=>{
const user=req.body;
jwt.sign({user},"secreatkeyfortokengeneration",(err,token)=>{
  res.json({token});
});

});

app.post("/api/verify",verifytoken,(req,res)=>{
  jwt.verify(req.token,"secreatkeyfortokengeneration",(err,userdata)=>{
    if(err){
      res.status(403).json({message:"Unauthorised"});
    }
    else{
      res.json({
        message:"Successful"
      })
    }
  })
})


app.post("/api/runcron",(req,res)=>{
  console.log("cron running")

  cronFunction();
  res.json({message1:"cron updating file....",message2:"For stop the process ctrl+c "});
  
})




function verifytoken (req,res,next) {
  const bearerHeader=req.headers['authorization'];
  if(typeof bearerHeader!=="undefined"){
    const bearer = bearerHeader.split(" ");
    const bearertoken=bearer[1];
    req.token=bearertoken;
    next();
  }
  else{
    res.sendStatus(403);
  }
}

app.listen(10000,()=>{console.log("Server running on Port 10000")})
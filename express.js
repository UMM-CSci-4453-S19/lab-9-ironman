var express=require('express'),
mysql=require('mysql'),
credentials=require('./credentials.json'),
app = express(),
port = process.env.PORT || 1337;

credentials.host='ids.morris.umn.edu'; //setup database credentials

var connection = mysql.createConnection(credentials); // setup the connection

connection.connect(function(err){if(err){console.log(error)}});

app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = 'SELECT * FROM ironman.till_buttons';
  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
      for(var index in rows) {
          button = rows[index];
          button.left = button.left_position;
          delete button.left_position;
      }
     res.send(rows);
  }})(res));
});

app.get("/list",function(req,res){
    var sql = 'SELECT * FROM ironman.current_transaction where amount > 0';
    connection.query(sql,(function(res){return function(err,rows,fields){
        if(err){console.log("We have an error:");
            console.log(err);}
        res.send(rows);
    }})(res));
});

app.get("/click",function(req,res){
  var id = req.query['id'];
  var sql = 'update ironman.current_transaction set amount = amount + 1, cost = cost + price, timeStamp = NOW() where ID = ' + id;
  //console.log("Attempting sql ->"+sql+"<-");

  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an insertion error:");
             console.log(err);}
     res.send(err); // Let the upstream guy know how it went
  }})(res));
});
// Your other API handlers go here!


app.get("/deleteRow",function (req,res) {
    var id = req.query['id'];
    var sql = 'update ironman.current_transaction set amount = 0, cost = 0, timeStamp = null where ID = ' +id;
    //console.log("Attempting sql ->"+sql+"<-");

    connection.query(sql,(function(res){return function(err,rows,fields){
        if(err){console.log("We have a deletion error:");
            console.log(err);}
        res.send(err); // Let the upstream guy know how it went
    }})(res));

});


app.get("/void",function (req,res) {
    var id = req.query['id'];
    var sql = 'update ironman.current_transaction set amount = 0, cost = 0, timeStamp = null';


    //console.log("Attempting sql ->"+sql+"<-");

    connection.query(sql,(function(res){return function(err,rows,fields){
        if(err){console.log("We have a deletion error:");
            console.log(err);}
        res.send(err); // Let the upstream guy know how it went
    }})(res));

});

app.get("/sale",function (req,res) {
    var user = req.query['user'];
    var sql ='insert into ironman.auxTable (ID,amount,price,cost,timeStamp) select ID,amount,price,cost,timeStamp from ironman.current_transaction; ' +
        'update ironman.auxTable set TID = TID+1, user ='+user+'; ' +
        'insert into ironman.transactionHistory select * from ironman.auxTable; ' +
        'update ironman.current_transaction set amount = 0, cost = 0, timeStamp = null; ';


    connection.query(sql,(function(res){return function(err,rows,fields){
        if(err){console.log("We have an error:");
            console.log(err);}
        res.send(err); // Let the upstream guy know how it went
    }})(res));
});

app.listen(port);

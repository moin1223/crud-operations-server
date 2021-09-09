const express = require('express')
const app = express()
const cors =require('cors');
const bobyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bobyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bghwt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  const userCollection = client.db("crudOperation").collection("users");


  app.get('/users',(req,res)=>{
    userCollection.find()
      .toArray((err,items)=>{
          res.send(items)
        
      })



  })



  app.post('/addUser',(req,res)=>{

   const newUser = req.body;
   //console.log('adding new event: ',newEvent)
   userCollection.insertOne(newUser)
   .then(result=>{
      // console.log('inserted count',result.insertedCount)
       res.redirect('/')
   })

  })
  app.delete('/deleteUser/:id', (req, res) => {
    userCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
        res.send(result.deletedCount > 0);
       
    })

      
 

})
// singlr user load


app.get('/user/:id', (req, res) => {
    userCollection.find({_id:ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
})


//update
app.patch('/update/:id', (req, res) => {
    const updateUser=req.body;
    console.log(updateUser)
    userCollection.updateOne({_id:ObjectId(req.params.id)},
    {
        $set:{name:req.body.name,username:req.body.username,email:req.body.email,phone:req.body.phone}
    }
    
    )
    .then(result=>{
        console.log(result)
        res.send(!!result.modifiedCount)
    })
        
})

 
 
//   client.close();
});






app.listen(port, () => {
  console.log(port)
})
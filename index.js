const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stwaq9t.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function  run(){
    try{

        await client.connect();
       const bookCollections = client.db('library_management').collection('all_books');
       const studentCollections = client.db('library_management').collection('all_request');
       const userCollections = client.db('library_management').collection('users');
       app.get('/books', async(req,res)=>{
        const query ={};
        const cursor = bookCollections.find(query);
        const books = await cursor.toArray()
        res.send(books)

       })
       app.put('/user/:email', async(req,res)=>{
        const email =req.params.email;
        const user = req.body;

        const filter ={email:email};
        const option ={upsert:true};
        const updateDoc={
          $set:user,
        };
        const result = await userCollections.updateOne(filter, updateDoc,option)
        res.send(result)
       });
       app.get('/users', async(req,res)=>{
        const user = await userCollections.find().toArray();
        res.send(user)
       })

       app.get('/all-request', async(req,res)=>{
        const query ={};
        const cursor = studentCollections.find(query);
        const books = await cursor.toArray()
        res.send(books)

       })
       app.get('/request', async(req, res)=>{
        const email =req.query.email;
        const query ={email:email}
        const request = await studentCollections.find(query).toArray();
        res.send(request);

       })
    //    app.delete('/request/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const result = await studentCollections.deleteOne(query);
    //     res.send(result);
    // })
    //make admin
    app.put('/user/admin/:email', async(req,res)=>{
      const email =req.params.email;
      const filter ={email:email};
        const updateDoc={
        $set:{role:'admin'},
      };
      const result = await userCollections.updateOne(filter, updateDoc,)
      res.send(result)
     });
     app.get('/admin/:email', async(req,res)=>{
      const email = req.params.email;
      const user = await userCollections.findOne({email:email});
      const isAdmin = user.role ==='admin';
      res.send({admin:isAdmin})
     })


       app.post('/student',async(req,res)=>{
        const student =req.body;
        const result = await studentCollections.insertOne(student);
        res.send(result)

       })
    //    app.delete('/request/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const orders = await studentCollections.deleteOne(query);
    //     res.send(orders);
    // })
    }
    finally{

    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello Library!')
})

app.listen(port, () => {
  console.log(`Library app listening on port ${port}`)
})
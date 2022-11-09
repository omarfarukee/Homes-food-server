const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
require('dotenv').config();
app.use(cors());
app.use(express.json());


// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xdpsuxi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
        try{
            const foodsCollection = client.db('foodFor').collection('foods')

            const reviewCollection =client.db('foodFor').collection('orders')

            app.get('/services', async(req, res) =>{   
                const query ={}
                const cursor = foodsCollection.find(query);
                const services = await cursor.toArray();
                // const count = await foodsCollection.estimatedDocumentCount()
                // res.send({count, foods})
                 res.send(services)
            })

            app.get('/services/:id', async (req, res) =>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const service = await foodsCollection.findOne(query);
                res.send(service)
            })
            
            app.post('/services', async (req, res) =>{
                const service = req.body;
                const result = await foodsCollection.insertOne(service);
                res.send(result)
            })
//--------------- review data load create -section---------------------------
            app.get('/review', async(req , res) =>{
                console.log(req.query.email)
                let query = {};
                if(req.query.email){
                    query ={
                        email : req.query.email
                    }
                }
                const cursor = reviewCollection.find(query);
                const reviews = await cursor.toArray();
                res.send(reviews)
            })

            app.get('/review', async(req , res) =>{
                console.log(req.query.serviceId)
                let query = {};
                if(req.query.serviceId){
                    query ={
                        serviceId: req.query.serviceId
                    }
                }
                const cursor = reviewCollection.find(query);
                const reviewsAll = await cursor.toArray();
                res.send(reviewsAll)
            })


            app.get('/review/:id', async(req , res) =>{
                const id = req.params.id;
                const query = {_id : ObjectId(id)};
                const result = await reviewCollection.findOne(query);
                res.send(result)
            })

            // app.put('/review/:id', async(req, res) => {
            //     const id =req.params.id;
            //     const filter = {_id : ObjectId(id)};
            //     const update= req.body;
            //     const option = {upsert : true};
            //     const updateReview ={
            //         $set : {
            //             message : update.message
            //         }
            //     }
            //     const result = await reviewCollection.updateOne(filter, updateReview, option);
            //     res.send(result)
            //     console.log(updateReview)
            // } )

            app.post('/review', async (req, res) =>{
                const order = req.body;
                const result = await reviewCollection.insertOne(order);
                res.send(result)
            })

            app.patch('/review/:id', async(req, res) =>{
                const id = req.params.id;
                const message = req.body.message
                const query = {_id : ObjectId(id)};
                const updateReview = {
                    $set : {
                        message : message
                    }
                }
                const result = await reviewCollection.updateOne(query, updateReview);
                res.send(result)
            })

            app.delete('/review/:id', async(req , res) =>{
                const id = req.params.id;
                const query = {_id : ObjectId(id)};
                const result = await reviewCollection.deleteOne(query);
                res.send(result)
            })
        }
        finally{

        }
}
run().catch(err => console.error(err))

app.get('/', (req, res) =>{
    res.send('homes foods in running ')
})

app.listen( port, () =>{
    console.log(`homes server on ${port}`)
})
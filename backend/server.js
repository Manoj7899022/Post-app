import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app=express()
      app.use(express.json())
      app.use(cors())

const port = process.env.PORT || 5000
const url = "mongodb+srv://admin:admin@cluster0.q07rjvk.mongodb.net/?retryWrites=true&w=majority"

    mongoose.set("strictQuery",true)
    mongoose.connect(url)

    //schema
const postSchema = new mongoose.Schema(
    {
        id:Number,
        imageurl:String,
        title:String
    }
)
const postModel = mongoose.model("posts",postSchema)

app.post("/insert", async(req,res) =>{
    const newPost = postModel(req.body)
    const result = await newPost.save()
                   res.send(result)
})

app.get("/get", async(req,res)=>{
    const result = await postModel.find()
    res.send(result)
})
app.get("/api/posts/:id", async(req,res)=>{
    postModel.findById(req.params.id, (err, document)=>{
        if(err) res.send(err);
         res.json(document)
    });
})

app.delete('/post/:id', async(req,res)=>{  
    const updateItem = await postModel.findByIdAndDelete(req.params.id)
    res.status(200).json('Item Deleted')
})

app.put('/api/posts/:id', (req,res)=>{
    postModel.findByIdAndUpdate(req.params.id, req.body, {new:true} ,(err,document) =>{
        if(err) res.send(err);
        res.json(document)
    })
})
app.patch("/:id", async(req, res) =>{
    try{
        const updateUser = await postModel.updateOne(
            {_id:req.params.id},{$set:req.body}
        );
        res.json(updateUser)
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
})

app.listen(port, () => console.log(`Listening om localhost: ${port}`))


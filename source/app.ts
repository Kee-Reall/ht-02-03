import express from 'express'

const app = express()

app.use(express.json())

app.get('/',(req,res) =>{
    res.json({'test':'jest'})
})

app.post('/',(req,res) => {
    res.json(...req.body)
})

export default app
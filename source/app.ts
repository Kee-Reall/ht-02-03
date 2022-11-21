import express, {Request, Response} from 'express'

const app = express()

app.use(express.json())

app.get('/',(req,res) =>{
    res.status(400).json({'test':'jest'})
})

app.post('/',(req,res) => {
    res.json(...req.body)
})

app.patch('/',(req:Request, res: Response) => {
    res.json({'patch':true})
})

export default app
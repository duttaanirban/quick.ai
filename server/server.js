import e from "express";
import cors from "cors";
import 'dotenv/config'
import {clerkMiddleware, requireAuth} from '@clerk/express'


const app = e();

app.use(cors());
app.use(e.json());
app.use(clerkMiddleware());

app.get('/', (req, res)=>{
    res.send('server is live');
})
app.use(requireAuth())

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})



import e from "express";
import cors from "cors";
import 'dotenv/config'


const app = e();

app.use(cors());
app.use(e.json());
app.get('/', (req, res)=>{
    res.send('server is live');
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})



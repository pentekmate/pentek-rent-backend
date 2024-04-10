const express = require('express');
const app = express();
const { db } = require('./Firebase');
const cors=require("cors");
const validateEmail = require('./modules/validateEmail');
const sendEmail = require('./sendEmail'); 
const { FieldValue,  } = require('firebase-admin/firestore');

const port = process.env.PORT;
const ip = process.env.IP;

const corsOptions ={
    origin:'*', 
    credentials:true, 
    methods:'GET,HEAD,PUT,POST',     
    optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json())


app.get('/getAllData', async (req, res) => {
  
    const data = [];
    try{
        const dataRef = db.collection('products');
        const snapshot = await dataRef.get();
        snapshot.forEach(doc => {
            data.push({ id: doc.id, data: doc.data() });
        });
       
        res.status(200).send(data);
    }
    catch(e){
        res.status(404).send("This page cannot be found");
    }
});

app.post('/submitOrder', async (req, res) => {
    const emailIsValid = validateEmail(req.body.email);
    
    if (emailIsValid) {
        try {
            await sendEmail(req.body.name, req.body.email, req.body.productName);
            
            const response = await db.collection('pending_orders').add({
                productId: req.body.productId,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                price: req.body.price,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                product: req.body.productName
            });
            
            const date = { startDate: req.body.startDate, endDate: req.body.endDate };
            const itemRef = db.collection('products').doc(`${req.body.productId}`);

            try {
                await itemRef.update({
                    product_taken_date:FieldValue.arrayUnion(date)
                });
                res.status(200).send("Sikeres rendelés");
            } catch (error) {
                console.error("Firestore update error:", error);
                res.status(500).send("Hiba történt a termék frissítése során.");
            }
        } catch (error) {
            res.status(500).send("Hiba történt a rendelés feldolgozása során.");
        }
    } else {
        res.status(208).send("Invalid Emailcím");
    }
});

app.post('/getProductData',async(req,res)=>{
    const itemId=req.body.productId
    const cityRef = db.collection('products').doc(`${itemId}`);
    const doc = await cityRef.get();
    if (!doc.exists) {
    res.send("Nincs ilyen termék")
    } else {
    res.send({ id:itemId, data: doc.data() });
    }
})

app.listen(port, ip, () => {
    console.log(`Server running at http://${ip}:${port}/`);
});

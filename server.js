const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_Key = 'jhic5f746957ynukvnfhgcnvuklm8uruiv^%$&%^$nkxzhvmkbjhnkxhmlkjhnvuoirhuhnkm'

mongoose.connect("mongodb://127.0.0.1:27017/dblogin").then( console.log('successfully connected...'))
.catch((err)=>{
    console.log(err)
});

const app = express()
// console.log(path.join(__dirname, 'static'))
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/login', async (req,res) =>{
    const {username, password} = req.body
    const user = await User.findOne({username}).lean()
    if(!user) {
        return res.json({
            status: 'error',
            data: 'Invalid Username/ Password'})
    }
    if(await bcrypt.compare(password, user.password)){
        console.log('login Success')
        const token = jwt.sign({ 
            id: user._id,
            username: user.username}
            ,JWT_Key)
        return res.json({
            status: 'ok',
            data: token
        })
    } else{
        console.log('Login Failed')
    }
    res.json({
        status: 'error',
        data: 'Invalid Username/ Password'})
})


app.post('/api/register', async (req,res) => {
    const {username, password: plainpassword} = req.body
    if(!username || typeof username !== 'string'){
        return res.json({
            status: 'error',
            error: 'Invalid Username'
        })
    }
    if(!plainpassword || typeof plainpassword !== 'string'){
        return res.json({
            status: 'error',
            error: 'Invalid Password'
        })
    }
    if(plainpassword.length < 7){
        return res.json({
            status: 'error',
            error: 'Password too small at least 8 characters'
        })
    }

    const password = await bcrypt.hash(plainpassword, 10)
    // console.log(username, password)
    try{
        const result = await User.create({
            username,
            password
        })
    console.log(result)

    }catch (error){
        if(error.code === 11000) {
            return res.json({
                status: 'error',
                error: 'Usernsme is already in used!'
            })
        }
            throw error;
    }

    res.json({ status : 'ok'})
})


app.listen(3000, ()=>{
    console.log('server is live at http://localhost:3000')
})
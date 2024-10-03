const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { UserModel } = require('../database/index');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const z = require("zod");
const bcrypt = require("bcrypt");
// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        name: z.string().min(3).max(100),
        password: z.string()
            .min(6)
            .max(30)
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[\W_]/, "Password must contain at least one special character")
    });
    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedDataWithSuccess.success) {
        const errorMessages = parsedDataWithSuccess.error.issues.map(issue => issue.message);
        res.json({ errors: errorMessages });
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const hashedPassword = await bcrypt.hash(password,5);
    // console.log(hashedPassword);
    try{
        await UserModel.create({
            email: email,
            password: hashedPassword,
            name: name
        })
        res.json({
            message:"You are logged in"
        })
    }
    catch(e){
        res.status(404).send("Email already in Use!, Please Sign in");
    }

});

router.post('/login', async (req, res) => {
     // Implement user login logic
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email:email
    })
    if(!user){
        res.status(403).send("User doesn't exist");
        return;
    }
    const passwordMatch = await bcrypt.compare(password,user.password);

    if(passwordMatch){
        const id = user._id.toString();
        const token = jwt.sign({
            id: id
        },JWT_SECRET)
        res.json({
            token: token
        })
    }else{
        res.status(403).send("Incorrect Credentials")
    }

});

router.post('/logout', userMiddleware, (req, res) => {
    // Implement logout logic
});

module.exports = router
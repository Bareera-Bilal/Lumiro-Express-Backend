const jwt = require("jsonwebtoken")
require('dotenv').config()



const isAuth = (req, res, next) => {

    try {

        const { token } = req.query   
        console.log("token" , token)

        if (token === undefined || token === null) {
            return res.status(401).json({ message: "UNAUTHORIED - KINDLY LOGIN AGAIN !" })
        }

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)

        if (verifyToken) {

            req.user = verifyToken   
            next()
        } else {

            return res.status(403).json({ message: "FORBIDDEN TO ACCESS !" })
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "INTERNAL SERVER ERROR !" })
    }

}


module.exports = isAuth
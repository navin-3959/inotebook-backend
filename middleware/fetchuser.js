/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var jwt = require('jsonwebtoken')
const JWT_SECRET = "HARRYBHAI"

const fetchuser = (req, res, next) => {
    // get the user from the jwt token and add id to req object
    const token = req.header('auth-token')
    if (!token) {
       return  res.status(401).send({ erro: "Please authanticate using a valid token " })
    }


    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user

        next()
    } catch (error) {
        res.status(401).send({ error: "Please authanticate using a valid token " })
    }

}



module.exports = fetchuser;

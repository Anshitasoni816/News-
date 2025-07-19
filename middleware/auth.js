const JsonWebToken = require("jsonwebtoken")
const { pool } = require("../db/db");

const auth = async (req, res, next) => { //next -> if everthing is fine then go router and find next step
    try {
       
        //remove token and session from browser's cache
        res.setHeader("Cache-Control","no-store,no-cache,must-revalidate,private")
        res.setHeader("Pragma","no-cache")
        res.setHeader("Expires","0")


        const token = req.cookies.jwt
        if (!token) {
            return res.redirect("/Login")
        }
        const verifyUSer = JsonWebToken.verify(token, "secretkeykdfjkdsfjklsdjfdkeiufknlsfjdkahl") //decode token //jsonwebtoken.verify -> Verify if token is valid

        const [user] = await pool.query(`SELECT * FROM users WHERE email = ? AND id = ?`, [verifyUSer.email, verifyUSer.userId])

        if (user.length > 0) {
            req.data = user[0]
            next()
        } else {
            res.redirect("/Login")
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = auth

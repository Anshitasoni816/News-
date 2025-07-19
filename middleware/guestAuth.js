const JsonWebToken = require("jsonwebtoken")


const guestAuth = async (req, res, next) => { //next -> if everthing is fine then go router and find next step
    try {


        res.setHeader("Cache-Control", "no-store,no-cache,must-revalidate,private")
        res.setHeader("Pragma", "no-cache")
        res.setHeader("Expires", "0")



        const token = req.cookies.jwt
        if (token) {


            return res.redirect("/dashboard")
        }

        next()

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = guestAuth

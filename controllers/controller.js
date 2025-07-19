const { pool } = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
class controllers {

    static homePage = async (req, res) => {

        try {

            res.render("home");

        } catch (error) {

            console.log(error.message);

        }
    }

    static registration = async (req, res) => {

        try {
            // res.setHeader("Cache-Control", "no-store,no-cache,must-revalidate,private")
            // res.setHeader("Pragma", "no-cache")
            // res.setHeader("Expires", "0")
            // const token = req.cookies.jwt
            // if (token) {


            //     return res.redirect("/dashboard")
            // }
            res.render("registration", {

                successMessage: req.flash("success"),
                errorMessage: req.flash("error")
                // Render karte time error retrieve hota hai and view ko bhej diya jata hai

            });

        } catch (error) {

            console.log(error.message);

        }
    }

    static registrationInsert = async (req, res) => {

        try {

            const { name, email, password, gender, city } = req.body;//object destructuring 

            if (!name || !email || !password || !gender || !city) {

                req.flash("error", "All fields are required")//error is key and all fields... is value 
                res.redirect("/registration")//render-> file name from views and redirect -> route
                // Redirect karte time error store hota hai flash mai by using req.flash()
                //  Set message ➝ Redirect ➝ Read message ➝ Render to View

            }

            else {

                const [user] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
                // console.log(user);//console.log(user[0]);

                if (user.length > 0) {

                    // console.log("Email already exists");
                    req.flash("error", "Email already exists")// req.flash -> Store temp message across redirect
                    res.redirect("/registration")

                } else {

                    const hashPassword = await bcrypt.hash(password, 10);
                    const sql = `INSERT INTO users (name,email,password,gender,city) VALUES (?,?,?,?,?)`
                    const [saved] = await pool.query(sql, [name, email, hashPassword, gender, city])//accept query and value and return result
                    // console.log(saved);//console.log(saved[0]);

                    if (saved.affectedRows > 0) {

                        // console.log("Data inserted successfully");
                        req.flash("success", "Registered Scuccessfully")
                        res.redirect("/registration")

                    } else {

                        console.log("Internal server error");

                    }

                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    static login = async (req, res) => {

        try {
            // res.setHeader("Cache-Control", "no-store,no-cache,must-revalidate,private")
            // res.setHeader("Pragma", "no-cache")
            // res.setHeader("Expires", "0")
            // console.log(req.cookies)
            // const token = req.cookies.jwt
            // if (token) {


            //     return res.redirect("/dashboard")
            // }
            res.render("login", {
                successMessage: req.flash("success"),
                errorMessage: req.flash("error")
            });

        } catch (error) {

            console.log(error.message);

        }
    }

    static loginCheck = async (req, res) => {

        try {

            const { email, password } = req.body;

            if (!email || !password) {

                req.flash("error", "All fields are required")
                res.redirect("/Login")

            } else {

                const [user1] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
                // console.log(user1)

                if (user1.length > 0) {

                    const isPasswordMatched = await bcrypt.compare(password, user1[0].password)

                    if (isPasswordMatched) {

                        const token = jwt.sign({ userId: user1[0].id, name: user1[0].name, email: user1[0].email }, "secretkeykdfjkdsfjklsdjfdkeiufknlsfjdkahl")// jwt.sign -> Create token from user data
                        res.cookie("jwt", token)//jwt is key and value is token
                        // req.flash("success","Login Successfully")
                        res.redirect("/dashboard")

                    } else {

                        req.flash("error", "Incorrect Password")
                        res.redirect("/Login")

                    }
                } else {

                    req.flash("error", "User not found")
                    res.redirect("/Login")

                }

            }

        } catch (error) {

            console.log(error.message);

        }
    }

    static logOut = (req, res) => {
        try {
            res.clearCookie("jwt")//	Deletes token from browser
            res.setHeader("Cache-Control", "no-store,no-cache,must-revalidate,private")
            res.setHeader("Pragma", "no-cache")
            res.setHeader("Expires", "0")
            req.session.destroy((error) => { //session means time period //Deletes session data on server
                if (error) {
                    const previousUrl = req.header("Referer")//It redirects back to the previous page in case of an error during logout.
                    return res.redirect(previousUrl)
                }
                res.redirect("/Login")
            })
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = controllers;
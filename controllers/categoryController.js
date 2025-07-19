var cloudinary = require('cloudinary').v2; //v2 is representing version 2 of cloudinary
cloudinary.config({
    cloud_name: 'dxvugcpw2',
    api_key: '247661347284483',
    api_secret: 'GFQ4j1Mn8WGrW0TleP-_ItLRXDc',
    // secure: true
});
const { pool } = require('../db/db')
class categoryController {

    static category = async (req, res) => {

        try {

            const sql = 'SELECT * FROM categories WHERE isDeleted = ?'
            const [data] = await pool.query(sql,[0])

            res.render('authPages/pages/category/list', {
                successMessage: req.flash("success"),
                errorMessage: req.flash("error"),
                categoryData: data

            })

        } catch (error) {

            console.log(error.message)

        }
    }


    static addCategory = (req, res) => {

        try {

            res.render('authPages/pages/category/add', {
                successMessage: req.flash("success"),
                errorMessage: req.flash("error")
            })

        } catch (error) {

            console.log(error.message)

        }
    }


    static insert = async (req, res) => {

        try {

            const { title, description } = req.body


            if (!title || !description) {
                req.flash("error", "All fields are required")
                res.redirect("/add-category")
            }
            else {
                // console.log(req.files)
                const categoryImage = req.files.categoryImage
                const result = await cloudinary.uploader.upload(categoryImage.tempFilePath, {
                    "folder": "NewsProjectImages"
                })
                // console.log(result)
                const categoryPublicId = result.public_id
                const categorySecureUrl = result.secure_url

                const sql = `INSERT INTO categories(title,description,categoryPublicId,categorySecureUrl) VALUES (?,?,?,?)`
                const values = [title, description, categoryPublicId, categorySecureUrl]
                const [saved] = await pool.query(sql, values)

                if (saved.affectedRows > 0) {

                    req.flash("success", "data inserted successfully")
                    res.redirect("/category")

                } else {

                    req.flash("error", "data not found")
                    res.redirect("/add-category")

                }
            }

        } catch (error) {

            console.log(error.message)

        }

    }


    static details = async (req, res) => {

        try {

            // console.log(req.params)
            const categoryId = req.params.id
            const [data] = await pool.query("SELECT * FROM categories WHERE id = ?", [categoryId])

            console.log(data[0])
            res.render("authpages/pages/category/details", {

                categoryDetails: data[0],
                successMessage: req.flash("success"),
                errorMessage: req.flash("error"),       //what is the need of flash message on details page

            })

        } catch (error) {

            console.log(error.message)

        }

    }


    static edit = async (req, res) => {

        try {

            const categoryId = req.params.id
            const [data] = await pool.query("SELECT * FROM categories WHERE id = ?", [categoryId])
            res.render("authpages/pages/category/edit", {

                categoryDetails: data[0],
                successMessage: req.flash("success"),
                errorMessage: req.flash("error"),

            })

        } catch (error) {

            console.log(error.message)

        }

    }


    // static delete = async(req,res) => {

    //     try {

    //         const categoryId = req.params.id
    //         const [deleted] = await pool.query('DELETE FROM categories WHERE id = ?',[categoryId])
    //         if (deleted.affectedRows > 0) {

    //             req.flash("success","Data Deleted Successfully")
    //             res.redirect("/category")

    //         } else {

    //             req.flash("error","Internal server error")
    //             res.redirect("/category")

    //         }   

    //     } catch (error) {

    //         console.log(error.message)

    //     }

    // }


    static update = async (req, res) => {
        try {
            const { title, description } = req.body
            console.log(req.body)
            if (!title || !description) {
                req.flash("error", "All fields are required")
                res.redirect(`/category/edit/${req.params.id}`)
            } else {
                if (req.files && req.files.categoryImage) {
                    const categoryImage = req.files.categoryImage.tempFilePath
                    const result = await cloudinary.uploader.upload(categoryImage, {
                        "folder": "NewsProjectImages"
                    })
                    const categoryPublicId = result.public_id
                    const categorySecureUrl = result.secure_url

                    var sql = `UPDATE categories SET title = ? ,description = ? ,categoryPublicId = ? ,categorySecureUrl = ? WHERE id = ?`

                    var values = [title, description, categoryPublicId, categorySecureUrl, req.params.id]

                    var [saved] = await pool.query(sql, values)

                } else {
                    var sql = `UPDATE categories SET title = ? ,description = ? WHERE id = ?`

                    var values = [title, description, req.params.id]

                    var [saved] = await pool.query(sql, values)
                }


                if (saved.affectedRows > 0) {

                    req.flash("success", "data updated successfully")
                    res.redirect("/category")

                } else {

                    req.flash("error", "data not found")
                    res.redirect(`/category/edit/${req.params.id}`)

                }

            }
        } catch (error) {
            console.log(error.message)
        }
    }

    static softDelete = async (req, res) => {
        try {
            const categoryId = req.params.id
            const [sql] = await pool.query("UPDATE categories SET isDeleted = ? WHERE id = ?", [1, categoryId])
            if (sql.affectedRows > 0) {

                req.flash("success", "data deleted successfully")
                res.redirect("/category")

            } else {

                req.flash("error", "data not found")
                res.redirect(`/category`)

            }

        } catch (error) {
            console.log(error.message);

        }
    }
}

module.exports = categoryController
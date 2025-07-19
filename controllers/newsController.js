const { pool } = require("../db/db");
const { edit } = require("./categoryController");
var cloudinary = require('cloudinary').v2; //v2 is representing version 2 of cloudinary
cloudinary.config({
    cloud_name: 'dxvugcpw2',
    api_key: '247661347284483',
    api_secret: 'GFQ4j1Mn8WGrW0TleP-_ItLRXDc',
    // secure: true
});
class newsController {

    static news = async (req, res) => {

        try {

            // const [data] = await pool.query("SELECT * FROM news")

            const [data] = await pool.query("SELECT news.id AS newsId, news.title AS newsTitle , news.description AS newsDescription, categories.title AS categoriesTitle, categories.description AS categoriesDescription, categoryId, newsSecureUrl,newsSecureUrl1 FROM news INNER JOIN categories ON news.categoryId = categories.id")

            // console.log(data);

            // const [[dataa]] = await pool.query("SELECT categories.title from categories,news WHERE categories.id = news.categoryId AND news.id = ?",[newsId])

            res.render("authPages/pages/newss/list", {

                errorMessage: req.flash("error"),
                successMessage: req.flash("success"),
                newsData: data,
                // categoryName : dataa

            })

        } catch (error) {

            console.log(error.message);

        }
    }


    static addNews = async (req, res) => {

        try {

            const [data] = await pool.query("SELECT * FROM categories")

            res.render("authPages/pages/newss/add", {

                errorMessage: req.flash("error"),
                newsData: data

            })

        } catch (error) {

            console.log(error.message);

        }
    }

    static newsInsert = async (req, res) => {

        try {

            const { title, description, categoryId } = req.body

            if (!title || !description || !categoryId) {

                req.flash("error", "All fields are required")
                res.redirect("/add-news")
            }

            
           else {
             if (req.files) {

                if (req.files.newsImage && req.files.newsImage1) {

                    const newsImage = req.files.newsImage.tempFilePath
                    const newsImage1 = req.files.newsImage1.tempFilePath

                    // console.log("first url",newsImage);
                    // console.log("second url",newsImage1);

                    const result = await cloudinary.uploader.upload(newsImage, {
                        "folder": "newsImages"
                    })
                    const result1 = await cloudinary.uploader.upload(newsImage1, {
                        "folder": "newsImages"
                    })


                    // console.log("result of first image", result);
                    // console.log("result of second image", result1);

                    const newsPublicId = result.public_id
                    const newsSecureUrl = result.secure_url

                    const newsPublicId1 = result1.public_id
                    const newsSecureUrl1 = result1.secure_url

                    const [sql] = await pool.query("INSERT INTO news (title,description,categoryId,newsPublicId,newsSecureUrl,newsPublicId1,newsSecureUrl1) VALUES (?,?,?,?,?,?,?)", [title, description, categoryId, newsPublicId, newsSecureUrl, newsPublicId1, newsSecureUrl1])

                    console.log(sql);

                    if (sql.affectedRows > 0) {

                        req.flash("success", "Data Inserted successfully")
                        res.redirect("/news")

                    } else {

                        req.flash("error", "data not found")
                        res.redirect("/add-news")

                    }
                }

                else if (req.files.newsImage) {

                    const newsImage = req.files.newsImage.tempFilePath
                    const result = await cloudinary.uploader.upload(newsImage, {
                        "folder": "newsImages"
                    })

                    const newsPublicId = result.public_id
                    const newsSecureUrl = result.secure_url

                    const [sql] = await pool.query("INSERT INTO news (title,description,categoryId,newsPublicId,newsSecureUrl) VALUES (?,?,?,?,?)", [title, description, categoryId, newsPublicId, newsSecureUrl])

                    //console.log(sql);

                    if (sql.affectedRows > 0) {

                        req.flash("success", "Data Inserted successfully")
                        res.redirect("/news")

                    } else {

                        req.flash("error", "data not found")
                        res.redirect("/add-news")

                    }
                }

                else if (req.files.newsImage1) {

                    const newsImage1 = req.files.newsImage1.tempFilePath
                    const result = await cloudinary.uploader.upload(newsImage1, {
                        "folder": "newsImages"
                    })

                    const newsPublicId1 = result.public_id
                    const newsSecureUrl1 = result.secure_url

                    const [sql] = await pool.query("INSERT INTO news (title,description,categoryId,newsPublicId1,newsSecureUrl1) VALUES (?,?,?,?,?)", [title, description, categoryId, newsPublicId1, newsSecureUrl1])

                    //console.log(sql);

                    if (sql.affectedRows > 0) {

                        req.flash("success", "Data Inserted successfully")
                        res.redirect("/news")

                    } else {

                        req.flash("error", "data not found")
                        res.redirect("/add-news")

                    }
                }
            }

            else {

                const [sql] = await pool.query("INSERT INTO news (title,description,categoryId) VALUES (?,?,?)", [title, description, categoryId])

                // console.log(sql);

                if (sql.affectedRows > 0) {

                    req.flash("success", "Data Inserted successfully")
                    res.redirect("/news")

                } else {

                    req.flash("error", "data not found")
                    res.redirect("/add-news")

                }
            }
           }

        }

        catch (error) {

            console.log(error.message);

        }
    }


    static newsDetails = async (req, res) => {

        try {

            const newsId = req.params.id
            // console.log(newsId);

            const [data] = await pool.query("SELECT *, news.id AS newsId, news.title AS newsTitle, news.description AS newsDescription,categories.title AS categoryTitle FROM news INNER JOIN categories ON news.categoryId = categories.id WHERE news.id = ?", [newsId])

            // const [[categoryName]] = await pool.query("SELECT categories.title from categories,news WHERE categories.id = news.categoryId AND news.id = ?", [newsId])

            res.render("authPages/pages/newss/details", {

                newsDetails: data[0],
                // categoryName: categoryName,

            })

        }

        catch (error) {

            console.log(error.message);

        }
    }

    static newsEdit = async (req, res) => {

        try {

            //do i need to use join here
            const newsId = req.params.id

            const [data] = await pool.query("SELECT * FROM news WHERE id = ?", [newsId])

            // const [[categoryName]] = await pool.query("SELECT categories.title from categories,news WHERE categories.id = news.categoryId AND news.id = ?",[newsId])

            // console.log(categoryName);

            const [categoryData] = await pool.query("SELECT * FROM categories")
            //  console.log(categoryData);


            res.render("authPages/pages/newss/edit", {

                errorMessage: req.flash("error"),
                newsEdit: data[0],
                categoryData: categoryData,
                // categoryName : categoryName,

            })

        }

        catch (error) {

            console.log(error.message);

        }
    }

    static newsDelete = async (req, res) => {

        try {

            const deleteId = req.params.id

            const [sql] = await pool.query("DELETE FROM news WHERE id = ?", [deleteId])

            if (sql.affectedRows > 0) {

                req.flash("success", "News deleted Successfully")
                res.redirect("/news")
            }

            else {

                req.flash("error", "News data not found")

            }

        }

        catch (error) {

            console.log(error.message);

        }
    }

    static newsUpdate = async (req, res) => {

        try {

            const newsUpdateId = req.params.id
            const { title, description, categoryId } = req.body

            // console.log(req.body);

            //I have to select category otherwise it'll show an error that all fields are required since we are sending id in categoryName from edit.ejs....

            //and if we send categrory name in categoryName then we won't be able to update the category id in news...

            if (!title || !description || !categoryId) {

                req.flash("error", "All fields are required")
                res.redirect(`/news/edit/${newsUpdateId}`)

            }
            if (req.files) {

                if (req.files.newsImage && req.files.newsImage1) {

                    const newsImage = req.files.newsImage.tempFilePath
                    const newsImage1 = req.files.newsImage1.tempFilePath

                    // console.log("first url",newsImage);
                    // console.log("second url",newsImage1);

                    const result = await cloudinary.uploader.upload(newsImage, {
                        "folder": "newsImages"
                    })
                    const result1 = await cloudinary.uploader.upload(newsImage1, {
                        "folder": "newsImages"
                    })


                    // console.log("result of first image", result);
                    // console.log("result of second image", result1);

                    const newsPublicId = result.public_id
                    const newsSecureUrl = result.secure_url

                    const newsPublicId1 = result1.public_id
                    const newsSecureUrl1 = result1.secure_url

                    const [sql] = await pool.query("UPDATE news SET title = ?,description = ?, categoryId = ?, newsPublicId = ?, newsSecureUrl = ?, newsPublicId1 = ?, newsSecureUrl1 = ? WHERE id = ?", [title, description, categoryId, newsPublicId, newsSecureUrl, newsPublicId1, newsSecureUrl1, newsUpdateId])

                    console.log(sql);

                    if (sql.affectedRows > 0) {

                        req.flash("success", "Data Updated successfully")
                        res.redirect("/news")

                    } else {

                        req.flash("error", "There is an error, can't update")
                        res.redirect(`/news/edit/${newsUpdateId}`)

                    }
                }

                else if (req.files.newsImage) {

                    const newsImage = req.files.newsImage.tempFilePath
                    const result = await cloudinary.uploader.upload(newsImage, {
                        "folder": "newsImages"
                    })

                    const newsPublicId = result.public_id
                    const newsSecureUrl = result.secure_url

                    const [sql] = await pool.query("UPDATE news SET title = ?, description = ?, categoryId = ?, newsPublicId = ?, newsSecureUrl = ? WHERE id = ?", [title, description, categoryId, newsPublicId, newsSecureUrl, newsUpdateId])

                    //console.log(sql);

                    if (sql.affectedRows > 0) {

                        req.flash("success", "Data Updated successfully")
                        res.redirect("/news")

                    } else {

                        req.flash("error", "There is an error, can't update")
                        res.redirect(`/news/edit/${newsUpdateId}`)

                    }


                }

                else if (req.files.newsImage1) {

                    const newsImage1 = req.files.newsImage1.tempFilePath
                    const result = await cloudinary.uploader.upload(newsImage1, {
                        "folder": "newsImages"
                    })

                    const newsPublicId1 = result.public_id
                    const newsSecureUrl1 = result.secure_url

                    const [sql] = await pool.query("UPDATE news SET title = ?, description = ?, categoryId = ?, newsPublicId1 = ?, newsSecureUrl1 = ?  WHERE id = ?", [title, description, categoryId, newsPublicId1, newsSecureUrl1, newsUpdateId])

                    //console.log(sql);

                    if (sql.affectedRows > 0) {

                        req.flash("success", "Data Updated successfully")
                        res.redirect("/news")

                    } else {

                        req.flash("error", "There is an error, can't update")
                        res.redirect(`/news/edit/${newsUpdateId}`)

                    }
                }
            }

            else {

                const [sql] = await pool.query("UPDATE news set title = ?, description = ?, categoryId = ? WHERE id = ?", [title, description, categoryId, newsUpdateId])

                // console.log(sql);

                if (sql.affectedRows > 0) {

                    req.flash("success", "Data Updated successfully")
                    res.redirect("/news")

                } else {

                    req.flash("error", "There is an error, can't update")
                    res.redirect(`/news/edit/${newsUpdateId}`)

                }
            }

        }

        catch (error) {

            console.log(error.message);

        }
    }

    static removeNewsImages = async (req, res) => {

        try {

            //doubt why we have set value of id and secureurl in db null???

            const editId = req.params.id

            const [newsData] = await pool.query("SELECT * FROM news WHERE id = ?", [editId])

            const publicId = newsData[0].newsPublicId

            await cloudinary.uploader.destroy(publicId)

            const [sql] = await pool.query("UPDATE news SET newsPublicId = ?, newsSecureUrl = ? WHERE id = ?", [null, null, editId])

            if (sql.affectedRows > 0) {

                req.flash("success", "News Image deleted Successfuly")
                res.redirect("/news")

            }
            else {

                req.flash("error", "There is an error can't delete Image")
                res.redirect(`/news/edit/ ${editId}`)

            }

        }

        catch (error) {

            console.log(error.message);

        }

    }

    static removeNewsImages1 = async (req, res) => {

        try {

            //I have made 2 different routes to handle image deletion can't I do it in one API ??

            const editId = req.params.id

            const [newsData] = await pool.query("SELECT * FROM news WHERE id = ?", [editId])

            const publicId1 = newsData[0].newsPublicId1

            await cloudinary.uploader.destroy(publicId1)


            const [sql] = await pool.query("UPDATE news SET newsPublicId1 = ?, newsSecureUrl1 = ? WHERE id = ?", [null, null, editId])


            if (sql.affectedRows > 0) {

                req.flash("success", "News Image deleted Successfuly")
                res.redirect("/news")

            }
            else {

                req.flash("error", "There is an error can't delete Image")
                res.redirect(`/news/edit/ ${editId}`)

            }

        }
        catch (error) {

            console.log(error.message);

        }

    }

    static removeImage = async (req, res) => {
        try {
            const { newsImage, newsId } = req.body
            if (newsImage == "firstImage") {
                const [newsData] = await pool.query("SELECT * FROM news WHERE id = ?", [newsId])

                const publicId = newsData[0].newsPublicId

                await cloudinary.uploader.destroy(publicId)

                const [sql] = await pool.query("UPDATE news SET newsPublicId = ?, newsSecureUrl = ? WHERE id = ?", [null, null, newsId])

                if (sql.affectedRows > 0) {

                    req.flash("success", "News Image deleted Successfuly")
                    res.redirect("/news")

                }
                else {

                    req.flash("error", "There is an error can't delete Image")
                    res.redirect(`/news/edit/ ${newsId}`)

                }
            } else {
                const [newsData] = await pool.query("SELECT * FROM news WHERE id = ?", [newsId])

                const publicId1 = newsData[0].newsPublicId1

                await cloudinary.uploader.destroy(publicId1)


                const [sql] = await pool.query("UPDATE news SET newsPublicId1 = ?, newsSecureUrl1 = ? WHERE id = ?", [null, null, newsId])


                if (sql.affectedRows > 0) {

                    req.flash("success", "News Image deleted Successfuly")
                    res.redirect("/news")

                }
                else {

                    req.flash("error", "There is an error can't delete Image")
                    res.redirect(`/news/edit/ ${newsId}`)

                }
            }
        } catch (error) {
            console.log(error.message);

        }
    }
}


module.exports = newsController
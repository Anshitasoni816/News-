const { pool } = require("../db/db")
var cloudinary = require('cloudinary').v2; //v2 is representing version 2 of cloudinary
cloudinary.config({
    cloud_name: 'dxvugcpw2',
    api_key: '247661347284483',
    api_secret: 'GFQ4j1Mn8WGrW0TleP-_ItLRXDc',
    // secure: true
});
class blogContainer {


  static blogList = async (req, res) => {
    try {
      // const myName = "Anshita"
      const [data] = await pool.query(`SELECT * FROM blogs`)
      console.log(data);
      res.render("authPAges/pages/blog/list", {
        data: data,
        successMessage: "",
        errorMessage: ""
      })

    } catch (error) {
      console.log(error.message);

    }
  }


  static details = async (req, res) => {

    try {
      res.render("authPAges/pages/blog/details")
    } catch (error) {
      console.log(error.message);

    }

  }

  static edit = async (req, res) => {

    try {
      res.render("authPAges/pages/blog/edit", {
        successMessage: "",
        errorMessage: ""
      })
    } catch (error) {
      console.log(error.message);

    }

  }


  static delete = async (req, res) => {

    try {

    } catch (error) {
      console.log(error.message);

    }

  }


  static addBlog = async (req, res) => {

    try {
      res.render("authPAges/pages/blog/add",{
        successMessage : "",
        errorMessage : ""
    })
    } catch (error) {
      console.log(error.message);

    }

  }


  static blogInsert = async (req, res) => {

    try {

      const { title,description } = req.body 
      if(!title || !description) {
        req.flash("error","All fields are required")
        res.redirect("/add-blog")
      }
      else {
        const blogImage = req.files.blogImage.tempFilePath
        const result = cloudinary.uploader.upload(blogImage,{
          "folder" : "BlogImages"
        })
        console.log(result);
        

        // const blogPublicId = 
        // const blogSecureUrl = 
      }

    } catch (error) {
      console.log(error.message);

    }

  }


   static updateBlog = async (req, res) => {

    try {

    } catch (error) {
      console.log(error.message);

    }

  }

}




module.exports = blogContainer 
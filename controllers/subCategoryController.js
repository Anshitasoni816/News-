const {pool} = require("../db/db")
var cloudinary = require('cloudinary').v2; //v2 is representing version 2 of cloudinary
cloudinary.config({
    cloud_name: 'dxvugcpw2',
    api_key: '247661347284483',
    api_secret: 'GFQ4j1Mn8WGrW0TleP-_ItLRXDc',
    // secure: true
});

class subCategoryController {

    static subCategory = async(req,res) => {

        try {
            res.render("authPAges/Pages/SubCategory/list",{
                errorMessage : "",
                successMessage : "",
            })
        } catch (error) {
            console.log(error.message);
            
        }

    }


    static addSubCategory = async(req,res) => {

        try {

            res.render("authPAges/Pages/SubCategory/add",{
                errorMessage : "",
                successMessage : "",
            })
            
        } catch (error) {

            console.log(error.message);
            
            
        }


    }

}

module.exports = subCategoryController


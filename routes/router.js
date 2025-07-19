const express = require("express");
const controllers = require("../controllers/controller");
const dashboardController = require("../controllers/dashboardController");
const auth = require("../middleware/auth");
const guestAuth = require("../middleware/guestAuth");
const categoryController = require("../controllers/categoryController");
const subCategoryController = require("../controllers/subCategoryController");
const blogContainer = require("../controllers/blogController");
const newsController = require("../controllers/newsController");


const router = express.Router();

//registration and login routes.....
router.get("/", controllers.homePage);
router.get("/registration",guestAuth,controllers.registration);
router.get("/Login",guestAuth,controllers.login);
router.post("/Login-check", controllers.loginCheck);
router.post("/registration-insert", controllers.registrationInsert);
router.get("/logOut",controllers.logOut)


//dashboard route....
router.get("/dashboard",auth,dashboardController.dashboard);
//we can't directly go to dashboard only logged in users should have acces to it that's we have protected it using middleware auth..

//category routes....
router.get("/category",categoryController.category)
router.get("/add-category",categoryController.addCategory)
router.post("/category-insert",categoryController.insert)
router.get("/category/details/:id",categoryController.details)//:for handling dynamic part
router.get("/category/edit/:id",categoryController.edit)
router.post("/category-update/:id",categoryController.update)
router.get("/category/delete/:id",categoryController.softDelete)
// router.get("/category/delete/:id",categoryController.delete)


//SubCategory routes.....
router.get("/subcategory",subCategoryController.subCategory)
router.get("/add-subcategory",subCategoryController.addSubCategory)
// router.post("/subcategory-insert")
// router.get("/subcategory/details/:id",)
// router.get("/subcategory/edit/:id",)
// router.post("/subcategory-update/:id")
// router.get("/subcategory/delete/:id",)


//Blog routes.....
router.get("/blog",blogContainer.blogList)
router.get("/blog/details/:id",blogContainer.details)
router.get("/blog/edit/:id",blogContainer.edit)
router.get("/blog/delete/:id",blogContainer.delete)
router.get("/add-blog",blogContainer.addBlog)
router.post("/blog-insert",blogContainer.blogInsert)
router.post("/blog-update/:id",blogContainer.updateBlog)

//News routes.....
router.get("/news",newsController.news)
router.get("/add-news",newsController.addNews)
router.post("/news-insert",newsController.newsInsert)
router.get("/news/details/:id",newsController.newsDetails)
router.get("/news/edit/:id",newsController.newsEdit)
router.get("/news/delete/:id",newsController.newsDelete)
router.post("/news-update/:id",newsController.newsUpdate)
router.get("/news/remove-news-image/:id",newsController.removeNewsImages)
router.get("/news/remove-news-image1/:id",newsController.removeNewsImages1)
router.post("/remove-image",newsController.removeImage)





module.exports = router; 

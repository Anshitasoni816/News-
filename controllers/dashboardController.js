class dashboardController {
 
    static dashboard = (req,res) => {
        try {
            res.render("authPages/pages/dashboard")
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = dashboardController
function login(app,helpers){
    app.post('/login', (req,res) => {
        email = req.body.email
        password = req.body.password
        helpers.exec_login(email,password,req,res)
    })

    app.post('/register', (req,res) => {
        username = req.body.username
        email = req.body.email
        motdepasse = req.body.motdepasse
        helpers.addOneUser(username,email,motdepasse)
        helpers.returnAll('user',req,res)
    })
}

module.exports = {
    login
};
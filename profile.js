const crypto = require('crypto')

function profile(app,helpers){
    app.get('/profile/:id', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.getOneProfile(id, req,res)
    })

    app.post('/profile', (req,res) => {
        prenom = req.body.prenom
        nom = req.body.nom
        email = req.body.email
        password = req.body.password
        role = "user"
        const chars = 'aEiuOxLPRGNBHnjDYbFTylgwUKMcQIsokXdhzprAWevJSCVtfmqZ0123456789';
        token = '';
        for (let i = 0; i < 30; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        helpers.addOneUser(prenom,nom,email,password,role,token)
        helpers.returnAll('user',req,res)
    })

    app.get('/profile/', (req,res) => {
        helpers.returnAll('user',req,res)
    })

    app.get('/profile/:id/delete', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.deleteOneByTableAndId('user',id)
    })

    app.post('/profile/edit/prenom/:id', (req,res) => {
        const id = parseInt(req.params.id)
        prenom = req.body.prenom
        helpers.updateProfile('prenom',id, prenom)
    })

    app.post('/profile/edit/role/:id', (req,res) => {
        const id = parseInt(req.params.id)
        role = req.body.role
        helpers.updateProfile('role',id, role)
    })


    app.post('/profile/edit/nom/:id', (req,res) => {
        const id = parseInt(req.params.id)
        nom = req.body.nom
        helpers.updateProfile('nom',id, nom)
    })

    app.post('/profile/edit/email/:id', (req,res) => {
        const id = parseInt(req.params.id)
        email = req.body.email
        helpers.updateProfile('email',id, email)
    })

    app.post('/profile/edit/password/:id', (req,res) => {
        const id = parseInt(req.params.id)
        const password = req.body.password
        const hashPass = crypto.createHash('sha1').update(password).digest('hex')
        helpers.updateProfile('password',id, hashPass)
    })
}

module.exports = {
    profile
};
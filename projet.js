function projet(app,helpers){
    app.get('/projet', (req,res) => {
        helpers.returnAll('projet',req,res)
    })

    app.get('/projet/:id', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.getProjetByUserId(id,req,res)
    })

    app.get('/projet/participation/:id', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.getProjetParticipationByUserId(id,req,res)
    })

    app.get('/projet/member/:id', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.getAllMemberByProjetId(id,req,res)
    })

    app.get('/projet/:id/remove/:idmember', (req,res) => {
        const idprojet = parseInt(req.params.id)
        const idmember = parseInt(req.params.idmember)
        helpers.removeMemberFromProjet(idprojet,idmember,req,res)
    })

    app.post('/projet', (req,res) => {
        nom = req.body.nom
        id = parseInt(req.body.id)
        helpers.addOneProjet(nom,id)
        helpers.returnAll('projet',req,res)
    })

    app.post('/projet/addMember', (req,res) => {
        username = req.body.username
        id = parseInt(req.body.id)
        helpers.addMember(username,id)
        helpers.returnAll('projet',req,res)
    })

    app.get('/projet/:id/delete', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.deleteOneByTableAndId('livre',id)
    })

    app.get('/tache/:id/delete', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.deleteOneByTableAndId('page',id)
    })

    
    app.get('/projet/:id/getTache', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.getPages(id, req,res)
    })

    app.post('/tache', (req,res) => {
        nom = req.body.nom
        url = req.body.url
        id = req.body.id
        helpers.addOnePage(nom,url,id)
        helpers.returnAll('page',req,res)
    })

    app.post('/livre/edit/title/:id', (req,res) => {
        const id = parseInt(req.params.id)
        title = req.body.title
        helpers.updateLivre('title',id, title)
    })


    app.delete('/livre/:id', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.RemoveOneBook(id)
        helpers.returnAll('livre',req,res)
    })
}

module.exports = {
    projet
};
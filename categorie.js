function categorie(app,helpers){
    app.get('/categories', (req,res) => {
        helpers.returnAll('categories',req,res)
    })
    
    app.get('/categories/:id', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.returnOne('categories',id, req,res)
    })
    
    app.get('/categories/:id/delete', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.deleteOneByTableAndId('categories',id)
    })

    app.post('/categories', (req,res) => {
        label = req.body.label
        helpers.addOneCategorie(label)
        helpers.returnAll('categories',req,res)
    })
    
    app.patch('/categories/:id', (req,res) => {
        const id = parseInt(req.params.id)
        label = req.body.label
        helpers.UpdateOneCategorie(id,label)
        helpers.returnOne('categories',id,req,res)
    })
    
    app.delete('/categories/:id', (req,res) => {
        const id = parseInt(req.params.id)
        helpers.RemoveOneCategories(id)
        helpers.returnAll('categories',req,res)
    })
}

module.exports = {
    categorie
};
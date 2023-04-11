const mysql = require('mysql')
const crypto = require('crypto')

// const db = mysql.createConnection({host: "localhost", user: "root", password:"root", database: "api_biblio"})
const db = mysql.createConnection({host: "db4free.net", user: "dbrappeltout", password:"dbrappeltout", database: "dbrappeltout"})

db.connect(function(err) {   
    if (err){
        console.log(err)
    }
});

function getAll(table, callback) {
    db.query(`SELECT * FROM ${table}`, callback);
}

function getOne(table, id, callback) {
    db.query(`SELECT * FROM ${table} WHERE id = ${id}`, callback);
}

function getOneMember(id, id_projet, callback) {
    db.query(`SELECT user.id, user.username, membre_projet.id_role, role.nom AS "role" FROM user JOIN membre_projet ON membre_projet.id_membre = user.id JOIN role ON role.id = membre_projet.id_role WHERE membre_projet.id_membre = ${id} AND membre_projet.id_projet = ${id_projet}`, callback);
}

function getParticipationNotChef(id, callback) {
    db.query(`SELECT * FROM membre_projet WHERE id_membre = ${id} AND id_role != 1`, callback);
}

function removeMemberFromProjet(idprojet, idmember, callback) {
    db.query(`DELETE FROM membre_projet WHERE id_projet = ${idprojet} AND id_membre = ${idmember}`, callback);
}

function getParticipation(id, callback) {
    db.query(`SELECT * FROM membre_projet WHERE id_projet = ${id}`, callback);
}

function getParticipationChef(id, callback) {
    db.query(`SELECT * FROM membre_projet WHERE id_membre = ${id} AND id_role = 1`, callback);
}

function getOneByColonneValue(table, colonne, value, callback) {
    db.query(`SELECT * FROM ${table} WHERE ${colonne} = ${value}`, callback);
}

function getProjetByUserId(id, req, res){
    let arrayfinal = [];
    getParticipationChef(id, (error, results, fields) => {
        if (error) throw error;
        const promises = results.map((element) => {
          const id_projet = JSON.parse(JSON.stringify(element)).id_projet;
          return new Promise((resolve, reject) => {
            getOne('projet', id_projet, (error, resultsgetone, fields) => {
              if (error) reject(error);
              const nom = JSON.parse((JSON.stringify(resultsgetone)))
              resolve(nom);
            });
          });
        });
        Promise.all(promises)
          .then((results) => {
            const arrayfinal = results.flat();
            const jsonData = JSON.parse(JSON.stringify(arrayfinal));
            res.status(200).json(jsonData);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send('Error retrieving data');
          });
      });
}

function getProjetParticipationByUserId(id, req, res){
    let arrayfinal = [];
    getParticipationNotChef(id, (error, results, fields) => {
        if (error) throw error;
        const promises = results.map((element) => {
          const id_projet = JSON.parse(JSON.stringify(element)).id_projet;
          return new Promise((resolve, reject) => {
            getOne('projet', id_projet, (error, resultsgetone, fields) => {
              if (error) reject(error);
              const nom = JSON.parse((JSON.stringify(resultsgetone)))
              resolve(nom);
            });
          });
        });
        Promise.all(promises)
          .then((results) => {
            const arrayfinal = results.flat();
            const jsonData = JSON.parse(JSON.stringify(arrayfinal));
            res.status(200).json(jsonData);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send('Error retrieving data');
          });
      });
}

function getAllMemberByProjetId(id, req, res){
    let arrayfinal = [];
    getParticipation(id, (error, results, fields) => {
        if (error) throw error;
        const promises = results.map((element) => {
          const id_membre = JSON.parse(JSON.stringify(element)).id_membre;
          return new Promise((resolve, reject) => {
            getOneMember(id_membre,id, (error, resultsgetone, fields) => {
              if (error) reject(error);
              const nom = JSON.parse((JSON.stringify(resultsgetone)))
              resolve(nom);
            });
          });
        });
        Promise.all(promises)
          .then((results) => {
            const arrayfinal = results.flat();
            const jsonData = JSON.parse(JSON.stringify(arrayfinal));
            res.status(200).json(jsonData);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send('Error retrieving data');
          });
      });

}

function addOneProjet(nom,id) {
    db.query(`INSERT INTO projet(nom) VALUES ('${nom}')`, function(err, result, fields) {
        if (err) throw err;
        db.query(`INSERT INTO membre_projet(id_membre,id_projet,id_role) VALUES (${id},${result.insertId},1)`);
      });

}

function addOneUser(username,email,motdepasse) {
    hash = crypto.createHash('sha1').update(motdepasse).digest('hex')
    db.query(`INSERT INTO user(username,email,password) VALUES ('${username}','${email}','${hash}')`);
}

function addOneCategorie(label) {
    db.query(`INSERT INTO categories(label) VALUES ('${label}')`);
}

function addMember(username,id) {
    db.query(`SELECT id FROM user WHERE username = '${username}'`, (err, result) => {
        if (err) throw err;
        db.query(`INSERT INTO membre_projet(id_membre,id_projet,id_role) VALUES (${result[0].id},${id},2)`);
      });
}

function addOnePage(nom,url,id) {
    db.query(`INSERT INTO page(title,url,id_livre) VALUES ('${nom}','${url}',${id})`);
}

function UpdateOneBook(id, titre, auteur, annee) {
    db.query(`UPDATE livre SET titre = '${titre}', auteur = '${auteur}', annee = ${annee} WHERE id = ${id}`);
}

function updateProfile(colonne, id, data) {
    db.query(`UPDATE user SET ${colonne} = '${data}' WHERE id = ${id}`);
}

function updateLivre(colonne, id, data) {
    db.query(`UPDATE livre SET ${colonne} = '${data}' WHERE id = ${id}`);
}

function UpdateOneCategorie(id, label) {
    db.query(`UPDATE categories SET label = '${label}' WHERE id = ${id}`);
}

function RemoveOneBook(id) {
    db.query(`DELETE FROM livre WHERE id = ${id}`);
}

function deleteOneByTableAndId(table, id) {
    db.query(`DELETE FROM ${table} WHERE id = ${id}`);
}

function RemoveOneCategories(id) {
    db.query(`DELETE FROM categories WHERE id = ${id}`);
}

function login(email, password, callback) {
    db.query(`SELECT * FROM user WHERE email = '${email}' AND password = '${password}'`, callback);
}

function getCategorie(idlivre, req, res){
    getOne('livre',idlivre, (error, results, fields) => {
        if (error) throw error;
        const obj = JSON.parse((JSON.stringify(results[0])))
        const id = obj.id_categorie
        getOne('categories',id, (error, results, fields) => {
            if (error) throw error;
            const obj = JSON.parse((JSON.stringify(results[0])))
            const label = obj.label
            const data = {
                "label": label
              };
            const jsonData = JSON.parse(JSON.stringify(data));              
            res.status(200).json(jsonData)
        });
    });
}

function getPages(idlivre, req, res){
    getOneByColonneValue('page','id_livre', idlivre, (error, results, fields) => {
        if (error) throw error;
        const obj = JSON.parse((JSON.stringify(results)))
        res.status(200).json(obj)     
    });
}

function getNomAuteur(idlivre, req, res){
    getOne('livre',idlivre, (error, results, fields) => {
        if (error) throw error;
        const obj = JSON.parse((JSON.stringify(results[0])))
        const id = obj.auteur
        getOne('user',id, (error, results, fields) => {
            if (error) throw error;
            const obj = JSON.parse((JSON.stringify(results[0])))
            const prenom = obj.prenom
            const nom = obj.nom
            const data = {
                "prenom": prenom,
                "nom": nom,
              };
            const jsonData = JSON.parse(JSON.stringify(data));              
            res.status(200).json(jsonData)
        });
    });
}

function getIdAuteur(idlivre, req, res){
    getOne('livre',idlivre, (error, results, fields) => {
        if (error) throw error;
        const obj = JSON.parse((JSON.stringify(results[0])))
        const id = obj.auteur
        const data = {
            "id": id
        }
        const jsonData = JSON.parse(JSON.stringify(data));              
        res.status(200).json(jsonData)
    });
 }

function returnAll(table, req, res){
    getAll(table, (error, results, fields) => {
        if (error) throw error;
        const obj = JSON.parse((JSON.stringify(results)))
        res.status(200).json(obj)
    });
}

function returnOne(table,id,req,res){
    getOne(table,id, (error, results, fields) => {
        if (error) throw error;
        const obj = JSON.parse((JSON.stringify(results)))
        res.status(200).json(obj)
    });
}

function exec_login(email,password,req, res){
    hash = crypto.createHash('sha1').update(password).digest('hex')
    login(email,hash, (error, results, fields) => {
        if (error) throw error;
        const objtocount = JSON.parse((JSON.stringify(results)))        
        var count = Object.keys(objtocount).length;
        if(count == 1){
            const obj = JSON.parse((JSON.stringify(results[0])))
            id = obj.id
            username = obj.username
            email = obj.email
            const data = {
                "id": id,
                "username": username,
                "email": email,
              };
            const jsonData = JSON.parse(JSON.stringify(data));              
            res.status(200).json(jsonData)
        }
        else{
            res.status(403)
        }
    });
}

function getOneProfile(id,req,res){
    if(Number.isInteger(id)){
        getOne('user',id, (error, results, fields) => {
            if (error) throw error;
            const obj = JSON.parse((JSON.stringify(results)))
            res.status(200).json(obj)
        });
    }
}

module.exports = {
    removeMemberFromProjet,
    addMember,
    getAllMemberByProjetId,
    getProjetByUserId,
    getProjetParticipationByUserId,
    addOneUser,
    addOnePage,
    addOneProjet,
    addOneCategorie,
    UpdateOneBook,
    updateProfile,
    UpdateOneCategorie,
    RemoveOneBook,
    RemoveOneCategories,
    returnAll,
    returnOne,
    updateLivre,
    getOneProfile,
    getCategorie,
    exec_login,
    getPages,
    getIdAuteur,
    getNomAuteur,
    deleteOneByTableAndId
};
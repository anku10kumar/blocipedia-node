const Wiki = require("./models").Wiki;
const Authorizer = require('../policies/wiki');
const markdown = require("markdown").markdown;

module.exports = {
    getAllWikis(req, callback){
        let result = {};
        Wiki.findAll({where: {private: false}})
        .then((publicWikis) => {
          result["publicWikis"] = publicWikis;

          Wiki.scope({method: ["allPrivatelyOwned", req.user.id]}).findAll()
          .then((ownedPrivateWikis) => {
            result["privateWikis"] = ownedPrivateWikis;

            callback(null, result);
            })
            .catch((err) => {
              callback(err);
            });
          });

      },
      getAllPublicWikis(req, callback){
        let result = {};
        return Wiki.findAll({where: {private: false}})
        .then((publicWikis) => {
          result["publicWikis"] = publicWikis
          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        })
      },

    addWiki(newWiki, callback){
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            private: newWiki.private,
            userId: newWiki.userId
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },
    getWiki(id, callback){
        return Wiki.findById(id)
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },
    deleteWiki(req, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            const authorized = new Authorizer(req.user, wiki).destroy();
            if (authorized){
                wiki.destroy()
                .then((res) => {
                    callback(null, wiki);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.")
                callback(401);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },
    updateWiki(req, updatedWiki, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            if (!wiki){
                return callback("Wiki not found");
            }
            const authorized = new Authorizer(req.user, wiki).update();
            if (authorized){
                wiki.update(updatedWiki, {
                    fields: Object.keys(updatedWiki)
                })
                .then(() => {
                    callback(null, wiki);
                })
                .catch((err) => {
                    callback(err);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback("Forbidden");
            }
        });
    },
    makeWikiPrivate(req, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            if(!wiki){
                return callback("Wiki not found");
            }

            const authorized = new Authorizer(req.user, wiki).update();

            if(authorized){
                wiki.update(
                    {private: true},
                    {where: {id: wiki.id}}
                )
                .then(() => {
                    callback(null,wiki);
                })
                .catch((err) => {
                    callback(err);
                });
            } else {
                req.flash("notice", "You are not authorized to do that");
                callback("Forbidden");
            }
        });
    },
    demoteWikis(req){
        return Wiki.scope({method: ["allPrivatelyOwned", req.user.id]}).findAll()
        .then((wikis) => {
          wikis.forEach(wiki => {
            wiki.update(
              {private: false},
              {where: {id: wiki.id}}
            )
            .catch((err) => {

              done();
            });
          });
        });
      }
}

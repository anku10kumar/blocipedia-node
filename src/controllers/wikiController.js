const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require ("../policies/wiki");
const markdown = require( "markdown" ).markdown;

module.exports = {
    index(req,res,next){
        if (req.user){
        wikiQueries.getAllWikis(req, (err, result) => {
            if (err){
                res.redirect(500, "static/index");
            } else {
                res.render("wikis/index", {result})
            }
        })
    } else {
        wikiQueries.getAllPublicWikis(req, (err, result) => {
            if(err){
                res.redirect(500, "static/index");
            } else {
                res.render("wikis/index", {result});
            }
        })
      }
    },
    new(req,res,next){
        const authorized = new Authorizer(req.user).new();

        if(authorized){
            res.render("wikis/new");
        } else {
           req.flash("notice", "You are not authorized to do that.");
           res.redirect("/wikis");
        }
    },
    create(req, res, next){
        const authorized = new Authorizer(req.user).create();

        if(authorized){
            let newWiki = {
                title: req.body.title,
                body: req.body.body,
                private: false,
                userId: req.user.id
            };
            wikiQueries.addWiki(newWiki, (err, wiki) => {
                if (err){
                    res.redirect(500, "wikis/new");
                } else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }

    },
    createPrivateWikis(req,res, next){
        const authorized = new Authorizer(req.user).create();

        if(authorized){
            let newWiki = {
                title: req.body.title,
                body: req.body.body,
                private: req.body.private,
                userId: req.user.id
            };
            wikiQueries.addWiki(newWiki, (err,wiki) => {
                if (err){
                    res.redirect(500, "wikis/new");
                } else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that");
            res.redirect("/wikis");
        }
    },
    show(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if (err || wiki == null){
                res.redirect(404, "/");
            } else {
                res.render("wikis/show", {wiki});
            }
        });
    },
    destroy(req, res, next){
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if (err){
                res.redirect(err, `/wikis/${req.params.id}`)
            } else {
                res.redirect(303, "/wikis")
            }
        });
    },
    edit(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if (err || wiki == null){
                res.redirect(404, "/");
            } else {
                const authorized = new Authorizer(req.user, wiki).edit();
                if(authorized){
                    res.render("wikis/edit", {wiki});
                } else {
                    req.flash("You are not authorized to do that.")
                    res.redirect(`/wikis/${req.params.id}`)
                }
            }
        });
    },
    update(req, res, next){
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
            if (err || wiki == null){
                res.redirect(404, `/wikis/${req.params.id}/edit`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    },
    makePrivate(req, res, next){
        wikiQueries.makeWikiPrivate(req, (err,wiki) => {
            if(err || wiki == null){
                res.redirect(404, `/wikis/${req.params.id}`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    },
    makePublic(req, res, next){
        wikiQueries.makeWikiPublic(req, (err, wiki) => {
          if(err || wiki == null){
            res.redirect(404, `/wikis/${req.params.id}`);
          } else {
            res.redirect(`/wikis/${req.params.id}`);
          }
        });
      },
    makeWikiPublic(req, callback){
    return Wiki.findByPk(req.params.id)
    .then((wiki) => {
      if(!wiki){
        return callback('Wiki not found');
      }

      const authorized = new Authorizer(req.user, wiki).update();

      if(authorized){
        wiki.update(
          {private: false},
          {where: {id: wiki.id}}
        )
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash('notice', 'You are not authorized to do that.');
        callback('Forbidden');
      }
    });
  }
}

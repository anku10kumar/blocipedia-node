const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

    show(){
        return this._isAdmin || this.isPremiumOwner
    }

    edit(){
        return this.show
    }


}

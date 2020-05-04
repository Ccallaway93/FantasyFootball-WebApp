const mongoose = require('mongoose')

const keeperRulesSchema = new mongoose.Schema({
    rule: {
        type: String
    },
    active: {
        type: Boolean
    }

})

const KeeperRules = mongoose.model('KeeperRules', keeperRulesSchema )

module.exports = KeeperRules;
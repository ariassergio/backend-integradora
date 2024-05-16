const UserDAO = require('./models/user.dao');
const UserModel = require('./models/mongo_models/user.schema');  

class DAOFactory {
    static getDAO(type) {
        switch (type) {
            case 'mongo':
                return new UserDAO(UserModel);
            
            default:
                throw new Error('DAO type not supported');
        }
    }
}

module.exports = DAOFactory;

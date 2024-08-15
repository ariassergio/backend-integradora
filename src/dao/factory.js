const UserDAO = import('./models/user.dao');
const UserModel = import('./models/mongo_models/user.schema');  

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

export default DAOFactory;

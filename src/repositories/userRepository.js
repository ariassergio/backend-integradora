class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAllUsers() {
        return this.dao.getAll();
    }

    async getUserById(id) {
        return this.dao.getById(id);
    }

    async createUser(user) {
        return this.dao.create(user);
    }

    async updateUser(id, user) {
        return this.dao.update(id, user);
    }

    async deleteUser(id) {
        return this.dao.delete(id);
    }
}

module.exports = UserRepository;

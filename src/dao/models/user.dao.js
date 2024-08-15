class UserDAO {
    constructor(model) {
        this.model = model;
    }

    async getAll() {
        return this.model.find();
    }

    async getById(id) {
        return this.model.findById(id);
    }

    async create(user) {
        return this.model.create(user);
    }

    async update(id, user) {
        return this.model.findByIdAndUpdate(id, user, { new: true });
    }

    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}

export default UserDAO;

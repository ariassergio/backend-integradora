class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.name = user.name;
        this.email = user.email;
        // Añadir mas campos si es necesario
    }
}

module.exports = UserDTO;

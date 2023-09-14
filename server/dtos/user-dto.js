module.exports = class UserDto {
    email;
    id;
    isConfirmed;

    constructor(model) {
        this.email = model.email;
        this.id = model.id;
        this.isConfirmed = model.isConfirmed;
    }
}


const getUsers = (req, res) => {
    res.send(' get users');
}

const createUser = (req, res) => {
    res.send(' create user');
}

const editUser = (req, res) => {

    res.send(' edit user');
}

const deleteUser = (req, res) => {  
    res.send(' delete user');
}
 export {getUsers, createUser, editUser, deleteUser}
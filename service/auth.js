// const sessionIdToUserMap = new Map();

const jwt = require('jsonwebtoken');
const secretKey = "Iloveumahakbaby"; 

// function setUser(id, user){
//     sessionIdToUserMap.set(id, user);
// }

function setUser(user){
    return jwt.sign({
        _id: user._id,
        email:user.email
    },secretKey
);
}

// function getUser(id){
//     return sessionIdToUserMap.get(id);
// }

function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser
}
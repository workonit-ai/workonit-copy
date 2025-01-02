const User = require('./User')
const Application = require('./Application')
const collectionNametoModel= (name)=>{
    switch(name){
        case "users":return User;
        case "applications": return Application;

    }
    throw new Error("model not found")
}
module.exports = {
collectionNametoModel
}
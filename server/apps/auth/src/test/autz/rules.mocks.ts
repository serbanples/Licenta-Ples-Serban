// Mock data
module.exports = {
    admin: {
        users: {
            create: true,
            read: true,
            delete: true
        }
    },
    user: {
        users: {
            create: false,
            read: true,
            delete: false
        }
    }
};
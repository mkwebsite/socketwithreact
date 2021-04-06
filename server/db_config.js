//Database configuration
module.exports = {
    forgeterDb: function () {
        return {
            DB_HOST: 'localhost',
            DB_USER: 'root',
            DB_PASSWORD: '',
            DB_NAME: 'socket_test',
            CHAT_PORT: '4800',
        };
    }
};
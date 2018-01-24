'use strict'; 

const Hapi = require('hapi'); 
const Sequelize = require('sequelize'); 

const sequelize = new Sequelize('hapiexample', 'root', '', { 
        host: 'localhost', 
          dialect: 'mysql', 
          pool: { 
                 max: 5, 
                 min: 0, 
                 acquire: 30000,
                 idle: 1000
             },
    define : {
            timestamps: false
        }
});

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    birthday: Sequelize.DATE
}, {
    freezeTableName: true
});


const server = new Hapi.Server({port: 3000, host: 'localhost'});

server.route({
    method: 'GET',
    path: '/user',
    handler: async function(request, h) {
            const users = await User.findAll(); 
            if (users) return users;
            return h.response().code(404); 
        }
});

server.route({
    method: 'POST',
    path: '/user',
    handler: async function(request, h) {
            await User.create(request.payload);
            return h.response().code(201);
        }
});

server.route({
    method: 'PUT', 
    path: '/user/{id}',
        handler: async function(request, h) {
                await User.update(request.payload, {
                            where: {
                                            id: request.params.id
                                        }
                        });
                return h.response().code(204);
            }
});

server.route({
    method: 'GET',
    path: '/user/{id}',
        handler: async function(request, h) {
                const user = await User.findById(request.params.id);
                if (user) return user;
                return h.response().code(404); 
            }
});

server.route({
    method: 'DELETE',
    path: '/user/{id}',
        handler: async function(request, h) {
                await User.destroy({
                            where: {
                                            id: request.params.id  
                                        }
                        });
                return h.response().code(204);
            }
});

server.start();

server.events.on('start', function() {
    console.log(`Server started on port ${server.info.port}`);
});

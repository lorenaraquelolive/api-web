const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configurações do Swagger
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Usuários',
            version: '1.0.0',
            description: 'Uma API simples para gerenciamento de usuários.'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ]
    },
    apis: ['./index.js'], // Certifique-se de que este caminho está correto
});

module.exports = {
    swaggerUi,
    swaggerSpec,
};

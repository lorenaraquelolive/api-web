const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Usuários',
            version: '1.0.0',
            description: 'Uma API simples para gerenciamento de usuários.'
        },
    },
    apis: ['./index.js'], 
});

module.exports = {
    swaggerUi,
    swaggerSpec,
};

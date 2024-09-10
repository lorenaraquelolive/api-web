const express = require('express');
const app = express();
const port = 3000;
const { swaggerUi, swaggerSpec } = require('./swagger');

// Adiciona a rota para o Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware para interpretar o corpo das requisições como JSON
app.use(express.json());

// Banco de dados em memória para armazenar os usuários
const usuarios = {};

// Middleware para validação dos dados do usuário
function validarUsuario(req, res, next) {
    const { cpf, nome, data_nascimento } = req.body;

    if (!cpf || !nome || !data_nascimento) {
        return res.status(400).json({ error: 'Todos os campos (cpf, nome, data_nascimento) são obrigatórios.' });
    }

    if (typeof cpf !== 'string' || !/^\d{11}$/.test(cpf)) {
        return res.status(400).json({ error: 'CPF deve ser um número de 11 dígitos.' });
    }

    if (typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({ error: 'Nome deve ser uma string não vazia.' });
    }

    if (isNaN(Date.parse(data_nascimento))) {
        return res.status(400).json({ error: 'Data de nascimento deve ser uma data válida.' });
    }

    next();
}

/**
 * @openapi
 * /:
 *   get:
 *     summary: Mensagem de boas-vindas
 *     description: Retorna uma mensagem de boas-vindas para a API.
 *     responses:
 *       200:
 *         description: Mensagem de boas-vindas
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Bem-vindo à API de Usuários!
 */

// Rota raiz
app.get('/', (req, res) => {
    res.send('Bem-vindo à API de Usuários!');
});

/**
 * @openapi
 * /usuario:
 *   post:
 *     summary: Adiciona um novo usuário
 *     description: Adiciona um novo usuário ao banco de dados em memória.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf:
 *                 type: string
 *                 example: '12345678901'
 *               nome:
 *                 type: string
 *                 example: José dos Santos
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: '1970-09-06'
 *     responses:
 *       201:
 *         description: Usuário adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                     data_nascimento:
 *                       type: string
 *                       format: date
 *       400:
 *         description: Dados inválidos ou incompletos
 *       409:
 *         description: Usuário com este CPF já existe
 */

// Rota POST para adicionar um usuário
app.post('/usuario', validarUsuario, (req, res) => {
    const { cpf, nome, data_nascimento } = req.body;

    // Verificar se o usuário já existe
    if (usuarios[cpf]) {
        return res.status(409).json({ error: 'Usuário com este CPF já existe.' });
    }

    // Adicionar usuário ao "banco de dados" em memória
    usuarios[cpf] = { nome, data_nascimento };
    res.status(201).json({ message: 'Usuário adicionado com sucesso.', usuario: usuarios[cpf] });
});

/**
 * @openapi
 * /usuario/{cpf}:
 *   get:
 *     summary: Retorna os dados de um usuário
 *     description: Recupera as informações de um usuário com base no CPF.
 *     parameters:
 *       - name: cpf
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                   type: string
 *                 data_nascimento:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Usuário não encontrado
 */

// Rota GET para obter um usuário pelo CPF
app.get('/usuario/:cpf', (req, res) => {
    const { cpf } = req.params;

    // Verificar se o usuário existe
    const usuario = usuarios[cpf];
    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(usuario);
});

// Rota GET para listar todos os usuários
app.get('/usuarios', (req, res) => {
    res.json(Object.values(usuarios));
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});

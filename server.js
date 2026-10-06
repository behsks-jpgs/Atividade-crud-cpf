// =============================================================
//  CRUD com Busca por CPF — Express + JSON Server
//  Servidor único: entrega as páginas HTML (pasta public/)
//  e a API REST do JSON Server (rota /api, banco db.json).
// =============================================================

// Importa o módulo path (monta caminhos de arquivos de forma segura)
const path = require('path');

// Importa o framework Express
const express = require('express');

// Importa a biblioteca JSON Server
const jsonServer = require('json-server');

// Cria a instância do Express (é ela que vai "escutar" a porta)
const app = express();

// Cria o roteador do JSON Server a partir do arquivo db.json
// Cada chave do db.json vira uma rota. Ex.: "pessoas" -> /api/pessoas
const router = jsonServer.router(path.join(__dirname, 'db.json'));

// Middlewares padrão do JSON Server (CORS, logger, leitura do corpo JSON...)
const middlewares = jsonServer.defaults();

// Porta: o Render informa a porta pela variável de ambiente PORT.
// No computador local, usa a 3000.
const porta = process.env.PORT || 3000;

// 1) Arquivos estáticos (HTML, CSS e JS de cada operação do CRUD)
app.use(express.static(path.join(__dirname, 'public')));

// 2) API do JSON Server publicada em /api
//    GET    /api/pessoas            -> lista todos
//    GET    /api/pessoas?cpf=...    -> busca por CPF
//    POST   /api/pessoas            -> cria
//    PUT    /api/pessoas/:id        -> atualiza
//    DELETE /api/pessoas/:id        -> exclui
app.use('/api', middlewares, router);

// 3) Rota principal: entrega a página inicial (menu do CRUD)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
    console.log(`API do JSON Server em http://localhost:${porta}/api/pessoas`);
});

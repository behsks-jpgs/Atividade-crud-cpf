# CRUD com Busca por CPF — Express + JSON Server no Render

Projeto da disciplina **Programação para Internet (UMC)**: CRUD completo de pessoas,
com cada operação em uma página HTML separada e busca de registros pelo **CPF**.

## Estrutura

```
crud-cpf/
├── server.js          # Express (páginas) + JSON Server (API em /api)
├── db.json            # "banco de dados" do JSON Server
├── package.json
├── Dockerfile
└── public/
    ├── index.html     # Página inicial (menu)
    ├── css/style.css  # CSS aplicado em todas as páginas
    ├── post/          # POST   (Create) -> index.html + post.js
    ├── get/           # GET    (Read)   -> index.html + get.js
    ├── put/           # PUT    (Update) -> index.html + put.js
    └── delete/        # DELETE (Delete) -> index.html + delete.js
```

Campos de cada registro: `cpf`, `nome`, `sobrenome`, `email`, `idade`, `telefone`,
`rua`, `bairro`, `cidade`, `estado`, `rg` (o `id` é gerado pelo JSON Server).

As páginas se comunicam: na lista (GET), os botões **Editar** e **Excluir** abrem
as páginas PUT e DELETE já com o CPF preenchido (`/put/?cpf=...`).

## Rotas da API

| Método | Rota                     | Função              |
|--------|--------------------------|---------------------|
| GET    | `/api/pessoas`           | Lista todos         |
| GET    | `/api/pessoas?cpf=...`   | Busca por CPF       |
| POST   | `/api/pessoas`           | Cadastra            |
| PUT    | `/api/pessoas/:id`       | Atualiza            |
| DELETE | `/api/pessoas/:id`       | Exclui              |

## Rodar no computador

```bash
npm install
node server.js
```

Abra http://localhost:3000

> Importante: o projeto usa `json-server` na versão **0.17** (a versão 1.x mudou a forma
> de uso e não tem `jsonServer.create()` / `jsonServer.router()`).

## Publicar no GitHub

1. Crie um repositório novo (público) no GitHub, com `.gitignore` de **Node**.
2. **Add file → Upload files** e envie: `public/`, `server.js`, `db.json`,
   `package.json`, `Dockerfile` (não envie `node_modules`).
3. Clique em **Commit changes**.

## Deploy no Render

1. Entre em https://render.com com a conta do GitHub.
2. **Add new → Web Service** e escolha o repositório.
3. Language: **Docker** · Branch: `main` · Instance Type: **Free**.
4. Em **Start Command** coloque: `node server.js`
5. **Deploy Web Service** e aguarde o status *Live*. O link público aparece no topo
   da página do serviço (`https://<nome>.onrender.com`).

Observações do plano gratuito do Render:
- O serviço "dorme" após um tempo sem acesso; o primeiro acesso pode levar ~50 s.
- O disco não é permanente: a cada novo deploy ou reinício, o `db.json` volta ao
  conteúdo que está no GitHub.

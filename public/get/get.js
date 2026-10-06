// =============================================================
//  GET (Read) — lista todas as pessoas e permite filtrar por CPF
// =============================================================

const API = '/api/pessoas';

const tabela = document.getElementById('tabela-corpo');
const contador = document.getElementById('contador');
const mensagem = document.getElementById('mensagem');
const campoCpf = document.getElementById('cpfBusca');

// Máscara do CPF no campo de busca
campoCpf.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
});

// Cria uma célula <td> com texto (textContent evita injeção de HTML)
function celula(texto) {
    const td = document.createElement('td');
    td.textContent = texto ?? '';
    return td;
}

// Desenha as linhas da tabela a partir do array retornado pela API
function montarTabela(pessoas) {
    tabela.innerHTML = '';

    if (pessoas.length === 0) {
        tabela.innerHTML = '<tr><td class="vazio" colspan="13">Nenhum registro encontrado.</td></tr>';
        contador.textContent = '';
        return;
    }

    // Loop forEach: uma linha <tr> para cada pessoa
    pessoas.forEach((pessoa) => {
        const linha = document.createElement('tr');

        const campos = ['id', 'cpf', 'nome', 'sobrenome', 'email', 'idade',
            'telefone', 'rua', 'bairro', 'cidade', 'estado', 'rg'];
        campos.forEach((campo) => linha.appendChild(celula(pessoa[campo])));

        // Coluna de ações: leva para as páginas de PUT e DELETE já com o CPF
        const acoes = document.createElement('td');
        const cpf = encodeURIComponent(pessoa.cpf);
        acoes.innerHTML = `
            <a class="botao laranja pequeno" href="/put/?cpf=${cpf}">Editar</a>
            <a class="botao vermelho pequeno" href="/delete/?cpf=${cpf}">Excluir</a>`;
        linha.appendChild(acoes);

        tabela.appendChild(linha);
    });

    contador.textContent = `${pessoas.length} registro(s) exibido(s).`;
}

// Busca os dados na API. Se receber um CPF, filtra: /api/pessoas?cpf=...
async function carregar(cpf) {
    mensagem.className = 'mensagem';
    const url = cpf ? `${API}?cpf=${encodeURIComponent(cpf)}` : API;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        montarTabela(dados);
    } catch (erro) {
        console.error(erro);
        tabela.innerHTML = '<tr><td class="vazio" colspan="13">Erro ao carregar os dados.</td></tr>';
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
        mensagem.className = 'mensagem erro';
    }
}

// Busca por CPF
document.getElementById('formBusca').addEventListener('submit', (e) => {
    e.preventDefault();
    carregar(campoCpf.value.trim());
});

// Volta a mostrar todos os registros
document.getElementById('btnTodos').addEventListener('click', () => {
    campoCpf.value = '';
    carregar();
});

// Ao abrir a página, lista todos
carregar();

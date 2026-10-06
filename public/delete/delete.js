// =============================================================
//  DELETE (Delete) — busca uma pessoa pelo CPF e exclui o registro
// =============================================================

const API = '/api/pessoas';

const campoCpf = document.getElementById('cpf');
const painel = document.getElementById('painel');
const ficha = document.getElementById('ficha');
const mensagem = document.getElementById('mensagem');

// Guarda a pessoa encontrada na busca
let pessoaSelecionada = null;

// Rótulos exibidos na ficha
const rotulos = {
    id: 'ID', cpf: 'CPF', nome: 'Nome', sobrenome: 'Sobrenome', email: 'E-mail',
    idade: 'Idade', telefone: 'Telefone', rua: 'Rua', bairro: 'Bairro',
    cidade: 'Cidade', estado: 'Estado', rg: 'RG'
};

// Máscara do CPF
campoCpf.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
});

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = 'mensagem ' + tipo;
}

function esconderPainel() {
    pessoaSelecionada = null;
    painel.classList.add('oculto');
    ficha.innerHTML = '';
}

// Monta a ficha com os dados da pessoa encontrada
function mostrarFicha(pessoa) {
    ficha.innerHTML = '';
    Object.keys(rotulos).forEach((campo) => {
        const item = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = rotulos[campo];
        dd.textContent = pessoa[campo] ?? '';
        item.append(dt, dd);
        ficha.appendChild(item);
    });
    painel.classList.remove('oculto');
}

// ---------- GET: busca por CPF ----------
async function buscarPorCpf(cpf) {
    esconderPainel();

    try {
        const resposta = await fetch(`${API}?cpf=${encodeURIComponent(cpf)}`);
        const dados = await resposta.json();

        if (dados.length === 0) {
            mostrarMensagem(`Nenhuma pessoa encontrada com o CPF ${cpf}.`, 'erro');
            return;
        }

        pessoaSelecionada = dados[0];
        mostrarFicha(pessoaSelecionada);
        mostrarMensagem('Confira os dados antes de excluir. Esta ação não pode ser desfeita.', 'aviso');
    } catch (erro) {
        console.error(erro);
        mostrarMensagem('Não foi possível conectar ao servidor.', 'erro');
    }
}

document.getElementById('formBusca').addEventListener('submit', (e) => {
    e.preventDefault();
    buscarPorCpf(campoCpf.value.trim());
});

// ---------- DELETE: exclui pelo id da pessoa encontrada ----------
document.getElementById('btnDeletar').addEventListener('click', async () => {
    if (!pessoaSelecionada) return;

    const { id, nome, sobrenome, cpf } = pessoaSelecionada;
    if (!confirm(`Excluir ${nome} ${sobrenome} (CPF ${cpf})?`)) return;

    try {
        const resposta = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if (!resposta.ok) throw new Error('Falha na exclusão');

        esconderPainel();
        campoCpf.value = '';
        mostrarMensagem(`Registro de ${nome} ${sobrenome} excluído com sucesso!`, 'sucesso');
    } catch (erro) {
        console.error(erro);
        mostrarMensagem('Não foi possível excluir o registro.', 'erro');
    }
});

document.getElementById('btnCancelar').addEventListener('click', () => {
    esconderPainel();
    mensagem.className = 'mensagem';
});

// Se veio da lista (GET) com ?cpf=..., já faz a busca
const cpfDaUrl = new URLSearchParams(window.location.search).get('cpf');
if (cpfDaUrl) {
    campoCpf.value = cpfDaUrl;
    buscarPorCpf(cpfDaUrl);
}

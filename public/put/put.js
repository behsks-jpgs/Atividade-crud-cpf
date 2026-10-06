// =============================================================
//  PUT (Update) — busca uma pessoa pelo CPF e atualiza os dados
// =============================================================

const API = '/api/pessoas';

const formBusca = document.getElementById('formBusca');
const formEditar = document.getElementById('formEditar');
const campos = document.getElementById('campos');
const mensagem = document.getElementById('mensagem');
const cpfBusca = document.getElementById('cpfBusca');

// Lista dos campos do registro (iguais aos ids dos inputs)
const nomesCampos = ['cpf', 'nome', 'sobrenome', 'email', 'idade', 'telefone',
    'rua', 'bairro', 'cidade', 'estado', 'rg'];

// ---------- Máscaras ----------
function mascaraCpf(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
}
cpfBusca.addEventListener('input', mascaraCpf);
document.getElementById('cpf').addEventListener('input', mascaraCpf);

document.getElementById('telefone').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    e.target.value = v;
});

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = 'mensagem ' + tipo;
}

// Limpa e bloqueia o formulário de edição
function limparFormulario() {
    formEditar.reset();
    document.getElementById('id').value = '';
    campos.disabled = true;
}

// ---------- GET: busca por CPF ----------
async function buscarPorCpf(cpf) {
    limparFormulario();

    try {
        const resposta = await fetch(`${API}?cpf=${encodeURIComponent(cpf)}`);
        const dados = await resposta.json();

        if (dados.length === 0) {
            mostrarMensagem(`Nenhuma pessoa encontrada com o CPF ${cpf}.`, 'erro');
            return;
        }

        // Preenche o formulário com a pessoa encontrada
        const pessoa = dados[0];
        document.getElementById('id').value = pessoa.id;
        nomesCampos.forEach((campo) => {
            document.getElementById(campo).value = pessoa[campo] ?? '';
        });

        campos.disabled = false;
        mostrarMensagem(`Registro de ${pessoa.nome} ${pessoa.sobrenome} carregado. Altere os dados e clique em Atualizar.`, 'aviso');
    } catch (erro) {
        console.error(erro);
        mostrarMensagem('Não foi possível conectar ao servidor.', 'erro');
    }
}

formBusca.addEventListener('submit', (e) => {
    e.preventDefault();
    buscarPorCpf(cpfBusca.value.trim());
});

// ---------- PUT: envia os dados atualizados ----------
formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('id').value;

    // Monta o objeto atualizado com todos os campos
    const pessoa = {};
    nomesCampos.forEach((campo) => {
        pessoa[campo] = document.getElementById(campo).value.trim();
    });
    pessoa.idade = Number(pessoa.idade);

    if (pessoa.cpf.length !== 14) {
        mostrarMensagem('Digite o CPF completo (000.000.000-00).', 'erro');
        return;
    }

    try {
        // Se o CPF foi alterado, confere se ele não pertence a outra pessoa
        const busca = await fetch(`${API}?cpf=${encodeURIComponent(pessoa.cpf)}`);
        const mesmoCpf = await busca.json();
        if (mesmoCpf.some((p) => String(p.id) !== String(id))) {
            mostrarMensagem(`O CPF ${pessoa.cpf} já pertence a outro registro.`, 'erro');
            return;
        }

        const resposta = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pessoa)
        });

        if (!resposta.ok) throw new Error('Falha na atualização');

        const atualizado = await resposta.json();
        limparFormulario();
        cpfBusca.value = '';
        mostrarMensagem(`Registro de ${atualizado.nome} ${atualizado.sobrenome} atualizado com sucesso!`, 'sucesso');
    } catch (erro) {
        console.error(erro);
        mostrarMensagem('Não foi possível atualizar o registro.', 'erro');
    }
});

document.getElementById('btnCancelar').addEventListener('click', () => {
    limparFormulario();
    mensagem.className = 'mensagem';
});

// Se a página foi aberta pela lista (GET) com ?cpf=..., já faz a busca
const cpfDaUrl = new URLSearchParams(window.location.search).get('cpf');
if (cpfDaUrl) {
    cpfBusca.value = cpfDaUrl;
    buscarPorCpf(cpfDaUrl);
}

// =============================================================
//  POST (Create) — cadastra uma nova pessoa no JSON Server
// =============================================================

// Endereço da API (mesmo servidor que entrega a página)
const API = '/api/pessoas';

const form = document.getElementById('formCadastro');
const mensagem = document.getElementById('mensagem');

// ---------- Máscaras simples de CPF e telefone ----------
document.getElementById('cpf').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
});

document.getElementById('telefone').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    e.target.value = v;
});

// Mostra uma mensagem de sucesso ou erro no topo do formulário
function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = 'mensagem ' + tipo;
    mensagem.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ---------- Envio do formulário ----------
form.addEventListener('submit', async (evento) => {
    // Impede o recarregamento da página
    evento.preventDefault();

    // Monta o objeto com os campos pedidos na atividade
    const pessoa = {
        cpf: document.getElementById('cpf').value.trim(),
        nome: document.getElementById('nome').value.trim(),
        sobrenome: document.getElementById('sobrenome').value.trim(),
        email: document.getElementById('email').value.trim(),
        idade: Number(document.getElementById('idade').value),
        telefone: document.getElementById('telefone').value.trim(),
        rua: document.getElementById('rua').value.trim(),
        bairro: document.getElementById('bairro').value.trim(),
        cidade: document.getElementById('cidade').value.trim(),
        estado: document.getElementById('estado').value,
        rg: document.getElementById('rg').value.trim()
    };

    if (pessoa.cpf.length !== 14) {
        mostrarMensagem('Digite o CPF completo (000.000.000-00).', 'erro');
        return;
    }

    try {
        // 1) Verifica se o CPF já está cadastrado (busca por CPF)
        const busca = await fetch(`${API}?cpf=${encodeURIComponent(pessoa.cpf)}`);
        const existentes = await busca.json();

        if (existentes.length > 0) {
            mostrarMensagem(`Já existe uma pessoa cadastrada com o CPF ${pessoa.cpf}.`, 'erro');
            return;
        }

        // 2) Envia o novo registro com o método POST
        const resposta = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pessoa)
        });

        if (!resposta.ok) throw new Error('Falha no cadastro');

        const criado = await resposta.json();

        // 3) Limpa o formulário e avisa o usuário
        form.reset();
        mostrarMensagem(`${criado.nome} ${criado.sobrenome} cadastrado(a) com sucesso! (ID ${criado.id})`, 'sucesso');
    } catch (erro) {
        console.error(erro);
        mostrarMensagem('Não foi possível cadastrar. Verifique se o servidor está rodando.', 'erro');
    }
});

const equip_nome = document.getElementById("nome");
const equip_tipo = document.getElementById("tipo");
const equip_marca = document.getElementById("marca");
const equip_problema = document.getElementById("problema");
const equip_status = document.getElementById("status");
const equip_cadastrados = document.getElementById("equipa_cadastrado");
const equip_id_edit = document.getElementById("equip_id_edit");

const btn_cadastro = document.getElementById("btn_cadastro");
const btn_cancelar = document.getElementById("btn_cancelar");
const input_id_busca = document.getElementById("id");

async function salvarEquipamento() {
    const idEdit = equip_id_edit.value;

    if (!equip_nome.value.trim()) {

        alert("Preencha o nome do equipamento.");
        return;
    }

    const dados = {
        nome: equip_nome.value,
        tipo: equip_tipo.value,
        marca: equip_marca.value,
        problema: equip_problema.value,
        status: equip_status.value
    };

    const url = idEdit ? `/equipamentos/${idEdit}` : "/equipamentos";

    const metodo = idEdit ? "PUT" : "POST";

    const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
        alert("Não foi possível salvar o equipamento.");
        return;
    }

    limparFormulario();
    atualizarTela();
}



async function buscarEquipamento() {
    const idBusca = input_id_busca.value.trim();

    if (!idBusca) {
        atualizarTela();
        
        return;
    }

    const resposta = await fetch(`/equipamentos/${idBusca}`);

    if (resposta.status === 404) {
        equip_cadastrados.innerHTML = "<p>Nenhum equipamento encontrado com esse ID.</p>";
        return;
    }

    const equipamento = await resposta.json();
    renderizarLista([equipamento]);
}





async function carregarParaEdicao(id) {
    const resposta = await fetch(`/equipamentos/${id}`);

    if (!resposta.ok) return;

    const eq = await resposta.json();

    equip_id_edit.value = eq.id;
    equip_nome.value = eq.nome;
    equip_tipo.value = eq.tipo;
    equip_marca.value = eq.marca;
    equip_problema.value = eq.problema;
    equip_status.value = eq.status;

    btn_cadastro.innerText = "Salvar Alteração";
    btn_cancelar.style.display = "inline-block";
}

async function excluirEquipamento(id) {
    if (!confirm(`Deseja realmente excluir o equipamento ID ${id}?`)) return;

    await fetch(`/equipamentos/${id}`, { method: "DELETE" });
    atualizarTela();
}

async function atualizarTela() {
    const resposta = await fetch("/equipamentos");
    const lista = await resposta.json();
    renderizarLista(lista);
}

function renderizarLista(lista) {
    equip_cadastrados.innerHTML = "";

    if (lista.length === 0) {
        equip_cadastrados.innerHTML = "<p>Nenhum equipamento cadastrado.</p>";
        return;
    }

    lista.forEach(eq => {
        equip_cadastrados.innerHTML += `
            <div class="card-equipamento" style="border: 1px solid #ccc; padding: 10px; margin-top: 10px;">
                <p><strong>ID:</strong> ${eq.id} | <strong>Nome:</strong> ${eq.nome}</p>
                <p><strong>Tipo:</strong> ${eq.tipo} | <strong>Marca:</strong> ${eq.marca}</p>
                <p><strong>Problema:</strong> ${eq.problema}</p>
                <p><strong>Status:</strong> ${eq.status}</p>
                <button type="button" onclick="carregarParaEdicao(${eq.id})">Editar</button>
                <button type="button" onclick="excluirEquipamento(${eq.id})">Excluir</button>
            </div>
        `;
    });
}

function limparFormulario() {
    document.getElementById("form_crud").reset();
    equip_id_edit.value = "";
    btn_cadastro.innerText = "Cadastrar";
    btn_cancelar.style.display = "none";
}

atualizarTela();

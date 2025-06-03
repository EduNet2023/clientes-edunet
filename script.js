const supabaseUrl = "https://gfvyskhitupcsbvmeyhf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdnlza2hpdHVwY3Nidm1leWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTM5NDUsImV4cCI6MjA2NDUyOTk0NX0.MBeZJQttItXz3-NCpupmwvGxUq0VxRZT7YouFcxwaJY";
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

const form = document.getElementById("cliente-form");
const tbody = document.getElementById("clientes-tbody");
const filtroBairro = document.getElementById("filtro-bairro");
const filtroDia = document.getElementById("filtro-dia");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cliente = {
    nome: form.nome.value,
    cpf: form.cpf.value,
    nascimento: form.nascimento.value,
    endereco: form.endereco.value,
    bairro: form.bairro.value,
    telefone: form.telefone.value,
    plano: form.plano.value,
    valor: parseFloat(form.valor.value),
    dia_pagamento: form.dia_pagamento.value,
  };
  await _supabase.from("clientes").insert(cliente);
  form.reset();
  carregarClientes();
});

async function carregarClientes() {
  let { data } = await _supabase.from("clientes").select("*").order("nome");
  if (filtroBairro.value)
    data = data.filter(c => c.bairro === filtroBairro.value);
  if (filtroDia.value)
    data = data.filter(c => c.dia_pagamento === filtroDia.value);

  const bairrosUnicos = [...new Set(data.map(c => c.bairro))];
  filtroBairro.innerHTML = '<option value="">Filtrar por Bairro</option>';
  bairrosUnicos.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    filtroBairro.appendChild(opt);
  });

  tbody.innerHTML = "";
  data.forEach(cliente => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="p-2">${cliente.nome}</td>
      <td class="p-2">${cliente.cpf}</td>
      <td class="p-2">${cliente.nascimento}</td>
      <td class="p-2">${cliente.endereco}</td>
      <td class="p-2">${cliente.bairro}</td>
      <td class="p-2">${cliente.telefone}</td>
      <td class="p-2">${cliente.plano}</td>
      <td class="p-2">R$ ${cliente.valor.toFixed(2)}</td>
      <td class="p-2">${cliente.dia_pagamento}</td>
      <td class="p-2">
        <button onclick="editarCliente(${cliente.id})" class="text-blue-500 hover:underline">Editar</button>
        <button onclick="deletarCliente(${cliente.id})" class="text-red-500 hover:underline ml-2">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deletarCliente(id) {
  if (confirm("Tem certeza que deseja excluir este cliente?")) {
    await _supabase.from("clientes").delete().eq("id", id);
    carregarClientes();
  }
}

async function editarCliente(id) {
  const { data } = await _supabase.from("clientes").select("*").eq("id", id).single();
  Object.keys(data).forEach(key => {
    if (form[key]) form[key].value = data[key];
  });
  await _supabase.from("clientes").delete().eq("id", id);
}

filtroBairro.addEventListener("change", carregarClientes);
filtroDia.addEventListener("change", carregarClientes);
window.addEventListener("load", carregarClientes);
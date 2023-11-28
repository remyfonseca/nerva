/* elementos e variáveis globais */


const btnAdicionarTarefa = document.getElementById('btn-adicionar-tarefa');
const navTarefas = document.getElementById('nav-tarefas');
let listaTarefasArray = [];
let tarefasFiltradas = [];
let filtroTarefas = 'todas';

/* funções localStorage */
const salvarTarefas = () => {
  const listaTarefasJson = JSON.stringify(listaTarefasArray);
  localStorage.setItem('listaTarefas', listaTarefasJson);
};

const obterTarefas = () => JSON.parse(localStorage.getItem('listaTarefas')) || [];

// adicionar uma nova tarefa
btnAdicionarTarefa.addEventListener('click', (evento) => {
  evento.preventDefault();

  // obter o texto e a data da tarefa dos inputs
  const formTarefa = document.getElementById('adicionar-tarefa-form');
  const textoTarefa = document.getElementById('texto-tarefa').value;
  const dataTarefa = document.getElementById('data-tarefa').value;
  const isTarefaEstudo = document.getElementById('tarefa-estudo').checked;

  // se o texto e a data não estiverem vazios
  if (textoTarefa && dataTarefa) {
    // criar um novo objeto de tarefa
    const tarefa = {
      texto: textoTarefa,
      data: dataTarefa,
      estado: 'pendente',
      id: new Date().getTime(),
      isEstudo: isTarefaEstudo,
    };

    // adicionar a tarefa à array
    listaTarefasArray = [...listaTarefasArray, tarefa];

    // salvar e carregar as tarefas
    salvarTarefas();
    if (filtroTarefas === 'todas') {
      carregarTarefas();
    } else {
      filtrarTarefas(filtroTarefas);
    }

    // resetar o formulário
    document.getElementById('texto-tarefa').value = '';
    document.getElementById('data-tarefa').value = '';
    formTarefa.reset();
  }
});

// carregar tarefas
const carregarTarefas = (filtro, tarefasFiltradas) => {
  const listaTarefas = ordenarTarefas(tarefasFiltradas);
  const listaTarefasElemento = document.getElementById('lista-tarefas');
  listaTarefasElemento.innerHTML = '';

  if (listaTarefas.length === 0) {
    // se não houver tarefas, exibir uma mensagem de lista vazia
    const mensagemListaVazia = filtro
      ? `Nenhuma tarefa(s) ${filtro}!`
      : `Nenhuma tarefa adicionada(s)!`;
    listaTarefasElemento.innerHTML = `<p style="text-align:center;">${mensagemListaVazia}</p>`;
  } else {
    // se a lista não estiver vazia, percorrer cada tarefa
    listaTarefas.forEach((tarefa) => {
      // criar um item de lista e definir seu id e classe de dataset
      const elementoTarefa = document.createElement('li');
      elementoTarefa.dataset.id = tarefa.id;
      elementoTarefa.classList = tarefa.estado;

      // criar o HTML para a tarefa e adicioná-lo ao item da lista
      const elementoTarefaHtml = criarElementoTarefa(tarefa);
      elementoTarefa.innerHTML = elementoTarefaHtml;
      listaTarefasElemento.appendChild(elementoTarefa);
    });
  }
};

// ordenar tarefas por data
const ordenarTarefas = (tarefasFiltradas) => {
  const listaTarefas = tarefasFiltradas ? tarefasFiltradas : obterTarefas();
  listaTarefasArray = obterTarefas();

  listaTarefas.sort((a, b) => {
    // comparar os estados
    if (a.estado === b.estado) {
      // se os estados forem iguais, comparar as datas
      return new Date(a.data) - new Date(b.data);
    } else {
      // se os estados forem diferentes, as tarefas concluídas vêm por último
      return a.estado === 'completas' ? 1 : -1;
    }
  });

  return listaTarefas;
};

// criar o elemento da tarefa
const criarElementoTarefa = (tarefa) => {
  const hoje = new Date().setHours(0, 0, 0, 0);
  const atrasada =
    dateStringToDate(formatDate(tarefa.data)) < hoje && tarefa.estado === 'pendente';
  const classeDataTarefa = atrasada ? 'data-tarefa atrasada' : 'data-tarefa';
  const classeIconeBotaoTarefa = tarefa.estado === 'pendente' ? 'fa-circle' : 'fa-circle-check';
  const btnEstudo = tarefa.isEstudo ? `<div class="btnEstudo">
  <a href="../nervaFocus/nervaFocus.html" target="_blank" class="linkEstudo">NervaFocus</a>
</div>` : '';
  return `
    <div class="tarefa">
      <button class="botao-tarefa"><i class="fa-regular ${classeIconeBotaoTarefa}"></i></button>
      <div>
        <p class="texto-tarefa">${tarefa.texto}</p>
        <span class="${classeDataTarefa}">${formatDate(tarefa.data)} </span>
        
      </div>
    </div>
     ${btnEstudo}
    <button class="botao-excluir"><i class="fa-solid fa-trash"></i></button>
  `;
};

document.body.addEventListener('click', (evento) => {
  if (evento.target.closest('.botao-tarefa')) {
    const elementoTarefa = evento.target.closest('li');
    alternarEstadoTarefa(elementoTarefa);
  }
  if (evento.target.closest('.botao-excluir')) {
    const elementoTarefa = evento.target.closest('li');
    excluirTarefa(elementoTarefa);
  }
});

const alternarEstadoTarefa = (elementoTarefa) => {
  const tarefa = listaTarefasArray.find((tarefa) => tarefa.id === Number(elementoTarefa.dataset.id));

  if (tarefa.estado === 'pendente') {
    tarefa.estado = 'completas';
    elementoTarefa.classList = 'completas';
    elementoTarefa.querySelector('.fa-regular').classList = 'fa-regular fa-circle-check';
  } else if (tarefa.estado === 'completas') {
    tarefa.estado = 'pendente';
    elementoTarefa.classList = 'pendente';
    elementoTarefa.querySelector('.fa-regular').classList = 'fa-regular fa-circle';
  }

  salvarTarefas();
};

const excluirTarefa = (elementoTarefa) => {
  let tarefas = tarefasFiltradas.length > 0 ? tarefasFiltradas : listaTarefasArray;

  tarefas = tarefas.filter((tarefa) => tarefa.id !== Number(elementoTarefa.dataset.id));
  listaTarefasArray = listaTarefasArray.filter((tarefa) => tarefa.id !== Number(elementoTarefa.dataset.id));

  salvarTarefas();
  carregarTarefas(filtroTarefas, tarefas);
};


navTarefas.addEventListener('click', (evento) => {
  const botoesNav = navTarefas.querySelectorAll('button');

  botoesNav.forEach((botao) => botao.classList = '');

  const botao = evento.target.closest('button');

  if (botao) {
    botao.classList = 'ativo';
    const filtro = botao.dataset.filter;
    filtrarTarefas(filtro);
  }
});

const filtrarTarefas = (filtro) => {
  filtroTarefas = filtro;
  const hoje = new Date().setHours(0, 0, 0, 0);

  switch (filtro) {
    case 'hoje':
      tarefasFiltradas = obterTarefasHoje(hoje);
      carregarTarefas(filtro, tarefasFiltradas);
      break;

    case 'atrasadas':
      tarefasFiltradas = obterTarefasAtrasadas(hoje);
      carregarTarefas(filtro, tarefasFiltradas);
      break;

    case 'agendadas':
      tarefasFiltradas = obterTarefasAgendadas(hoje);
      carregarTarefas(filtro, tarefasFiltradas);
      break;

    case 'pendentes':
      tarefasFiltradas = obterTarefasEstado('pendente');
      carregarTarefas(filtro, tarefasFiltradas);
      break;

    case 'estudos':
      tarefasFiltradas = obterTarefasEstudos();
      carregarTarefas(filtro, tarefasFiltradas);
      break;

    case 'completas':
      tarefasFiltradas = obterTarefasEstado('completas');
      carregarTarefas(filtro, tarefasFiltradas);
      break;

    case 'todas':
    default:
      tarefasFiltradas = [];
      carregarTarefas();
      break;
  }
};

const obterTarefasHoje = () => {
  const hoje = new Date().setHours(0, 0, 0, 0);
  const tarefasHoje = listaTarefasArray.filter(
    (tarefa) =>
      dateStringToDate(formatDate(tarefa.data)).setHours(0, 0, 0, 0) === hoje &&
      tarefa.estado === 'pendente'
  );

  return tarefasHoje;
};


const obterTarefasAtrasadas = (hoje) => {
  const tarefasAtrasadas = listaTarefasArray.filter(
    (tarefa) =>
      dateStringToDate(formatDate(tarefa.data)) < hoje &&
      tarefa.estado === 'pendente'
  );

  return tarefasAtrasadas;
};

const obterTarefasAgendadas = (hoje) => {
  const tarefasAgendadas = listaTarefasArray.filter(
    (tarefa) =>
      dateStringToDate(formatDate(tarefa.data)) > hoje &&
      tarefa.estado === 'pendente'
  );

  return tarefasAgendadas;
};

const obterTarefasEstado = (estado) => {
  const tarefasEstado = listaTarefasArray.filter((tarefa) => tarefa.estado === estado);
  return tarefasEstado;
};

const obterTarefasEstudos = () => {
  const tarefasEstudo = listaTarefasArray.filter(tarefa => tarefa.isEstudo);
  return tarefasEstudo;
};

const dateStringToDate = (dataString) => {
  const [dia, mes, ano] = dataString.split('/');
  return new Date(ano, mes - 1, dia);
};

const formatDate = (dataTarefa) => {
  const data = new Date(dataTarefa);
  const dia = String(data.getDate() + 1).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
};



carregarTarefas();
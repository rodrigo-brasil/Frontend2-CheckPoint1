import data from './data.js';

/* Refencias para os elementos */
const overlay = document.querySelector('.overlay');
const div_forms = document.getElementById('forms');
const div_login = document.getElementById('login');
const div_grupo = document.getElementById('grupo');
const cardsContainer = document.getElementById('cards-container');
const btnAdd = document.getElementById('addCard');
const btnFormCardCancel = document.getElementById('addCardCancel');
const btnRemoverCard = document.getElementById('removerCard');
const btnGrupo = document.getElementById('grupoBtn')
const searchInput = document.getElementById('searchInput');
const btnFilter = document.getElementById('filter');
const filterModal = document.getElementById('filterModal');
const btnUser = document.getElementById('user');
const btnLoginCancel = document.getElementById('loginCancel');

/* Funções Gerais */

/* Function que cria e adicionar o html do card no document */
function renderizarCard({ titulo, descricao, urlImg, cidade, rating, jaEstive }) {
  let avaliacao = '';
  rating = rating || 0;
  rating = jaEstive == 'true' ? rating : 0;
  if (jaEstive == 'true' && rating > 0) {
    avaliacao = '<div class="">';
    for (let index = 0; index < rating; index++) {
      avaliacao += `<i class="fas fa-star"></i>`;
    }
    avaliacao += '</div>';
  }
  else {
    avaliacao = `<i class="fas fa-plane-departure"></i>`
  }

  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-grupo', rating);
  card.innerHTML = `
  <div class="card-body">
    <img src="${urlImg}" alt="" />
  </div>
  <div class="card-description">
    <div class="title">
      <div class="flex">
        <h5>${cidade}</h5>
        ${avaliacao}
      </div>
        <h4>${titulo}</h4>
    </div>
    <p>${descricao}</p>
  </div>
  `
  const btnDelete = criarButtaoDelete()
  card.appendChild(btnDelete)
  cardsContainer.appendChild(card);
}

/* function que cria o butão de deletar o card e adiciona o evento  */
function criarButtaoDelete() {
  const div = document.createElement('div')
  div.classList.add('deletBtn')
  const btn = document.createElement('button')
  btn.innerHTML = `
  <span>Remover</span>
  <div class="icon">
  <i class="far fa-trash-alt"></i>
  </div>`;
  btn.addEventListener('click', () => {
    div.parentElement.remove()
  })
  div.append(btn);
  return div
}

/* function que fecha o forms */
function fecharForms(form) {
  overlay.classList.remove('show');
  form.classList.remove('show');
}

/* function que remover a classe que exibe o butão de deletar card */
function removerDeletarCard() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cards-container')) {
      const todosCards = Array.from(cardsContainer.querySelectorAll('.card'));
      todosCards.forEach(card => card.classList.remove('remover'))
    }
  }, { once: true })
}

/* function que altera a classe e mensagem de validação de inputs */
function mudarClassError(elemento, status, textError = '') {
  if (status) {
    elemento.classList.remove('input-error');
    elemento.parentElement.querySelector('.error-message').innerText = textError
  } else {
    elemento.classList.add('input-error');
    elemento.parentElement.querySelector('.error-message').innerText = textError
  }
}

/* function para validar o forms */
function formValidador(form) {
  const inputs = Array.from(form.querySelectorAll('input:not([type=radio])'));
  inputs.forEach(input => {
    if (input.value == '') {
      mudarClassError(input, false, 'Campo em branco!')
    }
    else {
      mudarClassError(input, true)
    }
  })
  const valido = inputs.every(input => input.value);
  return valido;
}

/* function para filtrar os cards pelas palavras */
function searchCard() {
  let txtValue, filter;

  filter = searchInput.value.toUpperCase();
  const cards = Array.from(document.getElementsByClassName('card'));

  cards.forEach(card => {
    txtValue = card.textContent || card.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

/* function para filtrar os cards pelos status de rating */
function filter(filtro) {
  const cards = Array.from(document.getElementsByClassName('card'));
  cards.forEach(card => {
    if (card.dataset.grupo == filtro) {
      card.style.display = "flex";
    } else if (filtro == -1) {
      card.style.display = "flex";
    }
    else {
      card.style.display = "none";
    }
  })
}

function fecharModais() {
  overlay.classList.remove('show');
  div_forms.classList.remove('show');
  div_login.classList.remove('show');
  div_grupo.classList.remove('show');
  Array.from(document.querySelectorAll('form')).forEach(form => form.reset());
  const todosCards = Array.from(cardsContainer.querySelectorAll('.card'));
  todosCards.forEach(card => card.classList.remove('remover'));
}


/* Listeners */
searchInput.addEventListener('keyup', searchCard);

btnFilter.addEventListener('click', () => {
  let width = 0
  Array.from(document.querySelectorAll('Header>div>div')).forEach(div => width += div.clientWidth);
  filterModal.style.width = width + 'px';
  filterModal.classList.toggle('hidden');
})

filterModal.querySelector('.cancel-button').addEventListener('click', () => {
  filterModal.classList.toggle('hidden');
})

filterModal.querySelector('.apply-button').addEventListener('click', () => {
  filterModal.classList.toggle('hidden');
  var e = document.getElementById("filterSelect");
  var selectValue = e.value;
  filter(selectValue);
})

div_forms.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (formValidador(div_forms)) {
    const form = e.target;
    const formData = new FormData(form);
    const obj = {};
    for (let [key, value] of formData.entries()) {
      obj[key] = value;
    }
    renderizarCard(obj);
    e.target.reset();
    fecharForms(div_forms);
  }
});

div_login.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (formValidador(div_login)) {
    e.target.reset();
    fecharForms(div_login);
  }
});

btnFormCardCancel.addEventListener('click', (e) => {
  Array.from(document.getElementsByClassName('input-error')).forEach(input => input.classList.remove('input-error'));
  Array.from(document.getElementsByClassName('error-message')).forEach(input => input.innerText = '');
  fecharForms(div_forms)
})

btnLoginCancel.addEventListener('click', (e) => {
  Array.from(document.getElementsByClassName('input-error')).forEach(input => input.classList.remove('input-error'));
  Array.from(document.getElementsByClassName('error-message')).forEach(input => input.innerText = '');
  fecharForms(div_login)
})

Array.from(div_forms.querySelector('form').querySelectorAll('input:not([type=radio])')).forEach(input => {
  input.addEventListener('input', (e) => {
    if (e.target.value == '') {
      e.target.classList.add('input-error');
      e.target.parentElement.querySelector('.error-message').innerText = 'Campo em branco!'
    }
    else {
      e.target.classList.remove('input-error');
      e.target.parentElement.querySelector('.error-message').innerText = ''
    }
  })
})

Array.from(div_login.querySelector('form').querySelectorAll('input')).forEach(input => {
  input.addEventListener('input', (e) => {
    if (e.target.value == '') {
      e.target.classList.add('input-error');
      e.target.parentElement.querySelector('.error-message').innerText = 'Campo em branco!'
    }
    else {
      e.target.classList.remove('input-error');
      e.target.parentElement.querySelector('.error-message').innerText = ''
    }
  })
})

btnAdd.addEventListener('click', () => {
  fecharModais();
  overlay.classList.add('show');
  div_forms.classList.add('show');
})

btnUser.addEventListener('click', () => {
  fecharModais();
  overlay.classList.add('show');
  div_login.classList.add('show');
})

overlay.addEventListener('click', () => {
  fecharModais();
})

btnRemoverCard.addEventListener('click', (e) => {
  const todosCards = Array.from(cardsContainer.querySelectorAll('.card'));
  todosCards.forEach(card => card.classList.toggle('remover'));
  setTimeout(removerDeletarCard, 500);
})

btnGrupo.addEventListener('click', () => {
  overlay.classList.add('show');
  div_grupo.classList.add('show');
})

document.querySelector('.radio input[type=radio]#been').addEventListener('click', (e) => {
  if (e.target.checked)
    document.getElementById('avaliacao').style.visibility = "visible";
  else
    document.getElementById('avaliacao').style.visibility = "hidden";
});
document.querySelector('.radio input[type=radio]#wish').addEventListener('click', (e) => {
  if (e.target.checked)
    document.getElementById('avaliacao').style.visibility = "hidden";
  else
    document.getElementById('avaliacao').style.visibility = "visible";
});

/* inicializar data */
data.forEach(data => renderizarCard(data));
let seuVotoPara = document.querySelector(".d-1-1 span");
let cargo = document.querySelector(".d-1-2 span");
let descricao = document.querySelector(".d-1-4");
let aviso = document.querySelector(".d-2");
let lateral = document.querySelector(".d-1-right");
let numeros = document.querySelector(".d-1-3");
const teclaUrna = document.querySelector(".audio--tecla");
const confirmaUrna = document.querySelector(".audio--confirma");

let etapaAtual = 0;
let numero = "";
let votoBranco = false;
let votos = [];

function comecarEtapa() {
  let etapa = etapas[etapaAtual];

  let numeroHtml = "";
  numero = "";
  votoBranco = false;

  for (let i = 0; i < etapa.numeros; i++) {
    if (i === 0) {
      numeroHtml += '<div class="number pisca"></div>';
    } else {
      numeroHtml += '<div class="number"></div>';
    }
  }

  seuVotoPara.style.display = "none";
  cargo.innerHTML = etapa.titulo;
  descricao.innerHTML = "";
  aviso.style.display = "none";
  lateral.innerHTML = "";
  numeros.innerHTML = numeroHtml;
}

function atualizaInterface() {
  let etapa = etapas[etapaAtual];
  let candidato = etapa.candidatos.filter((item) => {
    if (item.numero === numero) {
      return true;
    } else {
      return false;
    }
  });

  if (candidato.length > 0) {
    candidato = candidato[0];
    seuVotoPara.style.display = "block";
    aviso.style.display = "block";
    cargo.innerHTML = `Nome: ${candidato.nome}<br/> Partido: ${candidato.partido}`;
    let fotosHtml = "";
    for (let i in candidato.fotos) {
      if (candidato.fotos[i].small) {
        fotosHtml += `<div class="d-1-image small"><img src="./img/${candidato.fotos[i].url}" alt=""/>${candidato.fotos[i].legenda}</div>`;
      } else {
        fotosHtml += `<div class="d-1-image"><img src="./img/${candidato.fotos[i].url}" alt=""/>${candidato.fotos[i].legenda}</div>`;
      }
    }
    lateral.innerHTML = fotosHtml;
  } else {
    seuVotoPara.style.display = "block";
    aviso.style.display = "block";
    descricao.innerHTML = '<div class="come pisca">VOTO NULO</div>';
  }
}

function clicou(n) {
  let elNumero = document.querySelector(".number.pisca");
  const confirmaUrna = document.querySelector(".audio--confirma");
  teclaUrna.play();
  if (elNumero !== null) {
    elNumero.innerHTML = n;
    numero = `${numero}${n}`;

    elNumero.classList.remove("pisca");
    if (elNumero.nextElementSibling !== null) {
      elNumero.nextElementSibling.classList.add("pisca");
    } else {
      atualizaInterface();
    }
  }
}

function branco() {
  teclaUrna.play();
  numero = "";
  votoBranco = true;
  seuVotoPara.style.display = "block";
  aviso.style.display = "block";
  numeros.innerHTML = "";
  descricao.innerHTML = '<div class="come pisca">VOTO EM BRANCO</div>';
  lateral.innerHTML = "";
}

function corrige() {
  teclaUrna.play();
  comecarEtapa();
}

function confirma() {
  let etapa = etapas[etapaAtual];
  teclaUrna.play();

  let votoConfirmado = false;

  if (votoBranco === true) {
    votoConfirmado = true;
    votos.push({
      etapa: etapas[etapaAtual].titulo,
      voto: "branco",
    });
  } else if (numero.length === etapa.numeros) {
    votoConfirmado = true;
    votos.push({
      etapa: etapas[etapaAtual].titulo,
      voto: numero,
    });
  }

  if (votoConfirmado) {
    etapaAtual++;
    if (etapas[etapaAtual] !== undefined) {
      comecarEtapa();
    } else {
      let barra = document.querySelector("#barra");
      barra.style.display = "block";

      let barraAnimada = document.querySelector("#barra--animada");
      let width = 1;

      aviso.style.display = "none";
      descricao.innerHTML = "";
      seuVotoPara.style.display = "none";
      numeros.innerHTML = "";
      lateral.innerHTML = "";
      cargo.innerHTML = "";
      let i = setInterval(animacao, 10);
      function animacao() {
        if (width >= 100) {
          let gravacao = document.querySelector("#gravacao");

          clearInterval(i);
          barra.style.display = "none";
          gravacao.style.display = "none";

          document.querySelector(".tela").innerHTML =
            '<div class="aviso--gigante pisca">FIM</div>';
        } else {
          width++;
          barraAnimada.style.width = `${width}%`;
          gravacao.style.display = "flex";
        }
      }
      setTimeout(()=>{
        confirmaUrna.play();
      }, 1000)

    }
    console.log(votos);
  }
}

comecarEtapa();

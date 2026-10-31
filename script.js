(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Armazenamento seguro (pode falhar em modo privado) */
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* Data e ano */
  var hoje = new Date();
  $('#ano').textContent = hoje.getFullYear();
  $('#dataAtual').textContent = hoje.toLocaleDateString('pt-BR');
  $('#data').min = hoje.toISOString().split('T')[0];

  /* Menu mobile */
  var btn = $('#menuBtn'), nav = $('#nav');
  btn.addEventListener('click', function () {
    var aberto = nav.classList.toggle('aberto');
    btn.setAttribute('aria-expanded', aberto);
    btn.textContent = aberto ? '✕' : '☰';
  });
  $$('a', nav).forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('aberto');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    });
  });

  /* Ícones interativos do hero */
  var msg = $('#bolhaMsg');
  $$('.bolha').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.bolha').forEach(function (x) { x.classList.remove('ativa'); });
      b.classList.add('ativa');
      msg.textContent = b.dataset.msg;
    });
  });

  /* Filtro de produtos */
  var filtros = $$('.filtro'), cards = $$('.card');
  filtros.forEach(function (f) {
    f.addEventListener('click', function () {
      filtros.forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-selected', 'false'); });
      f.classList.add('on');
      f.setAttribute('aria-selected', 'true');
      cards.forEach(function (c) {
        c.hidden = !(f.dataset.f === 'todos' || c.dataset.c === f.dataset.f);
      });
    });
  });

  /* FAQ: abre um por vez */
  var ds = $$('.faq details');
  ds.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) ds.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* Formulário: valida e abre o e-mail com a mensagem pronta */
  var form = $('#form'), erro = $('#erro');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = $('#nome').value.trim(), tel = $('#tel').value.trim(),
        tipo = $('#tipo').value, data = $('#data').value, det = $('#msg').value.trim();
    var digitos = tel.replace(/\D/g, '');
    var problema = '';
    if (nome.length < 3) problema = 'Informe seu nome completo.';
    else if (digitos.length < 10 || digitos.length > 11) problema = 'Informe um telefone com DDD, por exemplo (69) 90000-0000.';
    else if (!tipo) problema = 'Escolha o tipo de produto.';
    else if (!data) problema = 'Escolha a data desejada.';
    else if (!$('#aceite').checked) problema = 'Para enviar, aceite a Política de Privacidade.';
    if (problema) { erro.textContent = problema; erro.hidden = false; return; }
    erro.hidden = true;
    var dt = data.split('-').reverse().join('/');
    var corpo = 'Nome: ' + nome + '\nTelefone: ' + tel + '\nProduto: ' + tipo +
                '\nData desejada: ' + dt + '\nDetalhes: ' + (det || 'Não informado');
    window.location.href = 'mailto:monythaylla3026@gmail.com?subject=' +
      encodeURIComponent('Encomenda - ' + tipo + ' - ' + dt) + '&body=' + encodeURIComponent(corpo);
  });

  /* Máscara de telefone */
  $('#tel').addEventListener('input', function (e) {
    var v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4);
    else if (v.length > 2) v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    e.target.value = v;
  });

  /* Voltar ao topo + sombra do cabeçalho */
  var subir = $('#subir'), topo = $('#topo');
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    subir.hidden = y < 500;
    topo.classList.toggle('sombra', y > 10);
  }, { passive: true });
  subir.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* Banner de cookies (consentimento) */
  var banner = $('#cookies');
  function escolher(valor) {
    store.set('cookies_consent', valor);
    banner.hidden = true;
    document.dispatchEvent(new CustomEvent('consentimento', { detail: valor }));
    /* Se usar Google Ads/Analytics, carregue as tags somente quando valor === 'todos'. */
  }
  if (!store.get('cookies_consent')) banner.hidden = false;
  $('#cookAceitar').addEventListener('click', function () { escolher('todos'); });
  $('#cookRecusar').addEventListener('click', function () { escolher('essenciais'); });
  $('#reabrirCookies').addEventListener('click', function () { banner.hidden = false; });
})();

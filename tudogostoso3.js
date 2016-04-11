'use strict';
const re = /\/receita\/([0-9]+)-([\w-]+)\.html$/i;
const urls = [
  'http://www.tudogostoso.com.br/',
  'http://www.tudogostoso.com.br/categorias/bolos-e-tortas-doces.php',
  'http://www.tudogostoso.com.br/receita/179236-petit-gateau-de-nutella-perfeito.html'
];
for (let url of urls) {
  if (re.test(url)) {
    console.log(url + ' é uma receita.');
  } else {
    console.log(url + ' não é uma receita');
  }
}

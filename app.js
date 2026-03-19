const fs = require("fs");

const raw = fs.readFileSync("data/vendas.json", "utf-8");
const vendas = JSON.parse(raw);

const vendasVazias = [];


/* Função 1 - Filtrar por Valor Minimo */

const filtrarPorValorMinimo = (valorMinimo) => (vendas) =>
    vendas.filter(venda => venda.valor >= valorMinimo);

const filtrarAcimaDe4000 = filtrarPorValorMinimo(4000);
const filtrarAcimaDe1000 = filtrarPorValorMinimo(1000);


/* Função 2 - Filtrar por Categoria */

const filtrarPorCategoria = (categoria) => (vendas) =>
    vendas.filter(venda => venda.categoria === categoria);

const filtrarTech = filtrarPorCategoria("tech");
const filtrarMonitores = filtrarPorCategoria("monitores");



/* Função 3 - Resumir Lista {produto, valor, categoria} */




/* Função 4 - Total Por Categoria {Tech: 4200, moveis: 850} */



/* Função 5 - ordernar Por Valor [Sem mutar]*/
/*
const ordenarPorEconomia = (vendedores) => 
    [...vendedores].sort((a, b) => b.economiaTotal - a.economiaTotal);
*/

const ordenarPorValor = (vendas) => 
    [...vendas].sort((a, b) => b.valor - a.valor)

const vendasOrdenadas = ordenarPorValor(vendas);

console.log(vendasOrdenadas);







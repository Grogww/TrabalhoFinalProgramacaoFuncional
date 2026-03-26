const fs = require("fs");

const raw = fs.readFileSync("data/vendas.json", "utf-8");
const vendas = JSON.parse(raw);

/* Função 1 - Filtrar por Valor Minimo */

const filtrarPorValorMinimo = (valorMinimo) => (vendas) =>
    vendas.filter(venda => venda.valor >= valorMinimo);


/* Função 2 - Filtrar por Categoria */

const filtrarPorCategoria = (categoria) => (vendas) =>
    vendas.filter(venda => venda.categoria === categoria);



/* Função 3 - Resumir Lista {produto, valor, categoria} */
const resumirVendas = (vendas) =>
    vendas.map(venda => ({
        produto: venda.produto,
        valor: venda.valor,
        categoria: venda.categoria
    }))


/* Função 4 - Total Por Categoria {Tech: 4200, moveis: 850} */
const totalPorCategoria = (vendas) =>
    vendas.reduce((acc, venda) => ({
        ...acc,
        [venda.categoria]: (acc[venda.categoria] || 0) + venda.valor
    }), []);


/* Função 5 - ordernar Por Valor [Sem mutar]*/

const ordenarPorValor = (vendas) => 
    vendas.toSorted((a, b) => b.valor - a.valor)

const vendasOrdenadas = ordenarPorValor(vendas);



/* ========= TESTES =========== */

const vendasVazias = [];
const vendaUnica = [{ id: 1, produto: 'Notebook', valor: 3200, categoria: 'tech', vendedor: 'Ana', data: '2024-03-15' }];


/* Função 1 - Filtrar por Valor Minimo */

console.assert(
    filtrarPorValorMinimo(4000)(vendas).every(v => v.valor >= 4000),
    'Erro F1: [vendas] deve retornar apenas vendas acima do mínimo'
);
console.assert(
    filtrarPorValorMinimo(9999)(vendasVazias).length === 0,
    'Erro F1: [vendasVazias] deve retornar array vazio'
);
console.assert(
    filtrarPorValorMinimo(1000)(vendaUnica).length === 1,
    'Erro F1: [vendaUnica] deve retornar o item quando ele passa no filtro'
);


/* Função 2 - Filtrar por Categoria */

console.assert(
    filtrarPorCategoria('tech')(vendas).every(v => v.categoria === 'tech'),
    'Erro F2: [vendas] deve retornar apenas itens da categoria correta'
);
console.assert(
    filtrarPorCategoria('inexistente')(vendasVazias).length === 0,
    'Erro F2: [vendasVazias] deve retornar array vazio'
);
console.assert(
    filtrarPorCategoria('tech')(vendaUnica).length === 1,
    'Erro F2: [vendaUnica] deve retornar o item quando a categoria bate'
);


/* Função 3 - Resumir Lista {produto, valor, categoria} */

console.assert(
    resumirVendas(vendas).every(v =>
        Object.keys(v).length === 3 &&
        'produto' in v && 'valor' in v && 'categoria' in v
    ),
    'Erro F3: [vendas] deve retornar objetos com exatamente 3 campos'
);
console.assert(
    resumirVendas(vendasVazias).length === 0,
    'Erro F3: [vendasVazias] deve retornar array vazio'
);
console.assert(
    resumirVendas(vendaUnica).length === 1 && Object.keys(resumirVendas(vendaUnica)[0]).length === 3,
    'Erro F3: [vendaUnica] deve retornar array com um objeto de 3 campos'
);


/* Função 4 - Total Por Categoria */

console.assert(
    typeof totalPorCategoria(vendas) === 'object' && !Array.isArray(totalPorCategoria(vendas)),
    'Erro F4: [vendas] deve retornar um objeto, não um array'
);
console.assert(
    Object.keys(totalPorCategoria(vendasVazias)).length === 0,
    'Erro F4: [vendasVazias] deve retornar objeto vazio'
);
console.assert(
    totalPorCategoria(vendaUnica)['tech'] === 3200,
    'Erro F4: [vendaUnica] deve retornar o valor correto para a categoria'
);


/* Função 5 - Ordenar Por Valor */

const original = [...vendas];
ordenarPorValor(vendas);
console.assert(
    vendas[0].produto === original[0].produto,
    'Erro F5: [vendas] não deve mutar o array original'
);
console.assert(
    ordenarPorValor(vendas)[0].valor >= ordenarPorValor(vendas)[1].valor,
    'Erro F5: [vendas] o primeiro elemento deve ter valor maior ou igual ao segundo'
);
console.assert(
    ordenarPorValor(vendasVazias).length === 0,
    'Erro F5: [vendasVazias] deve retornar array vazio'
);
console.assert(
    ordenarPorValor(vendaUnica)[0].produto === 'Notebook',
    'Erro F5: [vendaUnica] deve retornar o único item intacto'
);


/* ======================== Estruturas Pipeline ================================== */

const pipe = (...fns) =>
    (valor) =>
        fns.reduce((acc, fn) => fn(acc), valor);


// Pipeline 1
const faturamentoCategoriasPremium = pipe(
    filtrarPorValorMinimo(750),
    resumirVendas,
    totalPorCategoria
);

console.log(faturamentoCategoriasPremium(vendas))


// Pipeline 2
const totalPorVendedor = (vendas) =>
    vendas.reduce((acc, venda) => ({
        ...acc,
        [venda.vendedor]: (acc[venda.vendedor] || 0) + venda.valor
    }), []);

const ordenarAgregadoPorValor = (vendasAgregado) =>
    Object.entries(vendasAgregado)
        .map(([nome, total]) => ({ nome, total }))
        .toSorted((a, b) => b.total - a.total);

const receitaPorVendedorEmTech = pipe(
    filtrarPorCategoria('tech'),
    totalPorVendedor,
    ordenarAgregadoPorValor
);

console.log(receitaPorVendedorEmTech(vendas))

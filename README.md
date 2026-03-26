# Sistema de Análise de Vendas — Programação Funcional
> Projeto Prático PBL · Linguagem Funcional · 5ª Fase

---

## Problema Norteador

Uma loja de e-commerce precisa de relatórios de vendas, mas seu sistema atual usa loops, variáveis globais e mutações espalhadas — impossível testar, difícil de manter.

O objetivo deste projeto é reescrever o sistema de análise usando apenas o paradigma funcional, de forma que o código seja tão legível que qualquer desenvolvedor consiga entender o que cada análise faz só de ler uma linha.

---

## Aula 1 — Funções de Transformação

### Análise do Dataset

Cada objeto de venda possui os seguintes campos:

| Campo | Descrição |
|---|---|
| `id` | Identificador único |
| `produto` | Nome do produto |
| `valor` | Valor da venda |
| `categoria` | Categoria do produto |
| `data` | Data da venda |
| `vendedor` | Nome do vendedor responsável |

### Perguntas de Negócio

Com esses campos podemos conseguir alguns dados valiosos sobre o modelo de negócios, como insights:

- **Por Produto** — Maior quantidade de vendas e maior valor vendido
- **Por Categoria** — Identificar quais categorias possuem maior rendimento ou maior movimentação
- **Por Vendedor** — Identificar as vendas, valor total e quantidade de cada vendedor
- **Por Período** — Agrupamento por período de datas
- **Ticket Médio** — Por vendedor

### Pseudocódigo Imperativo

Resolvendo esse problema com looping teríamos algumas estruturas parecidas com a seguinte:

```
Function filtrarPorCategoria(categoria, vendas)
    Criar lista resultado (vazia)

    For venda In vendas Do
        If venda.Categoria === categoria Then
            listaResultado.push(venda)
        End If
    Next

    Return listaResultado
End Function
```

### Problemas do Paradigma Imperativo

Os problemas que podem ser encontrados ao tentar utilizar o paradigma imperativo podem ser: **testabilidade e clareza** principalmente. Um código dependente de estado pode ser uma armadilha no momento do *debug* e, devido à grande extensão das suas funções, pode apresentar dificuldade maior na leitura do código.

### Decisões de Implementação

| Função | Método utilizado | Justificativa |
|---|---|---|
| `filtrarPorValorMinimo` / `filtrarPorCategoria` | `.filter` | Filtro simples já proporcionado pelo objeto Array |
| `resumirVendas` | `.map` | O objetivo é apenas resumir cada objeto em relação 1:1 — não reduzir o array de N:1 |
| `totalPorCategoria` | `.reduce` | Realiza uma agregação simples de valor e mantém a chave `categoria` |
| `ordenarPorValor` | `.toSorted` | Faz a ordenação sem mutar o array original — `.sort` faz a mutação |

### O que é uma Função Pura?

Utilizando o paradigma funcional podemos atribuir funções a variáveis, que ficarão guardadas no contexto até serem liberadas. A partir da atribuição é possível chamar a função através da variável, isso pode ser útil para códigos desacoplados e com alto reaproveitamento.

```javascript
let variavelComFuncao = () =>
    // função inline nessa linha

console.log("Chamada da função: " + variavelComFuncao());
```

Uma função é provada pura quando não possui efeitos colaterais (como exceções disparadas), e sua saída sempre será a mesma para uma mesma entrada.

---

## Aula 2 — Composição e Pipeline

### O que é Composição de Funções?

A composição de funções se trata do processo de organizar e ordenar funções a serem executadas em sequência, fazendo com que o resultado de uma é passado para a próxima e assim por diante. Na representação de funções seria algo da seguinte forma `f(g(x))` ou `f(g(h(x)))` a depender de quantas funções estão sendo executadas nessa sequência.

Ela pode eliminar código desnecessário em testes individuais e escrita de novas funcionalidades em um módulo já existente, onde só seria necessário escrever as novas funções e passá-las para o `pipe` ou `compose`, sem reescrever o pipeline de execução.

### Diferença entre `pipe` e `compose`

A diferença entre `pipe` e `compose` se trata da **ordem de execução** das funções:

- **`compose`** — executa as funções da direita para esquerda, simulando mais fielmente a notação matemática descrita anteriormente: `f(g(h(x)))`
- **`pipe`** — executa as funções da esquerda para direita, fazendo uma implementação programática de forma mais legível e fácil de se interpretar

### Por que Currying?

O currying é utilizado para isolar e separar os parâmetros, permitindo uma aplicação parcial das funções. Por exemplo, uma função soma que recebe 2 parâmetros seria separada em duas funções, e podemos aplicar a soma de novas formas:

```javascript
const somaComCurry = a => b => a + b
const soma5 = somaComCurry(5)

console.log(somaComCurry(2)(3)); // Resultado 5
console.log(soma5(4)); // Resultado 9 — permitiu a inclusão do parâmetro 5 de forma antecipada sem executar totalmente a função
```

### Pipelines Implementados

Foram construídos 2 diferentes pipes para execução com finalidades diferentes:

---

#### Pipeline 1 — `faturamentoCategoriasPremium`

O pipe organiza filtros e agrupamentos com o fim de estabelecer o total por categoria dos produtos "Premium" (valor maior que R$ 750,00). Será usado quando for necessário ter quantitativos das vendas de alto valor (normalmente de produtos de qualidade superior ou de marca).

São utilizadas as seguintes funções nas respectivas ordens:

| Ordem | Função | Descrição |
|---|---|---|
| 1 | `filtrarPorValorMinimo(750)` | Retorna o array filtrado somente com produtos com valor >= 750 |
| 2 | `resumirVendas` | Transforma o array, mantendo apenas os campos de relevância para agregações (produto, valor, categoria) |
| 3 | `totalPorCategoria` | Faz a agregação dos valores de acordo com a categoria dos produtos |

---

#### Pipeline 2 — `receitaPorVendedorEmTech`

O segundo pipe serve para obtermos um total do total vendido por cada vendedor, podendo usar essa agregação para saber o rendimento de cada funcionário no devido setor.

Foram criadas duas novas funções para esse pipe: `totalPorVendedor`, que usa um `reduce` para resumir as informações e acumula o valor da venda para cada vendedor; e `ordenarAgregadoPorValor`, que utiliza `Object.entries` para converter o conjunto de entrada para um array e utiliza a ordenação imediatamente (pode ser separada para maior facilidade de uso posteriormente).

São utilizadas as seguintes funções nas respectivas ordens:

| Ordem | Função | Descrição |
|---|---|---|
| 1 | `filtrarPorCategoria('tech')` | Executa o filtro das vendas para a categoria desejada |
| 2 | `totalPorVendedor` | Agrupa o array e traz o valor total agregado por vendedor |
| 3 | `ordenarAgregadoPorValor` | Utiliza `Object.entries` para converter o objeto para array e faz a ordenação utilizando `Array.toSorted()` para não mutar o objeto inicial |

---

### O que foi Pesquisado

Para desenvolver os pipes foi necessário analisar as funções anteriores, pesquisando sobre como cada função pode ser executada no JavaScript, como por exemplo o `reduce`, `sort` e `toSorted`.

Algumas fontes úteis para a pesquisa e o desenvolvimento foram:

- **MDN Web Docs**
- **Stack Overflow**
- **Claude** — usada para ter dicas de codificação ou resumo com linguagem mais simplificada para entender primariamente conceitos
- **Visão geral por IA do Google** — utilizada indiretamente ao fazer as pesquisas no Google, serviu para introduzir cada tópico


As decisões de projeto para as funções foram as seguintes: 
1. `filtrarPorValorMinimo` | `filtrarPorCategoria` -> Utilizado `.filter` para filtro simples já proporcionado pelo objeto Array
2. `resumirVendas` -> Uso de `.map` pois o objetivo é apenas resumir cada objeto em relação 1:1 não reduzir o array de N:1
3. `totalPorCategoria` -> Uso de `.reduce` para realizar uma agregação simples de valor e manter a chave `Categoria`
4. `ordenarPorValor` -> Uso de `.toSorted` para fazer a ordenação para que o array original não fosse mutado (`.sort` faz a mutação)

---

## Conclusão

Caso fosse necessário implementar todo o sistema usando programação imperativa, acredito que o mais difícil de manter seria a **gerência do estado da aplicação** (maior diferença dos paradigmas), as **funções de ordenação** (requerem uso de bibliotecas ou lógica mais complexa, o que é totalmente simplificado na programação funcional) e manter o **desacoplamento dos pipes**, pois atualmente trabalham de forma simples e direta orquestrados pela função. Para executar na programação imperativa iria utilizar boas linhas a mais e um código mais verboso e menos claro.

Menção honrosa para a diferença gritante das funções mais simples, como filtro por categoria ou resumo, que iriam demandar estruturas maiores e menos claras, mesmo que ainda sejam bem simples de implementar.
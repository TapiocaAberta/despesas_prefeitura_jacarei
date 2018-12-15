var colunasNumericas = [ 
                'Vl_Jan_Pag', 'Vl_Fev_Pag', 'Vl_Mar_Pag', 
                'Vl_Abr_Pag', 'Vl_Mai_Pag', 'Vl_Jun_Pag', 
                'Vl_Jul_Pag', 'Vl_Ago_Pag', 'Vl_Set_Pag', 
                'Vl_Out_Pag', 'Vl_Nov_Pag', 'Vl_Dez_Pag'
];

d3.csv("data/despesas_prefeitura_2018.csv",
    function(linha) {
        var dado = {};
        dado.elemento = linha.Elemento;
        for(var i = 0; i < colunasNumericas.length; i++) {
            var coluna = colunasNumericas[i];
            var valor = linha[coluna];
            dado[coluna] = trataNumero(valor);
        }
        return dado;
        
    }).then(function (dados) {
        var totais = calculaTotais(dados);
        var maximo = buscaMaximo(totais);
        d3.select('#maxArea').html(maximo.elemento);
        d3.select('#maxValor').style('color', 'red').html(maximo.total);
        graficoPizzaTotals(totais);
        graficoDadosMensais(dados);
});


function buscaMaximo(totais) {
    var maior = totais[0];
    for(var i = 1; i < totais.length; i++) {
        if(totais[i].total > maior.total) {
            maior = totais[i];
        }
    }
    return maior;
}

function calculaTotais(dados) {
    var pagamentosTotaisPorAno = [];
    for(var i = 0; i < dados.length; i++) {
        var total = 0;
        for(var j = 0; j < colunasNumericas.length; j++) {
            var coluna = colunasNumericas[j];
            total += dados[i][coluna];
        }
        pagamentosTotaisPorAno.push({"elemento": dados[i].elemento, "total": total });
    }
    return pagamentosTotaisPorAno;
}


function graficoPizzaTotals (totais) {
    var dadosGrafico = [];
    for( var i = 0; i < totais.length; i++) {
        dadosGrafico.push([ totais[i].elemento, totais[i].total]);
    }
    c3.generate({
        bindto: '#graficoTotais',
        data: {
            columns: dadosGrafico,
            type: 'pie'
        },
        legend: {
            position: 'right'
        }
    });
}

function graficoDadosMensais(dados) {
    var dadosGrafico = [];
    for(var i = 0; i < dados.length; i++) {
        var linha = [];
        linha.push(dados[i].elemento);
        for(var j = 0; j < colunasNumericas.length; j++) {
            var nomeColuna = colunasNumericas[j];
            linha.push(dados[i][nomeColuna]);
        }
        dadosGrafico.push(linha);
    }
    c3.generate({
        bindto: '#graficoMensais',
        data: {
            columns: dadosGrafico,
            type: 'line',
        }
    });
}

function trataNumero(num) {
    var numLimpo = num.replace('\"', '')
                      .replace(' ', '')
                      .replace('.', '')
                      .replace(',', '.');
    return parseFloat(numLimpo);
}






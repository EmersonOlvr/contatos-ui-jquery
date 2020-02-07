let tableBody = $('#tableBody');
let resultado = $('#resultado');
let resultadoEditar = $('#resultadoEditar');
let btnFecharAlert = '<button type=\"button\" class=\"close\" onclick=\"fecharAlerta(this)\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>';
let qtdTotalContatos = $('#qtdTotalContatos');

consultarApi();

function consultarApi() {
    tableBody.html('<tr><td colspan=\"4\"><img src=\"img/loader.gif\" width=\"25\"> <i>Carregando...</i></td> </tr>');
    qtdTotalContatos.html('<img src=\"img/loader.gif\" width=\"17\">');

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/contatos',
        async: true,
        success: function (data) {
            console.log('SUCESSO ao consultar API.');
            if (data.length > 0) {
                tableBody.html(obterTagsTabela(data));
            } else {
                tableBody.html("<tr><td colspan='4'><i>Nenhum contato encontrado.</i></td></tr>");
            }
            qtdTotalContatos.html(data.length);
        },
        error: function (results) {
            console.log('ERRO ao consultar API.');
            console.log(results);
            tableBody.html("<tr><td colspan='4'><i style='color: red'>Erro ao listar os Contatos.</i></td></tr>");
            qtdTotalContatos.html('<i style=\"color: red\">Erro</i>');
        }
    });
}
function obterTagsTabela(dados) {
    let tags = [];

    dados.forEach(contatoAtual => {
        tags.push('<tr>' +
            '<td>' + contatoAtual.id + '</td>' +
            '<td>' + contatoAtual.nome + '</td>' +
            '<td>' + contatoAtual.email + '</td>' +
            '<td><button type=\"button\" class=\"btn btn-sm btn-primary\" data-toggle=\"modal\" data-target=\"#modalEditar\" onclick=\"editar(' + contatoAtual.id + ')\">Editar</button></td>' +
            '<td><button class=\"btn btn-sm btn-danger\" onclick=\"excluir(' + contatoAtual.id + ')\">Excluir</button></td>' +
            '</tr>');
    });

    return tags;
}

function editar(id) {
    $('#id').val(0);
    $('#nome').val('');
    $('#email').val('');
    let btnSalvar = $('#btnSalvar');
    btnSalvar.prop('disabled', true);
    resultadoEditar.css('display', 'none');

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/contatos/' + id,
        async: true,
        success: function (data) {
            console.log('SUCESSO ao obter contato (ID: ' + id + ').');
            let usuario = data;
            $('#id').val(usuario.id);
            $('#nome').val(usuario.nome);
            $('#email').val(usuario.email);
            btnSalvar.prop('disabled', false);
        },
        error: function (results) {
            console.log('ERRO ao obter contato (ID: ' + id + ').');
            console.log(results);
            alertaErro(resultadoEditar, 'Erro ao editar contato, tente <a href="">recarregar a página</a>.'+btnFecharAlert);
        }
    });
}
$('#formEditar').submit(function () {
    let formData = $('#formEditar').serializeJSON();
    let formString = JSON.stringify(formData);
    let btnSalvar = $('#btnSalvar');
    btnSalvar.prop('disabled', true);

    $.ajax({
        type: 'PUT',
        url: 'http://localhost:8080/contatos',
        async: true,
        contentType: 'application/json',
        dataType: 'json',
        data: formString,
        success: function (data) {
            console.log('SUCESSO ao atualizar contato (ID: ' + formData.id + ').');
            alertaSucesso(resultadoEditar, 'Contato atualizado com sucesso!'+btnFecharAlert);
            consultarApi();
        },
        error: function (results) {
            console.log('ERRO ao atualizar contato (ID: ' + formData.id + ').');
            console.log(results);
            let response = results.responseJSON;

            // o status HTTP 400 significa 'Bad Request'
            if (results.status == 400 || results.status == 404) {
                alertaErro(resultadoEditar, response.message + btnFecharAlert)
            } else {
                alertaErro(resultadoEditar, 'Desculpe, algo deu errado'+btnFecharAlert);
            }
        },
        complete: function() {
            btnSalvar.prop('disabled', false);
        }
    });

    // retorna false para o formulário não ser submetido
    return false;
});

function excluir(id) {
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/contatos/' + id,
        async: true,
        success: function (data) {
            console.log('SUCESSO ao excluir.');
            alertaSucesso(resultado, 'Contato excluído com sucesso!'+btnFecharAlert);
            consultarApi();
        },
        error: function (results) {
            console.log('ERRO ao excluir.');
            console.log(results);
            alertaErro(resultado, 'Erro ao excluir contato, tente <a href="">recarregar a página</a>.'+btnFecharAlert);
        }
    });
}

function fecharAlerta(btnFechar) {
    $(btnFechar).parent().css('display', 'none');
}
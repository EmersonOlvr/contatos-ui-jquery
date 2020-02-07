/// <reference path="lib/jquery-3.4.1.min.js" />

let resultado = $('#resultado');
let form = $('#formulario');
let btnEnviar = $('#btnEnviar');
let btnFecharAlert = '<button type=\"button\" class=\"close\" onclick=\"fecharAlerta(this)\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>';

$('#formulario').submit(function () {
    btnEnviar.prop('disabled', true);

    let formData = $('#formulario').serializeJSON();
    let formString = JSON.stringify(formData);

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/contatos",
        async: true,
        contentType: 'application/json',
        dataType: 'json',
        data: formString,
        success: function (data) {
            console.log("SUCESSO ao adicionar contato.");
            resultado.removeClass('alert-danger');
            resultado.addClass('alert-success');
            resultado.css("display", "block");
            resultado.html("Cadastrado com sucesso!"+btnFecharAlert);

            form.trigger('reset');
            $('input').blur();
            console.log(data);
        },
        error: function (results) {
            console.log("ERRO ao adicionar contato.");
            console.log(results);
            resultado.removeClass('alert-success');
            resultado.addClass('alert-danger');
            resultado.css("display", "block");
            if (results.responseJSON !== undefined) {
                resultado.html(results.responseJSON.message + btnFecharAlert);
            } else {
                resultado.html('Desculpe, algo deu errado'+btnFecharAlert);
            }
        },
        complete: function() {
            btnEnviar.prop('disabled', false);
        }
    });
    
    // retorna false para o formulário não ser submetido
    return false;
});

function fecharAlerta(btnFechar) {
    $(btnFechar).parent().css('display', 'none');
}
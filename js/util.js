function alertaSucesso(divAlert, mensagem) {
    if (divAlert.hasClass('alert-danger')) {
        divAlert.removeClass('alert-danger');
    }
    divAlert.addClass('alert-success');
    divAlert.html(mensagem);
    divAlert.css('display', 'block');
}
function alertaErro(divAlert, mensagem) {
    if (divAlert.hasClass('alert-success')) {
        divAlert.removeClass('alert-success');
    }
    divAlert.addClass('alert-danger');
    divAlert.html(mensagem);
    divAlert.css('display', 'block');
}
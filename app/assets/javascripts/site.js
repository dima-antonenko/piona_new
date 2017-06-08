// require jquery
//= require jquery_ujs
//= require site/notify.js 



crud_ui = {
  success_update: function() {
    $.notify("Запрос отправлен", "success");
  },

  failed_update: function() {
    $.notify("Произошла ошибка", "error");
  }
};

product_ui = {
  success_create_back_call: function() {
    $.notify("Запрос отправлен", "success");
    $('#back_call_phone').val('');
  },

  success_create_product_question: function() {
    $.notify("Вопрос отправлен", "success");
    $('#product_question_name').val('');
    $('#product_question_phone').val('');
    $('#product_question_text').val('');
  },

  success_create_form_request: function() {
    $.notify("Заявка отправлена", "success");
    $('#form_request_name').val('');
    $('#form_request_email').val('');
    $('#form_request_phone').val('');
    $('#form_request_text').val('');
  },

  success_create_quick_order: function() {
    $.notify("Заказ отправлен, спасибо", "success");
    $('#customer_phone').val('');
  },

  success_create_order: function() {
    $.notify("Заказ отправлен, спасибо", "success");
    $('#order_customer_name').val('');
    $('#order_customer_email').val('');
    $('#order_customer_phone').val('');
    $('#order_customer_city').val('');
    $('#order_customer_address').val('');
    setTimeout(function() {
      window.location.href = "/";
    }, 2000);
  }


};


$('#add-preview').click(function() {

  $('#comments').addClass('hidden');
  $('#review_form_wrapper').addClass('active');
});
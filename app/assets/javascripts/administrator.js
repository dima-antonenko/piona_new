// require jquery
//= require jquery_ujs
//= require ckeditor/init

CKEDITOR.editorConfig = function(config) {
  // ... other configuration ...

  config.toolbar_mini = [
    ["Bold", "Italic", "Underline", "Strike", "-", "Subscript", "Superscript"],
  ];
  config.toolbar = "simple";

  // ... rest of the original config.js  ...
}


crud_ui = {
  succes_update: function() {
    console.log("succes_update");
    UIkit.notify({
      message: 'Запись обновлена',
      status: 'success',
      timeout: 2000,
      pos: 'top-right'
    });
  },

  failed_update: function() {
    UIkit.notify({
      message: 'Произошла ошибка',
      status: 'danger',
      timeout: 2000,
      pos: 'top-right'
    });
  },

  destroy_list_item: function(item_id) {
    element = ".item" + item_id;
    $(element).remove();
  }

};


WebFontConfig = {
  google: {
    families: [
      'Source+Code+Pro:400,700:latin',
      'Roboto:400,300,500,700,400italic:latin'
    ]
  }
};
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();
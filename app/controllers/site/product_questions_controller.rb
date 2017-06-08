class Site::ProductQuestionsController < SiteController


  def create
    result = Site::SProductQuestion::Create.new(params).main
    respond_to do |format|
      if result
        format.js {render js: "product_ui.success_create_product_question();"}
      else
        format.js {render js: "crud_ui.failed_update();"}
      end
    end
  end

end

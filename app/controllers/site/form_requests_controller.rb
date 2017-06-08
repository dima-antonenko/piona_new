class Site::FormRequestsController < SiteController

  def create
  	result = Site::SFormRequest::Create.new(params).main
    respond_to do |format|
      if result
        format.js {render js: "product_ui.success_create_form_request();"}
      else
        format.js {render js: "crud_ui.failed_update();"}
      end
    end
  end

end
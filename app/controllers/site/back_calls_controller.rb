class Site::BackCallsController < SiteController

  respond_to :js

  def create
    result = Site::SBackCall::Create.new(params).main
    respond_to do |format|
      if result
        format.js {render js: "product_ui.success_create_back_call();"}
      else
        format.js {render js: "crud_ui.failed_update();"}
      end  
    end
  end

end

class Administrators::PagesController < AdministratorsController


  before_action :set_page, only: [:edit, :update]


  def index
    @pages = Page.all
  end


  def update
    @page.update(page_params)
    respond_to do |format|
      if @page.save
        format.js {render js: "crud_ui.succes_update();"}
      else
        format.js {render js: "crud_ui.failed_update();"}
      end
    end
  end

  def edit

  end



  private


  def set_page
    @page = Page.find(params[:id])
  end

  def page_params
    params.require(:page).permit(:name, :description, :meta_title, :meta_description, :meta_keywords)
  end


end

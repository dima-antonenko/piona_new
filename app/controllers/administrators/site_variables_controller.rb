class Administrators::SiteVariablesController < AdministratorsController


  before_action :set_site_variable, only: [:edit, :update]


  def index
    @site_variables = SiteVariable.all
  end


  def update
    @site_variable.update(site_variable_params)
    respond_to do |format|
      if @site_variable.save
        format.js {render js: "crud_ui.succes_update();"}
      else
        format.js {render js: "crud_ui.failed_update();"}
      end
    end
  end

  def edit

  end

 

  private


  def set_site_variable
    @site_variable = SiteVariable.find(params[:id])
  end

  def site_variable_params
    params.require(:site_variable).permit(:title, :content)
  end


end

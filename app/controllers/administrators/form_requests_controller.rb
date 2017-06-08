class Administrators::FormRequestsController < AdministratorsController


  before_action :set_form_request, only: [:show, :destroy]


  def index
    @form_requests = FormRequest.all.order('created_at DESC').paginate(:page => params[:page], :per_page => 20)
  end

  def show
    
  end

  def destroy
    @request.destroy
    respond_to do |format|
      format.html { redirect_to :back, notice: 'Объект удален' }
    end
  end


  private


  def set_form_request
    @request = FormRequest.find(params[:id])
  end

end
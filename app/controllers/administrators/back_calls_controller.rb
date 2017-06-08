class Administrators::BackCallsController < AdministratorsController


  before_action :set_back_call, only: [:destroy]


  def index
    @back_calls = BackCall.all.paginate(:page => params[:page], :per_page => 20)
  end


  def destroy
    @back_call.destroy
    respond_to do |format|
      format.js {render js: "crud_ui.destroy_list_item(#{@back_call.id});"}
      format.html { redirect_to :back, notice: 'Заявка удалена' }
    end
  end


  private


  def set_back_call
    @back_call = BackCall.find(params[:id])
  end

end
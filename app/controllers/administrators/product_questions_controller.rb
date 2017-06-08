class Administrators::ProductQuestionsController < AdministratorsController


  before_action :set_product_question, only: [:show, :destroy]


  def index
    @product_questions = ProductQuestion.all.includes(:product).order('created_at DESC').paginate(:page => params[:page], :per_page => 20)
  end

  def show
 
  end

  def destroy
    @product_question.destroy
    respond_to do |format|
      format.js {render js: "crud_ui.destroy_list_item(#{@product_question.id});"}
      format.html { redirect_to :back, notice: 'Вопрос удален' }
    end
  end


  private


  def set_product_question
    @product_question = ProductQuestion.find(params[:id])
  end

end
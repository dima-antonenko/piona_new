class Administrators::PostCategoriesController < AdministratorsController


  before_action :set_post_category, only: [:edit, :update, :destroy]


  def index
    @post_categories = PostCategory.includes(:post_category).order('created_at DESC').paginate(:page => params[:page], :per_page => 20)
  end

  def new
    @post_category = PostCategory.new()
    @list_to_form = PostCategory.all.collect{|category| [category.name, category.id]} << ['Родитель', 0]
  end

  def create
    @post_category = PostCategory.new(post_category_params)
    respond_to do |format|
      if @post_category.save
        format.html { redirect_to edit_administrators_post_category_path(@post_category), notice: 'Информация сохранена' }
      else
       format.js {render js: "crud_ui.failed_update();"}
        format.html { redirect_to :back, notice: 'Произошла ошибка' }
      end
    end
  end

  def update
    @post_category.update(post_category_params)
    respond_to do |format|
      if @post_category.save
        format.html { redirect_to edit_administrators_post_category_path(@post_category), notice: 'Информация сохранена' }
      else
        format.html { redirect_to edit_administrators_post_category_path(@post_category), notice: 'Произошла ошибка' }
      end
    end
  end

  def edit
    @list_to_form = PostCategory.all.collect{|category| [category.name, category.id]} << ['Родитель', 0]
  end

  def destroy
    @post_category.destroy
    respond_to do |format|
      format.js {render js: "crud_ui.destroy_list_item(#{@post_category.id});"}
      format.html { redirect_to administrators_post_categories_path, notice: 'Категория удалена' }
    end
  end


  private


  def set_post_category
    @post_category = PostCategory.friendly.find(params[:id])
  end

  def post_category_params
    params.require(:post_category).permit(:name, :post_category_id, :slug, :description, :meta_title,
                                          :meta_description, :meta_keywords, :avatar)
  end


end

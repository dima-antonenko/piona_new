class Administrators::ProductCategoriesController < AdministratorsController


  
  before_action :set_product_category, only: [:edit, :update, :destroy]




  def index
    @product_categories = ProductCategory.includes(:product_category).order(:name).paginate(:page => params[:page], :per_page => 20)
  end

  def new
    @product_category = ProductCategory.new()
    @list_to_form     = ProductCategory.all.collect{|category| [category.name, category.id]} << ['Родитель', 0]
  end

  def create
    @product_category = ProductCategory.new(product_category_params)
    respond_to do |format|
      if @product_category.save
        format.html { redirect_to edit_administrators_product_category_path(@product_category), notice: 'Информация сохранена' }
      else
        format.html { redirect_to :back, notice: 'Произошла ошибка' }
      end
    end
  end

  def update
    @product_category.update(product_category_params)
    respond_to do |format|
      if @product_category.save
        format.html { redirect_to edit_administrators_product_category_path(@product_category), notice: 'Информация сохранена' }
      else
        format.html { redirect_to edit_administrators_product_category_path(@product_category), notice: 'Произошла ошибка' }
      end
    end
  end

  def edit
    @list_to_form = ProductCategory.all.collect{|category| [category.name, category.id]} << ['Родитель', 0]
  end

  def destroy
    @product_category.destroy
    respond_to do |format|
      format.html { redirect_to administrators_product_categories_path, notice: 'Категория удалена' }
      format.js {render js: "crud_ui.destroy_list_item(#{@product_category.id});"}
    end
  end


  private


  def set_product_category
    @product_category = ProductCategory.friendly.find(params[:id])
  end

  def product_category_params
    params.require(:product_category).permit(:name, :product_category_id, :slug, :description, :meta_title,
                                          :meta_description, :meta_keywords, :avatar, :large_avatar)
  end


end

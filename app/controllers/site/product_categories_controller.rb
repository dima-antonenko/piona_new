class Site::ProductCategoriesController < SiteController

  def show
    @product_category = ProductCategory.friendly.find(params[:id])
    @childern_categories = @product_category.product_categories 
    @products = @product_category.products.where(active: true).paginate(page: params[:page], per_page: 10)
    render theme_path('product_category')
  end

end
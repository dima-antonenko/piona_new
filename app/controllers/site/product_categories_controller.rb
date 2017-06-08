class Site::ProductCategoriesController < SiteController

  def show
    @product_category = ProductCategory.friendly.find(params[:id])
    @products = @product_category.products.where(active: true).paginate(page: params[:page], per_page: 10)
    @parent_product_categories = ProductCategory.where(product_category_id: 0)
    @subcategories = @product_category.product_categories
    @banner = Banner.find_by(descriptor: "first_banner") 

    render theme_path('product_category')
  end

end
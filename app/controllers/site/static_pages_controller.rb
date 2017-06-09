class Site::StaticPagesController < SiteController

  def home
    @page = Page.find_by(descriptor: 'home')
  #  @slides = Slider.find_by(descriptor: 'main').slides
    @product_categories = ProductCategory.where(on_main_page: true)
    @products = Product.all
    @random_products =  Product.order("RANDOM()").limit(7)
    render theme_path('home')
  end

  def contacts
    @page = Page.find_by(descriptor: 'contacts')
    render theme_path('static_page')
  end

  def delivery_info
    @page = Page.find_by(descriptor: 'delivery_info')
    render theme_path('static_page')
  end

  def payment_info
    @page = Page.find_by(descriptor: 'payment_info')
    render theme_path('static_page')
  end

  def terms_of_service
    @page = Page.find_by(descriptor: 'terms_of_service')
    render theme_path('static_page')
  end

  def search_product
    result = Site::SearchProduct.new(params).main
    respond_to do |format|
      if result.class.to_s == 'Product::ActiveRecord_Relation'
        @products = result.paginate(page: params[:page], per_page: 10)
        format.html {  render theme_path('search_results') }
      elsif result.class.to_s == 'Product'
        format.html { redirect_to product_path(result) }
      elsif result.class.to_s == 'FalseClass'
        raise ActiveRecord::RecordNotFound, "Запись не найдена"
      end
    end
  end


end
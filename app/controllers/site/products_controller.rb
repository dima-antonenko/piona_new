class Site::ProductsController < SiteController



  def show
    @product = Product.friendly.find(params[:id])

    @product_category = @product.product_category
    @attacments = ProductAttachment.where(product_id: @product.id)
    @random_products = Product.limit(5)

    @product_question = ProductQuestion.new
    @back_call = BackCall.new
    @form_request = FormRequest.new

    if @product.active == false
      render :file => "#{Rails.root}/public/404", :layout => false, :status => :not_found
    else
      render theme_path('product')
    end
  end

end

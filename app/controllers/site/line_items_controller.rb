class Site::LineItemsController < SiteController

  before_action :set_cart, only: [:create, :destroy]

  def create
   # @line_item = @cart.add_product(params[:product_id])
    line_item = Site::SCart::AddProduct.new(params[:product_id], @cart).main
    respond_to do |format|
      if line_item != false
        format.html { redirect_to cart_path(@cart) }
      else
        format.html {redirect_to :back}
      end
    end
  end

  def destroy
    # result = @cart.delete_item(params[:id]) 
    Site::SCart::DeleteItem.new(params[:id], @cart).main
    respond_to do |format|
      format.html { redirect_to :back }
    end
  end


  private

  def set_cart
    @cart = Cart.find(session[:cart_id])
  rescue ActiveRecord::RecordNotFound
    @cart = Cart.create
    session[:cart_id] = @cart.id
  end

end

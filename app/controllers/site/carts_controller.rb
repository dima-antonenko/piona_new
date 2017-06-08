class Site::CartsController < SiteController
  before_action :set_cart, only: [:show, :destroy]

  def show
    @order = Order.new
    @line_items = @cart.line_items.includes(:product)
    render theme_path('cart')
  end


  def create
    @cart = Cart.new(cart_params)
    respond_to do |format|
      if @cart.save
        format.html { redirect_to @cart, notice: 'Cart was successfully created.' }
      else
        format.html { render :new }
      end
    end
  end

  def destroy
    if @cart.id == session[:cart_id]
      Site::SCart::DeleteCart.new(@cart).main
      session[:cart_id] = nil
    end
    redirect_to '/'
  end


  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  private
  
  def set_cart
    @cart = Cart.find(params[:id])
  end

  def cart_params
    params[:cart]
  end

  def record_not_found
    redirect_to '/'
  end
end

class Site::OrdersController < SiteController
#  include CurrentCart
  before_action :set_cart, only: [:create]
  before_action :set_order, only: [:show, :edit, :update, :destroy]


  def create
    result = Site::SOrder::Create.new(params, @cart).main
    respond_to do |format|
      if result
        session[:cart_id] = nil
        format.js { render js: "product_ui.success_create_order();" }
      else
        format.js { render js: "crud_ui.failed_update();" }
      end
    end
  end

  def show
    @line_items = LineItem.where(order_id: @order.id)
  end


  def create_quick
    result = Site::SOrder::CreateQuick.new(params).main
    respond_to do |format|
      if result
        format.js { render js: "product_ui.success_create_quick_order();" }
      else
        format.js { render js: "crud_ui.failed_update();" }
      end
    end
  end


  private

  def set_cart
    @cart = Cart.find(session[:cart_id])
  rescue ActiveRecord::RecordNotFound
    @cart = Cart.create
    session[:cart_id] = @cart.id
  end


  def set_order
    @order = Order.find(params[:id])
  end

end

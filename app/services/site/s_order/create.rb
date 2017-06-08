module Site
  module SOrder
    class Create

      def initialize(params, cart)
        @order_params = params.require(:order)
        @cart         = cart
        @order        = Order.new
      end

      def main
        add_static_data_to_order
        if @order.save and @cart.line_items.size > 0
          add_items_to_order
          @order
        else
          false
        end
      end


      private


      def add_static_data_to_order
        @order.customer_name  = @order_params[:customer_name]
        @order.customer_email = @order_params[:customer_email]
        @order.customer_phone = @order_params[:customer_phone]
        @order.customer_city  = @order_params[:customer_city]
        @order.customer_address  = @order_params[:customer_address]
        @order.total_price    = @cart.total_price
      end


      def add_items_to_order
        @cart.line_items.each do |item|
          item.update(order_id: @order.id, cart_id: nil)
          item.save
        end
        @cart.destroy
      end

      


    end
  end
end

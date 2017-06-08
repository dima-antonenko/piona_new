module Site
  module SOrder
    class CreateQuick

      def initialize(params)
        @params = params
        @product = Product.find(params[:product_id]) rescue nil
      end

      def main
        if @product != nil and @product.qty > 0 and @product.active and @product.stock and @params[:customer_phone].size > 4
          update_product
          create_order
        else
          false
        end
      end


      private

      def update_product
        @product.qty -= 1
        @product.stock = false if @product.qty == 0
        @product.save
      end

      def create_order
        @order = Order.create(customer_phone: @params[:customer_phone], total_price: @product.price, size_type: 1)
        LineItem.create(order_id: @order.id, product_id: @product.id, product_name: @product.name,
                        product_price: @product.price, quantity: 1, total_price: @product.price )
        @order
      end


    end
  end
end

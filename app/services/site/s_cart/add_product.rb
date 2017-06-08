module Site
  module SCart
    class AddProduct

      def initialize(product_id, cart)
        @product = Product.friendly.find(product_id) rescue nil
        @cart = cart
        @line_items = @cart.line_items
      end

      def main
        if @product != nil and @product.qty > 0 and @product.stock and @product.active
          current_item = @line_items.find_by(product_id: @product.id)
          if current_item
            update_current_line_item(current_item)
          else
            add_new_line_item
          end
          update_product
          current_item
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

      def add_new_line_item
        current_item = LineItem.create(product_id: @product.id, product_price: @product.price, cart_id: @cart.id,
                                       total_price: @product.price, product_name: @product.name)
      end

      def update_current_line_item(current_item)
        current_item.quantity += 1
        current_item.total_price += @product.price
        current_item.save
      end

    end
  end
end

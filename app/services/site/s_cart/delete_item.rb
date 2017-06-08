module Site
  module SCart
    class DeleteItem

      def initialize(line_item_id, cart)
        @cart = cart
        @line_item = @cart.line_items.find(line_item_id) rescue nil    
      end

      def main
        if @line_item != nil
          @line_item.destroy
          update_product
        else
          false
        end
      end


      private


      def update_product
        product = Product.friendly.find(@line_item.product_id)
        product.stock = true if product.qty == 0
        product.qty += @line_item.quantity
        product.save
      end

    end
  end
end

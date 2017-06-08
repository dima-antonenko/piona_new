module Site
  module SCart
    class DeleteCart

      def initialize(cart)
        @cart = cart
        @line_items = @cart.line_items
      end

      def main
       update_qty_from_products if @line_items.size > 0
       @cart.destroy
      end


      private


      def update_qty_from_products
        @line_items.each do |item|
          Site::SCart::DeleteItem.new(item.id, @cart).main
        end  
      end

    end
  end
end

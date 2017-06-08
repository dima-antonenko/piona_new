module SAdministrator
  module SProduct
    class Create

      def initialize(params)
        @product = Product.new
        @params  = params[:product]
      end

      def main
        set_static
        if @product.save
          return @product
        else
          false
        end
      end


      private


      def set_static
        @product.active              = @params[:active].to_i
        @product.name                = @params[:name]
        @product.product_category_id = @params[:product_category_id].to_i
        @product.price               = @params[:price].to_i
        @product.description         = @params[:description]
        @product.short_description   = @params[:short_description]
        @product.avatar              = @params[:avatar]
        @product.slug                = @params[:slug]
        @product.stock               = @params[:stock]
        @product.qty                 = @params[:qty]

        @product.meta_title          = @params[:meta_title]
        @product.meta_description    = @params[:meta_description]
        @product.meta_keywords       = @params[:meta_keywords]
      end

    end
  end
end

module SAdministrator
  module SProduct
    class Update

      def initialize(product, params)
        @product = product
        @params  = params
      end

      def main
        set_static
        set_attachments
        if @product.save
          return @product
        else 
          false
        end  
      end


      private


      def set_static
        @product.active              = @params[:product][:active].to_i
        @product.name                = @params[:product][:name]
        @product.product_category_id = @params[:product][:product_category_id].to_i
        @product.price               = @params[:product][:price].to_i
        @product.description         = @params[:product][:description]
        @product.short_description   = @params[:product][:short_description]
        @product.avatar              = @params[:product][:avatar] if @params[:product][:avatar]
        @product.slug                = @params[:product][:slug]
        @product.stock               = @params[:product][:stock]
        @product.qty                 = @params[:product][:qty]

        @product.meta_title          = @params[:product][:meta_title]
        @product.meta_description    = @params[:product][:meta_description]
        @product.meta_keywords       = @params[:product][:meta_keywords]
      end

      def set_attachments
        if @params[:images]
          @params[:images].each do |image|
            ProductAttachment.create(product_id: @product.id, image: image)
          end 
        end
      end


    end
  end
end

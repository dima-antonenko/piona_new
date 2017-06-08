module Site
  module SBackCall
    class Create

      def initialize(params)
        @product = Product.find_by(id: params[:back_call][:product_id], active: true) rescue nil
        @phone   = params[:back_call][:phone]
      end


      def main
        if @phone.empty? != true
          BackCall.create(product_id: @product.id, phone: @phone)
        else
          false
        end
      end

    end
  end
end

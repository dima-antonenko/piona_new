module Site
  module SProductQuestion
    class Create

      def initialize(params)
        @product = Product.find(params[:product_question][:product_id]) rescue nil
        @product_question_params = params[:product_question]
      end


      def main
        if @product != nil and @product.active
          product_question = ProductQuestion.create(product_id: @product.id, name: @product_question_params[:name],
                                                    phone: @product_question_params[:phone], text: @product_question_params[:text])
          product_question.save ? product_question : false
        else
          false
        end
      end

    end
  end
end

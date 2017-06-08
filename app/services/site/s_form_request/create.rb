module Site
  module SFormRequest
    class Create

      def initialize(params)
        @form_request_params = params[:form_request]
      end


      def main
        form_request = FormRequest.create( name: @form_request_params[:name], email: @form_request_params[:email],
                                           phone: @form_request_params[:phone], text: @form_request_params[:text])
        form_request.save ? form_request : false
      end

    end
  end
end

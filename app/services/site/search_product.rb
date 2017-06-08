module Site
  class SearchProduct

    def initialize(params)
      @search_value         = params["search_value"]
      @search_type          = params["type"] # product_sku or product_name
    end


    def main
      if @search_value and @search_type and ['product_sku', 'product_name'].include? @search_type
        if @search_type == 'product_sku'
          search_by_sku
        elsif @search_type =='product_name'
          search_by_name
        end      
      else
        false
      end  
    end


    private


    def search_by_sku
      product = Product.friendly.find_by(id: @search_value, active: true) rescue false
    end


    def search_by_name
      #byebug
      products = Product.where("name LIKE ?", "%#{@search_value}%") rescue false
      products = products.where(active: true) if products != false
    end


  end
end

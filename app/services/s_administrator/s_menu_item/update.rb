module SAdministrator
  module SMenuItem
    class Update


      def initialize(menu_item, params)
        @menu_item = menu_item
        @params = params.require(:menu_item)
      end


      def main
        @menu_item.title        = @params[:title]
        @menu_item.url          = @params[:url]
        #@menu_item.menu_item_id = @params[:menu_item_id]
        @menu_item.position     = @params[:position]
        @menu_item.save ? @menu_item : false
      end


    end
  end
end
module SAdministrator
  module SMenuItem
    class Create


      def initialize(params)
        @menu_item = MenuItem.new
        @params = params.require(:menu_item)
      end

      def main
        @params[:parent_menu_item_id] ? create_children_item : create_parent_item
        if @menu_item.save
          return @menu_item
        else
          return false
        end  
      end  

      def create_parent_item
        @menu_item.title        = @params[:title]
        @menu_item.menu_id      = @params[:menu_id]
        @menu_item.url          = @params[:url]
        @menu_item.menu_item_id = @params[:menu_item_id].to_i
        @menu_item.position     = @params[:position]
      end

      def create_children_item
        parent_item         = MenuItem.find(@params[:parent_menu_item_id])
        @menu_item.title    = @params[:title]
        @menu_item.menu_id  = parent_item.menu_id
        @menu_item.url      = @params[:url]
        @menu_item.position = @params[:position]
        @menu_item.parent   = parent_item
      end

    end
  end
end
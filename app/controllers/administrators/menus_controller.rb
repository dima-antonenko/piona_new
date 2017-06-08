class Administrators::MenusController < AdministratorsController
  

  def index
    @menus = Menu.includes(:menu_items)
  end

  def edit
    @menu = Menu.find(params[:id])
    @menu_items = @menu.menu_items
    @parent_items = @menu_items.where(ancestry: nil).order(:position)

  end

end
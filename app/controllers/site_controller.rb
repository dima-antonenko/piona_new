class SiteController < ApplicationController

  before_action  :all_pages_data

  layout "site"

  def all_pages_data
   # @main_menu_items   = Menu.find_by(descriptor: 'main_menu').menu_items.where(ancestry: nil).order(:position)
   # @footer_menu_items = Menu.find_by(descriptor: 'footer_menu').menu_items.order(:position)
    @minicart          = Cart.find(session[:cart_id]) if session[:cart_id]
  end


  protected


  def theme_path(resourse_item)
    theme = 'kute_shop'
    "site/#{theme}/#{resourse_item}"
  end

end

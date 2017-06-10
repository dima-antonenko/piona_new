class SiteController < ApplicationController

  before_action  :all_pages_data

  layout "site"

  def all_pages_data
    @phone_and_email = SiteVariable.find_by(descriptor: 'phone_in_footer')
    @delivery_data   = SiteVariable.find_by(descriptor: 'delivery_in_footer')
    @law_data        = SiteVariable.find_by(descriptor: 'law_info_in_footer')

    @minicart          = Cart.find(session[:cart_id]) if session[:cart_id]
  end


  protected


  def theme_path(resourse_item)
    theme = 'kute_shop'
    "site/#{theme}/#{resourse_item}"
  end

end

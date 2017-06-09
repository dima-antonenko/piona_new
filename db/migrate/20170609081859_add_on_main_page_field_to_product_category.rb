class AddOnMainPageFieldToProductCategory < ActiveRecord::Migration[5.0]
  def change
    add_column :product_categories, :on_main_page, :boolean, index: true, null: false, default: false
  end
end

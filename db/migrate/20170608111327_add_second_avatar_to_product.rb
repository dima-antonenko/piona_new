class AddSecondAvatarToProduct < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :second_avatar, :string, index: true
  end
end

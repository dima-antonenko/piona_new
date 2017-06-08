class MenuItem < ActiveRecord::Base
  # extend ActsAsTree::TreeView

  has_ancestry    

  # acts_as_tree order: 'position'
  # acts_as_tree foreign_key: 'menu_item_id'
  
  has_many :menu_items, dependent: :destroy  


  belongs_to :menu
  belongs_to :menu_item


  validates :title, presence: true
  validates :url, presence: true
  validates :position, presence: true

end
class Product < ActiveRecord::Base
  
  extend FriendlyId
 
  friendly_id :slug, use: :slugged
  mount_uploader :avatar, ProductAvatarUploader
  attr_accessor :checked_products, :checked_action
  

  has_many :product_attacments
  has_many :line_items, dependent: :destroy
  has_many :product_questions, dependent: :destroy


  belongs_to :product_category


  validates :name, presence: true
  validates :price, presence: true
  validates :product_category_id, presence: true
  validates_uniqueness_of :slug


  def in_cart?(cart)
    if cart and cart.line_items
      cart.line_items.find_by(product_id: self.id) ? true : false
    else
      false
    end
  end

end

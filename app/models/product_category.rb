class ProductCategory < ActiveRecord::Base

  extend FriendlyId
  friendly_id :slug, use: :slugged

  mount_uploader :avatar, ProductCategoryAvatarUploader
  mount_uploader :large_avatar, ProductCategoryLargeAvatarUploader

  has_many :product_categories, dependent: :destroy
  has_many :products

  
  belongs_to :product_category


  validates :name, presence: true
  validates :description, presence: true
  validates_uniqueness_of :slug

end
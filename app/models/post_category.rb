class PostCategory < ActiveRecord::Base
	extend FriendlyId 
  
  friendly_id :slug, use: :slugged


  mount_uploader :avatar, PostCategoryAvatarUploader


  has_many :post_categories, dependent: :destroy
  has_many :posts


  belongs_to :post_category


  validates :name, presence: true
  validates :post_category_id, presence: true
  validates_uniqueness_of :slug
  
end

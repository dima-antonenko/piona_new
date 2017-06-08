class Post < ActiveRecord::Base
  extend FriendlyId


  friendly_id :slug, use: :slugged
  mount_uploader :avatar, PostAvatarUploader


  belongs_to :post_category


  validates :name, presence: true
  validates :content, presence: true, length: { minimum: 10 }
  validates :lead, presence: true
  validates_uniqueness_of :slug

end

class Banner < ActiveRecord::Base
  
  mount_uploader :image, BannerImageUploader

  validates :title, presence: true
  validates :link, presence: true

end
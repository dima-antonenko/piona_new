class Slide < ActiveRecord::Base

  belongs_to :slider
  mount_uploader :image, SlideUploader

  validates :name, presence: true
  validates :slider_id, presence: true
  validates :image, presence: true
  
end

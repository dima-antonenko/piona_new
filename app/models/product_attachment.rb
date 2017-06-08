class ProductAttachment < ActiveRecord::Base

  mount_uploader :image, ProductAttacmentUploader


  belongs_to :product

end
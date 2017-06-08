class ProductQuestion < ActiveRecord::Base

  belongs_to :product

	validates :phone, presence: true
	validates :text, presence: true
	validates :product_id, presence: true
  
end

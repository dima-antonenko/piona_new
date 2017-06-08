class FormRequest < ActiveRecord::Base

	validates :name, presence: true
	validates :phone, presence: true
	validates :text, presence: true
  
end

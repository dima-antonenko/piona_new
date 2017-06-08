class Order < ActiveRecord::Base

  enum size_type: { normal_order: 0, quick_order: 1 }


  has_many :line_items, dependent: :destroy


  validates :customer_phone, presence: true, length: { minimum: 5 }

end
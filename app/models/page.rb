class Page < ActiveRecord::Base

  validates :name, presence: true
  validates :descriptor, presence: true

end
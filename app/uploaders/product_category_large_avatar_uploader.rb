class ProductCategoryLargeAvatarUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  storage :file

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # страница редактирования категории в админке
  version :edit_thumb do
    process resize_to_fill: [270,135]
  end

  # большое изображение на странице категории
  version :page_category do
    process resize_to_fill: [871,288]
  end
  
end
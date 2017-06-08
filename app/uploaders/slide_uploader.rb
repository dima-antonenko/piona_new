class SlideUploader < CarrierWave::Uploader::Base

  include CarrierWave::MiniMagick

  storage :file

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  version :administrator_edit_thumb do
    process resize_to_fill: [240,240]
  end

  version :list_thumb do
    process resize_to_fill: [100,100]
  end

  version :main_page do
    process resize_to_fill: [1200,450]
  end  

end
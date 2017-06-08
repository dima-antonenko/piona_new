class Administrators::SlidersController < AdministratorsController
  
 	
  before_action :set_slider, only: [:edit]	


  def index
    @sliders = Slider.all
  end

  def edit
  	@slides = Slide.where(slider_id: @slider.id)
  end


  private


  def set_slider
    @slider = Slider.find(params[:id])
  end


end
class Administrators::SlidesController < AdministratorsController
   	
  before_action :set_slider, only: [:edit, :destroy, :update]	


  def edit
    @sliders = Slider.all.collect {|slide| [slide.name, slide.id ]}
  end

  def destroy
    @slide.destroy
    respond_to do |format|
      format.html { redirect_to edit_administrators_slider_path(@slide.slider_id), notice: 'Слайд удален' }
      format.js {render js: "crud_ui.destroy_list_item(#{@slide.id});"}
    end
  end

  def new
    @slide = Slide.new
    @sliders = Slider.all.collect {|slide| [slide.name, slide.id ]}
  end

  def create
    @slide = Slide.new(slide_params)
    respond_to do |format|
      if @slide.save
        format.html { redirect_to edit_administrators_slide_path(@slide), notice: 'Слайд обновлен' }
      else
        format.html { redirect_to :back, notice: 'Произошла ошибка' }
        format.js {render js: "crud_ui.failed_update();"}
      end  
    end
  end

  def update
    @slide.update(slide_params)
    respond_to do |format|
      if @slide.save
        format.js {render js: "crud_ui.succes_update();"}
        format.html { redirect_to :back, notice: 'Слайд обновлен' }
      else
        format.html { redirect_to :back, notice: 'Произошла ошибка' }
        format.js {render js: "crud_ui.failed_update();"}
      end  
    end
  end


  private


  def set_slider
    @slide = Slide.find(params[:id])
  end

  def slide_params
    params.require(:slide).permit(:name, :image, :slider_id)
  end

end
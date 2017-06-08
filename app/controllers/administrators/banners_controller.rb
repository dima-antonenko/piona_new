class Administrators::BannersController < AdministratorsController
  before_action :set_banner, only: [:edit, :destroy, :update]

  def edit
   
  end

  def index
  	@banners = Banner.all
  end



  def update
    @banner.update(banner_params)
    respond_to do |format|
      if @banner.save
        format.html { redirect_to :back, notice: 'Объект обновлен' }
      else
        format.html { redirect_to :back, notice: 'Произошла ошибка' }
      end
    end
  end


  private


  def set_banner
    @banner = Banner.find(params[:id])
  end

  def banner_params
    params.require(:banner).permit(:title, :image, :link)
  end
end

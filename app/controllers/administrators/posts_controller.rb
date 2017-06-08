class Administrators::PostsController < AdministratorsController


  before_action :set_post_category, only: [:edit, :update, :destroy]


  def index
    @posts = Post.includes(:post_category).order('created_at DESC').paginate(:page => params[:page], :per_page => 20)
  end

  def new
    @post = Post.new()
    @access_categores = PostCategory.all.collect{|category| [category.name, category.id]} << ['Без категории', 0]
  end

  def create
    @post = Post.new(post_params)
    respond_to do |format|
      if @post.save
        format.html { redirect_to edit_administrators_post_path(@post), notice: 'Запись сохранена' }
      else
        format.html { redirect_to :back, notice: 'Произошла ошибка' }
      end
    end
  end

  def update
    @post.update(post_params)
    respond_to do |format|
      if @post.save
        format.html { redirect_to edit_administrators_post_path(@post), notice: 'Информация сохранена' }
      else
        format.html { redirect_to edit_administrators_post_path(@post), notice: 'Произошла ошибка' }
      end
    end
  end

  def edit
    @access_categores = PostCategory.all.collect{|category| [category.name, category.id]} << ['Без категории', 0]
  end

  def destroy
    @post.destroy
    respond_to do |format|
      format.js {render js: "crud_ui.destroy_list_item(#{@post.id});"}
      format.html { redirect_to administrators_posts_path, notice: 'Запись удалена' }
    end
  end


  private


  def set_post_category
    @post = Post.friendly.find(params[:id])
  end

  def post_params
    params.require(:post).permit(:name, :post_category_id, :slug, :content, :avatar,
                                 :meta_title, :meta_description, :meta_keywords, :lead)
  end


end

class Site::PostCategoriesController < SiteController

  def show
    @post_categories = PostCategory.all
    @post_category = PostCategory.friendly.find(params[:id])
    @posts = @post_category.posts.paginate(page: params[:page], per_page: 10)
    @random_posts = Post.limit(3)
    render theme_path('post_category')
  end

end
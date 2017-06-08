class Site::PostsController < SiteController

  def show
    @post = Post.friendly.find(params[:id])
    @post_category = @post.post_category
    @random_posts = Post.limit(3)
    render theme_path('post')
  end

end
Rails.application.routes.draw do

  mount Ckeditor::Engine => '/ckeditor'
  root 'site/static_pages#home'
  
  devise_for :administrators
  
  get 'administrators/dashboard', as: 'administrator_root'

  match "/administrators/products/checked" => "administrators/products#checked", via: [:get, :post]


  scope module: 'site' do
    resources :products, only: [:show]

    resources :product_categories, only: [:show]

    resources :post_categories, only: [:show]

    resources :posts, only: [:show]

    resources :back_calls, only: [:create]

    resources :product_questions, only: [:create]

    resources :form_requests, only: [:create]

    resources :carts, only: [:show, :create, :destroy]

    resources :line_items, only: [:create, :destroy]
    
    resources :orders, only: [:create]
  end


  get "/contacts"          => "site/static_pages#contacts", via: [:get]
  get "/company_info"      => "site/static_pages#company_info", via: [:get]
  get "/delivery_info"     => "site/static_pages#delivery_info", via: [:get]
  get "/payment_info"      => "site/static_pages#payment_info", via: [:get]
  get "/terms_of_service"  => "site/static_pages#terms_of_service", via: [:get]

  get "/search_product"  => "site/static_pages#search_product", via: [:get]

  match "/orders/create_quick" => "site/orders#create_quick", via: [:post]


  namespace :administrators do
    resources :products, only: [:index, :edit, :update, :create, :destroy, :new]

    resources :product_attacments,  only: [:destroy]

    resources :product_categories, only: [:index, :edit, :update, :create, :destroy, :new]

    resources :post_categories, only: [:index, :edit, :update, :create, :destroy, :new]

    resources :posts, only: [:index, :edit, :update, :create, :destroy, :new]

    resources :menus, only: [:index, :edit]

    resources :menu_items, only: [:create, :update, :edit, :update] do
      get 'add_children', on: :member,  via: [:get]   
    end  

    resources :sliders, only: [:index, :edit]

    resources :slides, only: [:edit, :update, :create, :destroy, :new]

    resources :site_variables, only: [:edit, :update, :index]

    resources :pages, only: [:edit, :update, :index]

    resources :back_calls, only: [:index, :destroy]

    resources :product_questions, only: [:index, :show, :destroy]

    resources :banners, only: [:index, :edit, :update]

    resources :form_requests,  only: [:index, :show ,:destroy]

    resources :orders, only: [:index, :show, :destroy] 
  end


end
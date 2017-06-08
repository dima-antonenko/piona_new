# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170428072625) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "administrators", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["email"], name: "index_administrators_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_administrators_on_reset_password_token", unique: true, using: :btree
  end

  create_table "back_calls", force: :cascade do |t|
    t.string   "phone"
    t.string   "product_id"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.json     "product_data", default: {}, null: false
    t.index ["phone"], name: "index_back_calls_on_phone", using: :btree
    t.index ["product_id"], name: "index_back_calls_on_product_id", using: :btree
  end

  create_table "banners", force: :cascade do |t|
    t.string "title"
    t.string "descriptor"
    t.string "image"
    t.string "link"
    t.index ["descriptor"], name: "index_banners_on_descriptor", using: :btree
    t.index ["image"], name: "index_banners_on_image", using: :btree
    t.index ["link"], name: "index_banners_on_link", using: :btree
    t.index ["title"], name: "index_banners_on_title", using: :btree
  end

  create_table "carts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "ckeditor_assets", force: :cascade do |t|
    t.string   "data_file_name",               null: false
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.string   "type",              limit: 30
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["type"], name: "index_ckeditor_assets_on_type", using: :btree
  end

  create_table "form_requests", force: :cascade do |t|
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.string   "name",       default: "", null: false
    t.string   "email",      default: "", null: false
    t.string   "phone",      default: "", null: false
    t.text     "text",       default: "", null: false
  end

  create_table "line_items", force: :cascade do |t|
    t.integer "product_id"
    t.integer "cart_id"
    t.integer "quantity",      default: 1
    t.integer "order_id"
    t.string  "product_name"
    t.string  "product_price"
    t.integer "total_price",   default: 0, null: false
    t.index ["cart_id"], name: "index_line_items_on_cart_id", using: :btree
    t.index ["order_id"], name: "index_line_items_on_order_id", using: :btree
    t.index ["product_id"], name: "index_line_items_on_product_id", using: :btree
    t.index ["quantity"], name: "index_line_items_on_quantity", using: :btree
  end

  create_table "menu_items", force: :cascade do |t|
    t.string  "title"
    t.string  "url"
    t.integer "menu_id",      default: 0
    t.integer "position",     default: 1
    t.integer "menu_item_id", default: 0, null: false
    t.string  "ancestry"
    t.index ["menu_id"], name: "index_menu_items_on_menu_id", using: :btree
    t.index ["position"], name: "index_menu_items_on_position", using: :btree
    t.index ["title"], name: "index_menu_items_on_title", using: :btree
    t.index ["url"], name: "index_menu_items_on_url", using: :btree
  end

  create_table "menus", force: :cascade do |t|
    t.string "name"
    t.string "descriptor"
    t.index ["descriptor"], name: "index_menus_on_descriptor", using: :btree
    t.index ["name"], name: "index_menus_on_name", using: :btree
  end

  create_table "orders", force: :cascade do |t|
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.string   "customer_name",    default: "", null: false
    t.string   "customer_email",   default: "", null: false
    t.string   "customer_phone",   default: "", null: false
    t.string   "customer_city",    default: "", null: false
    t.integer  "total_price",      default: 0,  null: false
    t.string   "customer_address", default: "", null: false
    t.integer  "size_type",        default: 0,  null: false
  end

  create_table "pages", force: :cascade do |t|
    t.string "name"
    t.string "descriptor"
    t.text   "description"
    t.string "meta_title",       default: "", null: false
    t.text   "meta_description", default: "", null: false
    t.text   "meta_keywords",    default: "", null: false
    t.index ["descriptor"], name: "index_pages_on_descriptor", using: :btree
    t.index ["name"], name: "index_pages_on_name", using: :btree
  end

  create_table "post_categories", force: :cascade do |t|
    t.string   "name"
    t.string   "slug"
    t.text     "description"
    t.string   "avatar"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.integer  "post_category_id", default: 0,  null: false
    t.string   "meta_title",       default: "", null: false
    t.text     "meta_description", default: "", null: false
    t.text     "meta_keywords",    default: "", null: false
    t.index ["avatar"], name: "index_post_categories_on_avatar", using: :btree
    t.index ["description"], name: "index_post_categories_on_description", using: :btree
    t.index ["name"], name: "index_post_categories_on_name", using: :btree
    t.index ["slug"], name: "index_post_categories_on_slug", using: :btree
  end

  create_table "posts", force: :cascade do |t|
    t.string   "name"
    t.integer  "post_category_id"
    t.string   "slug"
    t.text     "content"
    t.string   "avatar"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.string   "lead"
    t.string   "meta_title",       default: "", null: false
    t.text     "meta_description", default: "", null: false
    t.text     "meta_keywords",    default: "", null: false
    t.index ["avatar"], name: "index_posts_on_avatar", using: :btree
    t.index ["content"], name: "index_posts_on_content", using: :btree
    t.index ["name"], name: "index_posts_on_name", using: :btree
    t.index ["post_category_id"], name: "index_posts_on_post_category_id", using: :btree
    t.index ["slug"], name: "index_posts_on_slug", using: :btree
  end

  create_table "product_attachments", force: :cascade do |t|
    t.integer  "product_id"
    t.string   "image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["image"], name: "index_product_attachments_on_image", using: :btree
    t.index ["product_id"], name: "index_product_attachments_on_product_id", using: :btree
  end

  create_table "product_categories", force: :cascade do |t|
    t.string  "name"
    t.string  "slug"
    t.string  "avatar"
    t.text    "description"
    t.string  "banner"
    t.integer "product_category_id", default: 0
    t.string  "meta_title",          default: ""
    t.text    "meta_description",    default: ""
    t.text    "meta_keywords",       default: ""
    t.string  "large_avatar",        default: "", null: false
    t.index ["avatar"], name: "index_product_categories_on_avatar", using: :btree
    t.index ["description"], name: "index_product_categories_on_description", using: :btree
    t.index ["name"], name: "index_product_categories_on_name", using: :btree
    t.index ["slug"], name: "index_product_categories_on_slug", using: :btree
  end

  create_table "product_questions", force: :cascade do |t|
    t.string   "name"
    t.string   "phone"
    t.text     "text"
    t.string   "product_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_product_questions_on_name", using: :btree
    t.index ["phone"], name: "index_product_questions_on_phone", using: :btree
    t.index ["product_id"], name: "index_product_questions_on_product_id", using: :btree
    t.index ["text"], name: "index_product_questions_on_text", using: :btree
  end

  create_table "products", force: :cascade do |t|
    t.string   "name"
    t.decimal  "price"
    t.string   "slug"
    t.string   "avatar"
    t.text     "description"
    t.string   "seo_title"
    t.string   "seo_description"
    t.string   "seo_keywords"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.boolean  "active",              default: true
    t.integer  "product_category_id", default: 0
    t.string   "meta_title"
    t.text     "meta_description"
    t.text     "meta_keywords"
    t.integer  "qty",                 default: 1,    null: false
    t.boolean  "stock",               default: true, null: false
    t.text     "short_description",   default: "",   null: false
    t.index ["avatar"], name: "index_products_on_avatar", using: :btree
    t.index ["description"], name: "index_products_on_description", using: :btree
    t.index ["name"], name: "index_products_on_name", using: :btree
    t.index ["price"], name: "index_products_on_price", using: :btree
    t.index ["seo_description"], name: "index_products_on_seo_description", using: :btree
    t.index ["seo_keywords"], name: "index_products_on_seo_keywords", using: :btree
    t.index ["seo_title"], name: "index_products_on_seo_title", using: :btree
    t.index ["slug"], name: "index_products_on_slug", using: :btree
  end

  create_table "site_variables", force: :cascade do |t|
    t.string "title"
    t.string "descriptor"
    t.string "content"
    t.index ["content"], name: "index_site_variables_on_content", using: :btree
    t.index ["descriptor"], name: "index_site_variables_on_descriptor", using: :btree
    t.index ["title"], name: "index_site_variables_on_title", using: :btree
  end

  create_table "sliders", force: :cascade do |t|
    t.string "name"
    t.string "descriptor"
    t.index ["descriptor"], name: "index_sliders_on_descriptor", using: :btree
    t.index ["name"], name: "index_sliders_on_name", using: :btree
  end

  create_table "slides", force: :cascade do |t|
    t.string  "name"
    t.string  "image"
    t.integer "slider_id"
    t.text    "description"
    t.index ["description"], name: "index_slides_on_description", using: :btree
    t.index ["image"], name: "index_slides_on_image", using: :btree
    t.index ["name"], name: "index_slides_on_name", using: :btree
    t.index ["slider_id"], name: "index_slides_on_slider_id", using: :btree
  end

end

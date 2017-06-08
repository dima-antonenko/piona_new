module InterfaceHelper

  #галочка
  def check_mark(property)
    if property == true
      '<i class="material-icons uk-text-success md-24">&#xE834;</i>'.html_safe
    elsif property == false
      '<i class="material-icons uk-text-muted md-24">&#xE835;</i>'.html_safe
    end
  end

  #родительская категория товара в списке товаров
  def get_product_category_name(product)
    if product.product_category
      product.product_category.name
    else
      'без категории'
    end
  end

 
end

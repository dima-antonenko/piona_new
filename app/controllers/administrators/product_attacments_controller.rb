class Administrators::ProductAttacmentsController < AdministratorsController

  def destroy
    attacment = ProductAttachment.find(params[:id])
    attacment.destroy
    respond_to do |format|
      format.js {render js: "crud_ui.destroy_list_item(#{attacment.id});"}
    end
  end
 

end
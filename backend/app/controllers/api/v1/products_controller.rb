class Api::V1::ProductsController < ApplicationController
  skip_before_action :authorized, only: [:index, :show]
  before_action :set_product, only: [:show, :update, :destroy]

  def index
    if params[:keyword].present?
      # Search by name, description, author, or genre  trỏ 35-60
      keyword = "%#{params[:keyword]}%"
      @products = ::Product.where(
        "name LIKE ? OR description LIKE ? OR author LIKE ? OR genre LIKE ?",
        keyword, keyword, keyword, keyword
      )
    else
      @products = ::Product.all
    end
    render json: @products.as_json(methods: :cover_photo_url)
  end

  def show
    render json: @product.as_json(methods: :cover_photo_url)
  end

  def create
    @product = ::Product.new(product_params)
    if @product.save
      render json: @product.as_json(methods: :cover_photo_url), status: :created
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  def update
    if @product.update(product_params)
      render json: @product.as_json(methods: :cover_photo_url)
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy
    head :no_content
  end

  private

  def set_product
    @product = ::Product.find(params[:id])
  end

  def product_params
    params.require(:product).permit(:name, :description, :author, :release_year, :price, :genre, :rating, :cover_photo)
  end
end
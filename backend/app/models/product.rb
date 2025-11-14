class Product < ApplicationRecord
  has_one_attached :cover_photo
  include Rails.application.routes.url_helpers

  def cover_photo_url
    url_for(cover_photo) if cover_photo.attached?
  end
end
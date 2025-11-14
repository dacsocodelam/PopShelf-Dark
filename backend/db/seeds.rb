
puts "Seeding database..."

Product.destroy_all

Product.create!([
  {
    name: "未来ノート (Mirai Note)",
    description: "A smart notebook for planning and tracking goals.",
    author: "田中 太郎 (Tanaka Tarou)",
    release_year: 2025,
    price: 19.80,
    genre: "Stationery",
    rating: 4.5
  },
  {
    name: "The Great Gatsby",
    description: "A novel by F. Scott Fitzgerald.",
    author: "F. Scott Fitzgerald",
    release_year: 1925,
    price: 15.99,
    genre: "Novel",
    rating: 5
  },
  {
    name: "Inception",
    description: "A mind-bending thriller.",
    author: "Christopher Nolan",
    release_year: 2010,
    price: 19.99,
    genre: "Movie",
    rating: 5
  },
  {
    name: "The Legend of Zelda: Breath of the Wild",
    description: "An action-adventure game.",
    author: "Nintendo",
    release_year: 2017,
    price: 59.99,
    genre: "Game",
    rating: 5
  },
  {
    name: "Atomic Habits",
    description: "A book for building good habits and changing your life.",
    author: "James Clear",
    release_year: 2018,
    price: 12.50,
    genre: "Self-help",
    rating: 4.6
  },
  {
    name: "Interstellar",
    description: "A sci-fi movie about space and time travel.",
    author: "Christopher Nolan",
    release_year: 2014,
    price: 21.00,
    genre: "Movie",
    rating: 4.8
  }
])

puts "Seeding products finished."

# Xóa tất cả user cũ để đảm bảo không bị trùng lặp
User.destroy_all

# Tạo user mới với mật khẩu bạn muốn
User.create!(email: 'admin@example.com', password: 'popshelf22')

puts "Admin user created: admin@example.com / popshelf22"
# frozen_string_literal: trueputs "Creating users:"

puts "Creating users:"
100.times do
  User.create!(email: FFaker::Internet.unique.email,
               username: FFaker::Internet.unique.user_name,
               password: FFaker::Internet.password)
  putc '.'
end
puts ''

puts "Creating items:"
users = User.all.to_a.sample(25)

users.each do |user|
  5.times do
    Item.create!(user: user,
                 title: FFaker::Product.product_name,
                 description: FFaker::Lorem.paragraph,
                 slug: FFaker::Internet.unique.slug)
    putc '.'
  end
end
puts ''

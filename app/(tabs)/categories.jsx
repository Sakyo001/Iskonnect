import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: 'Buildings',
      description: 'Explore modern architecture and iconic structures',
      image: require('../../assets/images/lagoon1.jpg'),
      items: [
        {
          id: 'b1',
          name: 'Empire State Building',
          location: 'New York, USA',
          image: require('../../assets/images/lagoon2.jpg'),
          rating: '4.8'
        },
        {
          id: 'b2',
          name: 'Burj Khalifa',
          location: 'Dubai, UAE',
          image: require('../../assets/images/lagoon3.jpg'),
          rating: '4.9'
        },
        {
          id: 'b3',
          name: 'Shanghai Tower',
          location: 'Shanghai, China',
          image: require('../../assets/images/lagoon4.jpg'),
          rating: '4.7'
        }
      ]
    },
    {
      id: 2,
      title: 'Facilities',
      description: 'Discover amenities and public spaces',
      image: require('../../assets/images/lagoon5.jpg'),
      items: [
        {
          id: 'f1',
          name: 'Central Park',
          type: 'Recreation',
          image: require('../../assets/images/lagoon6.jpg'),
          rating: '4.8'
        },
        {
          id: 'f2',
          name: 'City Library',
          type: 'Education',
          image: require('../../assets/images/lagoon7.jpg'),
          rating: '4.6'
        },
        {
          id: 'f3',
          name: 'Sports Complex',
          type: 'Athletics',
          image: require('../../assets/images/lagoon8.jpg'),
          rating: '4.7'
        }
      ]
    },
    {
      id: 3,
      title: 'Organizations',
      description: 'Connect with local and global organizations',
      image: require('../../assets/images/lagoon9.jpg'),
      items: [
        {
          id: 'o1',
          name: 'Red Cross',
          type: 'Non-Profit',
          image: require('../../assets/images/lagoon10.jpg'),
          rating: '4.9'
        },
        {
          id: 'o2',
          name: 'World Health Org',
          type: 'International',
          image: require('../../assets/images/lagoon11.jpg'),
          rating: '4.8'
        },
        {
          id: 'o3',
          name: 'Local Food Bank',
          type: 'Community',
          image: require('../../assets/images/lagoon12.jpg'),
          rating: '4.7'
        }
      ]
    }
  ]

  const renderCategoryItems = (items) => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mt-4"
    >
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="mr-4 w-64 bg-white rounded-xl shadow-sm overflow-hidden"
          activeOpacity={0.7}
        >
          <Image
            source={item.image}
            className="w-full h-36"
            resizeMode="cover"
          />
          <View className="p-3">
            <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-gray-500">
                {item.location || item.type}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-yellow-500">★</Text>
                <Text className="ml-1 text-gray-600">{item.rating}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-800">Categories</Text>
        <Text className="text-gray-500 mt-2">Explore different sections</Text>
      </View>

      {/* Categories */}
      <View className="px-4 pb-36">
        {categories.map((category) => (
          <View key={category.id} className="mb-8">
            {/* Category Header */}
            <View className="flex-row items-center">
              <Image
                source={category.image}
                className="w-12 h-12 rounded-full"
              />
              <View className="ml-3">
                <Text className="text-xl font-semibold text-gray-800">
                  {category.title}
                </Text>
                <Text className="text-sm text-gray-500">
                  {category.description}
                </Text>
              </View>
            </View>

            {/* Category Items */}
            {renderCategoryItems(category.items)}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default Categories
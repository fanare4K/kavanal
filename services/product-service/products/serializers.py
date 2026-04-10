from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    # For reading (GET)
    category = CategorySerializer(read_only=True)

    # For writing (POST/PUT)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'description',
            'stock',
            'category',
            'category_id'
        ]
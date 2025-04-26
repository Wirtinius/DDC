from .models import DDC, Category, Status, SubCategory, Type
from rest_framework import serializers


class DDCSerializer(serializers.ModelSerializer):
    class Meta:
        model = DDC
        fields = '__all__'
        required_fields = []


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = '__all__'
        

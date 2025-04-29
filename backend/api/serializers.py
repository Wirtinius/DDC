from .models import DDC, Category, Status, SubCategory, Type
from rest_framework import serializers


class DDCSerializer(serializers.ModelSerializer):
    status      = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all())
    type        = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all())
    category    = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    subcategory = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all())

    class Meta:
        model  = DDC
        fields = [
            "id", "sum", "status", "type",
            "category", "subcategory",
            "comment", "date"
        ]


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
        

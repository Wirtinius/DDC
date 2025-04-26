from .models import DDC, Type, Status, Category, SubCategory
from .serializers import DDCSerializer, TypeSerializer, StatusSerializer, CategorySerializer, SubCategorySerializer
from rest_framework import generics, viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter


class DDCViewSet(viewsets.ModelViewSet):
    queryset = DDC.objects.all()
    serializer_class = DDCSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = {
        "status": ["exact"], 
        "type": ["exact"], 
        "category": ["exact"], 
        "subcategory": ["exact"], 
        "date": ["gte", "lte"]
    }
    ordering_fields = ["sum"]


class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer


class TypeViewSet(viewsets.ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
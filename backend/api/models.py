from django.db import models

class DDC(models.Model):
    sum = models.FloatField(null=False, blank=False)
    status = models.ForeignKey('Status', on_delete=models.CASCADE, null=False, blank=False)
    type = models.ForeignKey('Type', on_delete=models.CASCADE, null=False, blank=False)
    category = models.ForeignKey('Category', on_delete=models.CASCADE, null=False, blank=False)
    subcategory = models.ForeignKey('SubCategory', on_delete=models.CASCADE, null=False, blank=False)
    comment = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.sum


class Status(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)


class Type(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)


class Category(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    type = models.ForeignKey(Type, on_delete=models.CASCADE, null=False, blank=False)


class SubCategory(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=False, blank=False)
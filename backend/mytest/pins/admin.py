from django.contrib import admin
from pins.models import Pin, Saved, PinMessage, Category
# Register your models here.
admin.site.register(Pin)
admin.site.register(Saved)
admin.site.register(PinMessage)
admin.site.register(Category)

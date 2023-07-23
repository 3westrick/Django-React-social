from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Category(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title


class Pin(models.Model):
    title = models.CharField(max_length=255)
    about = models.TextField(null=True, blank=True)
    url = models.TextField(null=True, blank=True, default=None)
    image = models.ImageField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def user_pin(self, user):
        return self.saves.filter(user=user).exists()


# user.pinmessage_set.all()
# user.pinmessage_set.first()
class PinMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pin = models.ForeignKey(Pin, on_delete=models.CASCADE)
    text = models.TextField()
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.pin) + '-' + str(self.user)

    class Meta:
        ordering = ['-created']


class Saved(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    saves = models.ManyToManyField(Pin, related_name='saves', blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class Image(models.Model):
    image = models.ImageField()
# get saves with user : user.saved_set.get(user=user).saves.all()
# get saves with pin and user : pin.saves.filter(user=user)

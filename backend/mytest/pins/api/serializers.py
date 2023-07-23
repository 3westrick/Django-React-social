from rest_framework import serializers
from ..models import Pin, PinMessage, Category, Image
from django.contrib.auth.models import User


class UserInlineSerializer(serializers.Serializer):
    username = serializers.CharField(read_only=True)
    id = serializers.IntegerField(read_only=True)


class CategoryInlineSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(read_only=True)


class PinInlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = ["id", "title", "about", "url", 'image']




class PinListSerializer(serializers.ModelSerializer):
    owner = UserInlineSerializer(source="user", read_only=True)
    saved = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Pin
        fields = ['id', 'title', 'url', 'image', 'owner', 'saved']

    def get_saved(self, obj):
        request = self.context.get('request')
        if not hasattr(obj, 'id'):
            return None
        if not isinstance(obj, Pin):
            return None
        try:
            if isinstance(request.user, User):
                return obj.user_pin(request.user)
        except:
            return False


class UserSerializer(serializers.ModelSerializer):
    pins = PinListSerializer(source="pin_set", read_only=True, many=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "pins"]

class Msg(serializers.ModelSerializer):
    user = UserInlineSerializer(read_only=True)

    class Meta:
        model = PinMessage
        fields = ['id', 'user', 'text']


class PinSingleSerializer(serializers.ModelSerializer):
    owner = UserInlineSerializer(source="user", read_only=True)
    category = CategoryInlineSerializer(read_only=True)
    url = serializers.CharField(max_length=250, allow_blank=True)
    messages = Msg(
        source="pinmessage_set",
        many=True,
        read_only=True,
    )

    class Meta:
        model = Pin
        fields = ['id', 'title', 'about', 'url', 'image', 'owner', 'category', 'messages']


class PinMessageSerializer(serializers.ModelSerializer):
    sender = UserInlineSerializer(source="user", read_only=True)
    pin = PinInlineSerializer(read_only=True)

    class Meta:
        model = PinMessage
        fields = ['id', 'text', 'sender', 'pin']


class PinSavedSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='pin-detail',
        lookup_field='pk',
    )

    class Meta:
        model = Pin
        fields = ['id', 'title', 'about', 'image', 'url']


class SavedSerializer(serializers.ModelSerializer):
    saves = PinSavedSerializer(many=True)

    class Meta:
        model = PinMessage
        fields = ['saves']


class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title']


class ImageSerial(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['image']

"""
URL configuration for mytest project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from pins.api.views import MyTokenObtainPairView, create_auth


@api_view(['GET'])
def get_routes(request):
    routes = [
        'http://127.0.0.1:8000/api/pins/',
        'http://127.0.0.1:8000/api/pins/:id',
        'http://127.0.0.1:8000/api/pins/:id/update/',
        'http://127.0.0.1:8000/api/pins/:id/delete/',
        'http://127.0.0.1:8000/api/pins/:id/messages/',
        'http://127.0.0.1:8000/api/pins/:id/messages/create/',
        'http://127.0.0.1:8000/api/pins/create/',
        'http://127.0.0.1:8000/api/pins/saves/',
        'http://127.0.0.1:8000/api/pins/:id/save/',
    ]
    return Response(routes)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/pins/", include('pins.api.urls')),
    path("api/", get_routes),
    path("api/user/login/", create_auth),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.urls import path
from . import views

urlpatterns = [
    path('', views.PinList.as_view()),
    path('user/<int:pk>/', views.UserRetrieve.as_view()),
    path('<int:pk>/', views.PinDetail.as_view(), name='pin-detail'),
    path('<int:pk>/update/', views.PinUpdate.as_view()),
    path('<int:pk>/delete/', views.PinDelete.as_view()),
    path('create/', views.PinCreate.as_view()),
    path('<int:pk>/messages/', views.MessageList.as_view()),
    path('<int:pk>/messages/create/', views.MessageCreate.as_view()),

    path('saves/', views.SaveList.as_view()),
    path('<int:pk>/save/', views.save_pin, name="save-pin"),

    path('categories/', views.CatList.as_view()),
    path('categories/<str:username>/', views.cat_pin),

    # path('<int:pk>/', views.ProductDetailAPIView.as_view(), name="product-detail"),  # detail
    # path('<int:pk>/update/', views.ProductUpdateAPIView.as_view(), name="product-edit"),  # update
    # path('<int:pk>/delete/', views.ProductDestroyAPIView.as_view()),  # delete
    # path('', views.ProductListCreateAPIView.as_view()),  # list / create

]

# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginViewSet, PaymentViewSet, ReceiptViewSet
from . import views

router = DefaultRouter()
router.register(r'users', LoginViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'receipts', ReceiptViewSet)

urlpatterns = [
    path('login/', views.login_user, name='login'),
    path('', include(router.urls)),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginViewSet, PaymentViewSet, get_payments
from . import views

router = DefaultRouter()
router.register(r'users', LoginViewSet)  # Changed from 'login' to avoid confusion
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('login/', views.login_user, name='login'),  # This will become /api/login/
    path('payments/report/', get_payments, name='get_payments'),
    path('', include(router.urls)),  # This will become /api/users/ and /api/payments/
    
]
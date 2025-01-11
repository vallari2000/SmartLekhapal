from rest_framework import serializers
from .models import Login, Payment, Receipt

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = '__all__'
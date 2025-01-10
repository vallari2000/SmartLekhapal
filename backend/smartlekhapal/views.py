from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Login, Payment
from .serializers import LoginSerializer, PaymentSerializer
from rest_framework.permissions import IsAuthenticated

from .models import Login
from django.db.models import Q
from django.http import JsonResponse
from datetime import datetime

@api_view(['POST'])
def get_payments(request):
    data = request.data
    month = data.get('month')
    zoneid = data.get('zoneid')
    year = data.get('year', datetime.now().year)  # Get year from request or use current year as default
    
    month_num = datetime.strptime(month, '%B').month
    
    payments = Payment.objects.filter(
        zoneid=zoneid,
        date__year=year,
        date__month=month_num
    ).values(
        'id', 'date', 'chqno', 'voucherno', 'particulars',
        'adm_fees', 'pm_fees', 'apm_fees', 'fppm_fees',
        'samvad_donation', 'legal_fund', 'misc_donation',
        'drf_fees', 'adv_samvad', 'interest_sb', 'interest_fd',
        'investments', 'guest_house_receipt', 'building_fund',
        'sundry_receipt', 'dividend', 'tds_amount', 'transfer_to_hq',
        'total_amount'
    ).order_by('-date')
    
    return Response(list(payments))

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = Login.objects.get(username=username, password=password)
        return Response({
            'status': 'success',
            'data': {
                'username': user.username,
                'zoneid': user.zoneid,
                'zone_name': user.zone_name
            }
        })
    except Login.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
class LoginViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Login.objects.all()
    serializer_class = LoginSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
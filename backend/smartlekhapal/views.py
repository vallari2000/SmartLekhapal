from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import status
from .models import Login, Payment, Receipt
from .serializers import LoginSerializer, PaymentSerializer, ReceiptSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Sum
from django.http import JsonResponse
from datetime import datetime
from django.contrib.auth import login


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = Login.objects.get(username=username, password=password)
        # Create a session
        request.session['user_id'] = user.id
        request.session['zoneid'] = user.zoneid
        
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
    queryset = Login.objects.all()
    serializer_class = LoginSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    

    def get_queryset(self):
        # Get zoneid from session
        zoneid = self.request.session.get('zoneid')
        queryset = Payment.objects.all()
        if zoneid:
            queryset = queryset.filter(zoneid=zoneid)
        return queryset

    def create(self, request):
        try:
            amounts = request.data.get('amounts', [])
            if len(amounts) != 19:
                return Response(
                    {'error': 'Invalid number of amounts provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            payment_data = {
                'date': request.data.get('date'),
                'chqno': request.data.get('chqno'),
                'voucherno': request.data.get('voucherno'),
                'particulars': request.data.get('particulars'),
                'zoneid': request.data.get('zoneid'),
                
                'adm_fees': amounts[0] or 0,
                'pm_fees': amounts[1] or 0,
                'apm_fees': amounts[2] or 0,
                'fppm_fees': amounts[3] or 0,
                'samvad_donation': amounts[4] or 0,
                'legal_fund': amounts[5] or 0,
                'misc_donation': amounts[6] or 0,
                'drf_fees': amounts[7] or 0,
                'adv_samvad': amounts[8] or 0,
                'interest_sb': amounts[9] or 0,
                'interest_fd': amounts[10] or 0,
                'investments': amounts[11] or 0,
                'guest_house_receipt': amounts[12] or 0,
                'building_fund': amounts[13] or 0,
                'sundry_receipt': amounts[14] or 0,
                'dividend': amounts[15] or 0,
                'tds_amount': amounts[16] or 0,
                'transfer_to_hq': amounts[17] or 0,
                'total_amount': amounts[18] or 0,
            }

            serializer = self.get_serializer(data=payment_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            amounts = request.data.get('amounts', [])
            
            payment_data = {
                'date': request.data.get('date', instance.date),
                'chqno': request.data.get('chqno', instance.chqno),
                'voucherno': request.data.get('voucherno', instance.voucherno),
                'particulars': request.data.get('particulars', instance.particulars),
                'zoneid': request.data.get('zoneid', instance.zoneid),
            }

            if amounts:
                payment_data.update({
                    'adm_fees': amounts[0] or 0,
                    'pm_fees': amounts[1] or 0,
                    'apm_fees': amounts[2] or 0,
                    'fppm_fees': amounts[3] or 0,
                    'samvad_donation': amounts[4] or 0,
                    'legal_fund': amounts[5] or 0,
                    'misc_donation': amounts[6] or 0,
                    'drf_fees': amounts[7] or 0,
                    'adv_samvad': amounts[8] or 0,
                    'interest_sb': amounts[9] or 0,
                    'interest_fd': amounts[10] or 0,
                    'investments': amounts[11] or 0,
                    'guest_house_receipt': amounts[12] or 0,
                    'building_fund': amounts[13] or 0,
                    'sundry_receipt': amounts[14] or 0,
                    'dividend': amounts[15] or 0,
                    'tds_amount': amounts[16] or 0,
                    'transfer_to_hq': amounts[17] or 0,
                    'total_amount': amounts[18] or 0,
                })

            serializer = self.get_serializer(instance, data=payment_data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['POST'])
    def get_monthly_payments(self, request):
        try:
            month = request.data.get('month')
            zoneid = request.data.get('zoneid')
            year = request.data.get('year', datetime.now().year)
            
            month_num = datetime.strptime(month, '%B').month
            
            payments = self.get_queryset().filter(
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
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['GET'], url_path='by-voucher/(?P<voucherno>\d+)')
    def by_voucher(self, request, voucherno=None):
        try:
            print("Debug - Looking for voucher:", voucherno)  # Debug print
            print("Debug - Session:", request.session.items())  # Debug print
            
            payment = self.get_queryset().get(voucherno=voucherno)
            serializer = self.get_serializer(payment)
            return Response(serializer.data)
        except Payment.DoesNotExist:
            return Response(
                {'error': 'Payment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
    @action(detail=False, methods=['GET'])
    def summary(self, request):
        try:
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')
            zoneid = request.query_params.get('zoneid')

            queryset = self.get_queryset()

            if start_date:
                queryset = queryset.filter(date__gte=start_date)
            if end_date:
                queryset = queryset.filter(date__lte=end_date)
            if zoneid:
                queryset = queryset.filter(zoneid=zoneid)

            summary = queryset.aggregate(
                total_adm_fees=Sum('adm_fees'),
                total_pm_fees=Sum('pm_fees'),
                total_apm_fees=Sum('apm_fees'),
                total_fppm_fees=Sum('fppm_fees'),
                total_samvad_donation=Sum('samvad_donation'),
                total_legal_fund=Sum('legal_fund'),
                total_misc_donation=Sum('misc_donation'),
                total_drf_fees=Sum('drf_fees'),
                total_adv_samvad=Sum('adv_samvad'),
                total_interest_sb=Sum('interest_sb'),
                total_interest_fd=Sum('interest_fd'),
                total_investments=Sum('investments'),
                total_guest_house_receipt=Sum('guest_house_receipt'),
                total_building_fund=Sum('building_fund'),
                total_sundry_receipt=Sum('sundry_receipt'),
                total_dividend=Sum('dividend'),
                total_tds_amount=Sum('tds_amount'),
                total_transfer_to_hq=Sum('transfer_to_hq'),
                grand_total=Sum('total_amount')
            )

            return Response(summary)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ReceiptViewSet(viewsets.ModelViewSet):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer

    def get_queryset(self):
        queryset = Receipt.objects.all()
        zoneid = self.request.session.get('zoneid')
        if zoneid:
            queryset = queryset.filter(zoneid=zoneid)
        return queryset.order_by('-date')

    def create(self, request):
        try:
            amounts = request.data.get('amounts', [])
            if len(amounts) != 19:
                return Response(
                    {'error': 'Invalid number of amounts provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            receipt_data = {
                'date': request.data.get('date'),
                'chqno': request.data.get('chqno'),
                'voucherno': request.data.get('voucherno'),
                'particulars': request.data.get('particulars'),
                'zoneid': request.data.get('zoneid'),
                
                'adm_fees': amounts[0] or 0,
                'pm_fees': amounts[1] or 0,
                'apm_fees': amounts[2] or 0,
                'fppm_fees': amounts[3] or 0,
                'samvad_donation': amounts[4] or 0,
                'legal_fund': amounts[5] or 0,
                'misc_donation': amounts[6] or 0,
                'drf_fees': amounts[7] or 0,
                'adv_samvad': amounts[8] or 0,
                'interest_sb': amounts[9] or 0,
                'interest_fd': amounts[10] or 0,
                'investments': amounts[11] or 0,
                'guest_house_receipt': amounts[12] or 0,
                'building_fund': amounts[13] or 0,
                'sundry_receipt': amounts[14] or 0,
                'dividend': amounts[15] or 0,
                'tds_amount': amounts[16] or 0,
                'transfer_from_hq': amounts[17] or 0,
                'total_amount': amounts[18] or 0,
            }

            serializer = self.get_serializer(data=receipt_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    @action(detail=False, methods=['GET'], url_path='by-voucher/(?P<voucherno>\d+)')
    def by_voucher(self, request, voucherno=None):
        try:
            print("Debug - Looking for voucher:", voucherno)  # Debug print
            print("Debug - Session:", request.session.items())  # Debug print
            
            zoneid = request.session.get('zoneid')
            receipt = Receipt.objects.filter(zoneid=zoneid).get(voucherno=voucherno)
            serializer = self.get_serializer(receipt)
            return Response(serializer.data)
        except Receipt.DoesNotExist:
            return Response(
                {'message': f'Voucher number {voucherno} not present'},
                status=status.HTTP_404_NOT_FOUND
            )
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            amounts = request.data.get('amounts', [])
            
            receipt_data = {
                'date': request.data.get('date', instance.date),
                'chqno': request.data.get('chqno', instance.chqno),
                'voucherno': request.data.get('voucherno', instance.voucherno),
                'particulars': request.data.get('particulars', instance.particulars),
                'zoneid': request.data.get('zoneid', instance.zoneid),
            }

            if amounts:
                receipt_data.update({
                    'adm_fees': amounts[0] or 0,
                    'pm_fees': amounts[1] or 0,
                    'apm_fees': amounts[2] or 0,
                    'fppm_fees': amounts[3] or 0,
                    'samvad_donation': amounts[4] or 0,
                    'legal_fund': amounts[5] or 0,
                    'misc_donation': amounts[6] or 0,
                    'drf_fees': amounts[7] or 0,
                    'adv_samvad': amounts[8] or 0,
                    'interest_sb': amounts[9] or 0,
                    'interest_fd': amounts[10] or 0,
                    'investments': amounts[11] or 0,
                    'guest_house_receipt': amounts[12] or 0,
                    'building_fund': amounts[13] or 0,
                    'sundry_receipt': amounts[14] or 0,
                    'dividend': amounts[15] or 0,
                    'tds_amount': amounts[16] or 0,
                    'transfer_from_hq': amounts[17] or 0,
                    'total_amount': amounts[18] or 0,
                })

            serializer = self.get_serializer(instance, data=receipt_data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['POST'])
    def get_monthly_receipts(self, request):
        try:
            month = request.data.get('month')
            zoneid = request.data.get('zoneid')
            year = request.data.get('year')
            
            # Only validate that required fields exist
            if any(param is None for param in [month, zoneid, year]):
                return Response(
                    {'error': 'Missing required parameters', 'received': {
                        'month': month,
                        'zoneid': zoneid,
                        'year': year
                    }},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            try:
                month_num = datetime.strptime(month, '%B').month
            except ValueError as e:
                return Response(
                    {'error': f'Invalid month format: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            receipts = self.get_queryset().filter(
                zoneid=zoneid,
                date__year=year,
                date__month=month_num
            ).values(
                'id', 'date', 'chqno', 'voucherno', 'particulars',
                'adm_fees', 'pm_fees', 'apm_fees', 'fppm_fees',
                'samvad_donation', 'legal_fund', 'misc_donation',
                'drf_fees', 'adv_samvad', 'interest_sb', 'interest_fd',
                'investments', 'guest_house_receipt', 'building_fund',
                'sundry_receipt', 'dividend', 'tds_amount', 'transfer_from_hq',
                'total_amount'
            ).order_by('-date')
            
            return Response(list(receipts))
        except Exception as e:
            print(f"Error in get_monthly_receipts: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['GET'])
    def summary(self, request):
        try:
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')
            zoneid = request.query_params.get('zoneid')

            queryset = self.get_queryset()

            if start_date:
                queryset = queryset.filter(date__gte=start_date)
            if end_date:
                queryset = queryset.filter(date__lte=end_date)
            if zoneid:
                queryset = queryset.filter(zoneid=zoneid)

            summary = queryset.aggregate(
                total_adm_fees=Sum('adm_fees'),
                total_pm_fees=Sum('pm_fees'),
                total_apm_fees=Sum('apm_fees'),
                total_fppm_fees=Sum('fppm_fees'),
                total_samvad_donation=Sum('samvad_donation'),
                total_legal_fund=Sum('legal_fund'),
                total_misc_donation=Sum('misc_donation'),
                total_drf_fees=Sum('drf_fees'),
                total_adv_samvad=Sum('adv_samvad'),
                total_interest_sb=Sum('interest_sb'),
                total_interest_fd=Sum('interest_fd'),
                total_investments=Sum('investments'),
                total_guest_house_receipt=Sum('guest_house_receipt'),
                total_building_fund=Sum('building_fund'),
                total_sundry_receipt=Sum('sundry_receipt'),
                total_dividend=Sum('dividend'),
                total_tds_amount=Sum('tds_amount'),
                total_transfer_from_hq=Sum('transfer_from_hq'),
                grand_total=Sum('total_amount')
            )

            return Response(summary)

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
from django.db import models

class Login(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    zoneid = models.IntegerField(max_length=2)
    zone_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'login'

class Payment(models.Model):
    zoneid = models.IntegerField(max_length=2)
    date = models.DateField()
    chqno = models.IntegerField()
    voucherno = models.IntegerField()
    particulars = models.TextField()
    adm_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    pm_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    apm_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    fppm_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    samvad_donation = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    legal_fund = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    misc_donation = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    drf_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    adv_samvad = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    interest_sb = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    interest_fd = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    investments = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    guest_house_receipt = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    building_fund = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    sundry_receipt = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    dividend = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    tds_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    transfer_to_hq = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    suspense = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payment'

class Receipt(models.Model):
    zoneid = models.IntegerField()  # Removed max_length as it's not valid for IntegerField
    date = models.DateField()
    chqno = models.IntegerField()
    voucherno = models.IntegerField()
    particulars = models.TextField()
    adm_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    pm_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    apm_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    fppm_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    samvad_donation = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    legal_fund = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    misc_donation = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    drf_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    adv_samvad = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    interest_sb = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    interest_fd = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    investments = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    guest_house_receipt = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    building_fund = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    sundry_receipt = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    dividend = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    tds_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    transfer_from_hq = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    suspense = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'receipt'
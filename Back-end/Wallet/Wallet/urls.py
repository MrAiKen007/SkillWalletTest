# Wallet/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def index(request):
    return HttpResponse("Bem-vindo à SkillWallet!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),  # Página inicial
    path('contas/', include('contas.urls')),
    path('investimento/', include('investimento.urls')),
]

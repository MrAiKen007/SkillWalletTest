from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('contas.urls')),           # URLs da aplicação "contas" na raiz
    path('investimento/', include('investimento.urls')),  # URLs da aplicação "investimento" com prefixo
]

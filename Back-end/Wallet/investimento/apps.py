from django.apps import AppConfig
from django.apps import apps

class InvestimentoConfig(AppConfig):
    name = 'investimento'
    verbose_name = "Investimento"

    def ready(self):
        Token = apps.get_model('investimento', 'Token')
from django.apps import AppConfig

class InvestimentoConfig(AppConfig):
    name = 'investimento'
    verbose_name = "Investimento"

    def ready(self):
        from django.apps import apps
        # Agora os modelos já estão carregados
        Token = apps.get_model('investimento', 'Token')
        # Você pode fazer outras configurações ou registrar signals aqui
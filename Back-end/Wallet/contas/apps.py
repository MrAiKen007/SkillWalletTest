from django.apps import AppConfig

class ContasConfig(AppConfig):
    name = 'contas'

    def ready(self):
        import contas.signals 

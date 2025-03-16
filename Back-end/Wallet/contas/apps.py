from django.apps import AppConfig

class ContasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'contas'

    def ready(self):
        import contas.signals 
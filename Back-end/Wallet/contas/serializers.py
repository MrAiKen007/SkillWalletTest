import random
import secrets
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .utils import encrypt_seed, decrypt_seed

User = get_user_model()

# Pequeno dicionário de palavras para demonstração
WORD_LIST = [
    "apple","banana","cat","dog","elephant","fox","grape","house","ice","jacket",
    "king","lion","monkey","notebook","orange","pig","queen","rabbit","sun","tree",
    "umbrella","violin","wolf","xenon","yellow","zebra","dance","eagle","flower"
]

def generate_24_words():
    """Gera 24 palavras aleatórias a partir de uma lista."""
    selected_words = []
    for _ in range(24):
        selected_words.append(random.choice(WORD_LIST))
    return ' '.join(selected_words)

class RegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    # Campos para senha e confirmação
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    # Campos adicionais (e-mail e telefone)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=True)
    
    # Será retornada apenas para exibição única durante o cadastro
    seed_key = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'phone',
                  'password', 'confirm_password',
                  'seed_key')

    def validate(self, data):
        # Verifica se a senha e a confirmação de senha conferem
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("As senhas não conferem.")
        return data

    def create(self, validated_data):
        # Remove o confirm_password para não salvar no banco
        validated_data.pop('confirm_password', None)
        
        # Extrai a senha
        password = validated_data.pop('password')

        # Gera 24 palavras aleatórias como seed
        seed = generate_24_words()

        # Criptografa a seed antes de armazenar
        encrypted_seed = encrypt_seed(seed)

        # Cria o usuário
        user = User(**validated_data)
        user.set_password(password)
        user.encrypted_seed_key = encrypted_seed
        user.save()

        # Insere a seed original para retorno único no serializer
        user.seed_key = seed
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    seed_key = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        seed_key_input = data.get('seed_key')

        # Tentar buscar o usuário pelo e-mail
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("E-mail não encontrado.")

        if not user.check_password(password):
            raise serializers.ValidationError("Senha incorreta.")

        decrypted_seed = decrypt_seed(user.encrypted_seed_key)
        if seed_key_input != decrypted_seed:
            raise serializers.ValidationError("Chave semente inválida.")

        data['user'] = user
        return data



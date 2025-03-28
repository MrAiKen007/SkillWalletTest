import random
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from .utils import encrypt_seed, decrypt_seed
from .models import Wallet

User = get_user_model()

WORD_LIST = [
    "apple", "banana", "cat", "dog", "elephant", "fox", "grape", "house", "ice", "jacket",
    "king", "lion", "monkey", "notebook", "orange", "pig", "queen", "rabbit", "sun", "tree",
    "umbrella", "violin", "wolf", "xenon", "yellow", "zebra", "dance", "eagle", "flower"
]

def generate_24_words():
    return ' '.join(random.choices(WORD_LIST, k=24))

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    seed_key = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password', 'seed_key')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("As senhas não conferem.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        password = validated_data.pop('password')
        
        seed = generate_24_words()
        encrypted_seed = encrypt_seed(seed)
        
        user = User(**validated_data)
        user.set_password(password)
        user.encrypted_seed_key = encrypted_seed
        user.save()
        
        user.seed_key = seed
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    seed_key = serializers.CharField(read_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError("Usuário não encontrado.")
        
        user = authenticate(username=user.username, password=password)
        if not user:
            raise serializers.ValidationError("E-mail ou senha incorretos.")
        
        try:
            decrypted_seed = decrypt_seed(user.encrypted_seed_key)
        except Exception as e:
            raise serializers.ValidationError(f"Erro ao descriptografar seed key: {str(e)}")
        
        data['user'] = user
        data['seed_key'] = decrypted_seed
        return data

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = '__all__'

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import update_last_login
from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions, serializers
from rest_framework.exceptions import ValidationError

from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken, SlidingToken, UntypedToken

if api_settings.BLACKLIST_AFTER_ROTATION:
    from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

user_model = get_user_model()

class PasswordField(serializers.CharField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("style", {})

        kwargs["style"]["input_type"] = "password"
        kwargs["write_only"] = True

        super().__init__(*args, **kwargs)

# class TokenObtainSerializer(serializers.Serializer):
#     username_field = user_model.USERNAME_FIELD

#     email = serializers.EmailField(max_length=255)
#     password = serializers.CharField(max_length=255, write_only=True)
        
#     token_class = None

#     default_error_messages = {
#         "no_active_account": _("No active account found with the given credentials")
#     }

#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)

#         self.fields[self.username_field] = serializers.CharField()
#         self.fields["password"] = PasswordField()

#     def validate(self, attrs):
#         email = attrs.get("email")
#         password = attrs.get("password", None)
#         # 사용자 아이디와 비밀번호로 로그인 구현(<-> 사용자 아이디 대신 이메일로도 가능)
#         user = authenticate(email=email, password=password)
        
#         if user is None:
#             user = user_model.objects.filter(email=email).first()
#             if user is None :
#                 raise serializers.ValidationError('user not found')
#             if not user.check_password(password):
#                 raise serializers.ValidationError('password not matched')

#         authenticate_kwargs = {
#             self.username_field: attrs[self.username_field],
#             "password": attrs["password"],
#         }
#         try:
#             authenticate_kwargs["request"] = self.context["request"]
#         except KeyError:
#             pass

#         self.user = authenticate(**authenticate_kwargs)

#         if not api_settings.USER_AUTHENTICATION_RULE(self.user):
#             raise exceptions.AuthenticationFailed(
#                 self.error_messages["no_active_account"],
#                 "no_active_account",
#             )

#         return {}

#     @classmethod
#     def get_token(cls, user):
#         return cls.token_class.for_user(user)

class TokenObtainSerializer(serializers.Serializer):
    username_field = get_user_model().USERNAME_FIELD
    
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)
    token_class = None

    default_error_messages = {
        "no_active_account": _("No active account found with the given credentials")
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields[self.username_field] = serializers.CharField()
        self.fields["password"] = PasswordField()

    def validate(self, attrs):
        email = attrs['email']
        password = attrs['password']
        user = authenticate(email=email, password=password)
        
        if user is None:
            user = user_model.objects.filter(email=email).first()
            if user is None :
                raise serializers.ValidationError('user not found')
            if not user.check_password(password):
                raise serializers.ValidationError('password not matched')

        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            "password": attrs["password"],
        }
        try:
            authenticate_kwargs["request"] = self.context["request"]
        except KeyError:
            pass
        self.user = authenticate(**authenticate_kwargs)

        if not api_settings.USER_AUTHENTICATION_RULE(self.user):
            raise exceptions.AuthenticationFailed(
                self.error_messages["no_active_account"],
                "no_active_account",
            )

        return {}

    @classmethod
    def get_token(cls, user):
        return cls.token_class.for_user(user)


class TokenObtainPairSerializer(TokenObtainSerializer):
    token_class = RefreshToken

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data


class TokenObtainSlidingSerializer(TokenObtainSerializer):
    token_class = SlidingToken

    def validate(self, attrs):
        data = super().validate(attrs)

        token = self.get_token(self.user)

        data["token"] = str(token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data


class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField(read_only=True)
    token_class = RefreshToken

    def validate(self, attrs):
        refresh = self.token_class(attrs["refresh"])

        data = {"access": str(refresh.access_token)}

        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                try:
                    # Attempt to blacklist the given refresh token
                    refresh.blacklist()
                except AttributeError:
                    # If blacklist app not installed, `blacklist` method will
                    # not be present
                    pass

            refresh.set_jti()
            refresh.set_exp()
            refresh.set_iat()

            data["refresh"] = str(refresh)

        return data


class TokenRefreshSlidingSerializer(serializers.Serializer):
    token = serializers.CharField()
    token_class = SlidingToken

    def validate(self, attrs):
        token = self.token_class(attrs["token"])

        # Check that the timestamp in the "refresh_exp" claim has not
        # passed
        token.check_exp(api_settings.SLIDING_TOKEN_REFRESH_EXP_CLAIM)

        # Update the "exp" and "iat" claims
        token.set_exp()
        token.set_iat()

        return {"token": str(token)}


class TokenVerifySerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate(self, attrs):
        token = UntypedToken(attrs["token"])

        if (
            api_settings.BLACKLIST_AFTER_ROTATION
            and "rest_framework_simplejwt.token_blacklist" in settings.INSTALLED_APPS
        ):
            jti = token.get(api_settings.JTI_CLAIM)
            if BlacklistedToken.objects.filter(token__jti=jti).exists():
                raise ValidationError("Token is blacklisted")

        return {}


class TokenBlacklistSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    token_class = RefreshToken

    def validate(self, attrs):
        refresh = self.token_class(attrs["refresh"])
        try:
            refresh.blacklist()
        except AttributeError:
            pass
        return {}

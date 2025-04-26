package utils

import (
	"github.com/dgrijalva/jwt-go"
	"time"
)

var jwtSecret []byte

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func InitJWT() {
	jwtSecret = []byte(AppConfig.JWT.Secret)
}

func GenerateToken(username string) (string, error) {
	now := time.Now()
	expireTime := now.Add(24 * time.Hour)
	
	claims := Claims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expireTime.Unix(),
			Issuer:    "file-server",
		},
	}
	
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	
	if err != nil {
		return nil, err
	}
	
	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	
	return nil, err
}
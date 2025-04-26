package models

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
}

func CreateUser(user *User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	
	// 这里应该使用数据库，简化示例使用全局变量
	return GetDB().Create(user).Error
}

func AuthenticateUser(username, password string) (*User, error) {
	var user User
	if err := GetDB().Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, err
	}
	
	return &user, nil
}
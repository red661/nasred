package models

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
	"file-server/utils"
)

var db *gorm.DB

func InitDB() {
	var err error
	db, err = gorm.Open(sqlite.Open(utils.AppConfig.Database.DSN), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}
	
	// 自动迁移表结构
	err = db.AutoMigrate(&User{}, &File{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
	
	log.Println("Database connection established")
}

func GetDB() *gorm.DB {
	return db
}
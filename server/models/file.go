// models/file.go
package models

import (
	"gorm.io/gorm"
)

type File struct {
	gorm.Model
	Filename string `gorm:"not null"`
	RelPath  string `gorm:"not null"`
	Owner    string `gorm:"not null"`
	IsPublic bool   `gorm:"default:false"`
	Size     int64  `gorm:"not null"`
	Type     string `gorm:"not null"`
}

func CreateFile(file *File) error {
	return GetDB().Create(file).Error
}

func GetFileByName(filename string) (*File, error) {
	var file File
	if err := GetDB().Where("filename = ?", filename).First(&file).Error; err != nil {
		return nil, err
	}
	return &file, nil
}

func GetFilesByType(username string, filetype string) ([]File, error) {
	var files []File
	if err := GetDB().Where("owner = ?", username).Where("type = ?", filetype).Find(&files).Error; err != nil {
		return nil, err
	}
	return files, nil
}


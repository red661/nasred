package utils

import (
	"os"
	"path/filepath"
	"slices"
	"strings"
)

func GetUserStoragePath(username string) (string, error) {
	userPath := filepath.Join(AppConfig.Storage.BaseDir, username)
	if err := os.MkdirAll(userPath, 0755); err != nil {
		return "", err
	}
	return userPath, nil
}

func GetUserFilePath(username, filename string, isPublic bool) (string, error) {
	var filePath string
	if isPublic {
		filePath = filepath.Join(AppConfig.Storage.BaseDir, "public", filename)
	} else {
		userPath, err := GetUserStoragePath(username)
		if err != nil {
			return "", err
		}
		filePath = filepath.Join(userPath, filename)
	}
	
	return filePath, nil
}

func GetFileType(ext string) string {
	videos := []string{".mp4", ".avi", ".mkv", ".mov", "wmv", ".ts", ".flv", ".mpeg", ".rm", ".rmvb"}
	audios := []string{".mp3", ".wav", ".aac", ".wma", ".webm"}
	photos := []string{".jpg", ".jpeg", ".gif", ".png", ".bmp", ".webp"}
	docs := []string{".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt"}

	if slices.Contains(videos, strings.ToLower(ext)) {
		return "video"
	}
	if slices.Contains(audios, strings.ToLower(ext)) {
		return "audio"
	}
	if slices.Contains(photos, strings.ToLower(ext)) {
		return "photo"
	}
	if slices.Contains(docs, strings.ToLower(ext)) {
		return "doc"
	}

	return "file"
}
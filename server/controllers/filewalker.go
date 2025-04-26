package controllers

import (
	"file-server/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"path/filepath"
	"log"
	"time"
)

// 定义文件信息结构体，用于JSON序列化
type FileInfo struct {
	Filename   string    `json:"Filename"`
	RelPath    string    `json:"RelPath"`
	IsDir      bool      `json:"IsDir"`
	IsPublic   bool      `json:"IsPublic"`
	Size       int64     `json:"Size"`
	UpdatedAt  time.Time `json:"UpdatedAt"`
}

func ListFiles(c *gin.Context) {
	username := c.MustGet("username").(string)

	upDir := filepath.Join(utils.AppConfig.Storage.BaseDir, username)
	curDir := utils.SafeFileName(c.Query("currentdir"))
	abDir := filepath.Join(upDir, curDir)

	entries, err := os.ReadDir(abDir)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read dir"})
		return
	}

	var fileInfos []FileInfo

	for _, entry := range entries {
		info, err := entry.Info()
		if err != nil {
			log.Println(err)
			continue
		}
		
		relPath := filepath.Join(curDir, entry.Name())
		
		// 添加到切片
		fileInfos = append(fileInfos, FileInfo{
			Filename:  entry.Name(),
			RelPath:   relPath,
			IsDir:     entry.IsDir(),
			IsPublic:  false,
			Size:      info.Size(),
			UpdatedAt: info.ModTime(),
		})
	}
	
	c.JSON(http.StatusOK, gin.H{"files": fileInfos})
}


func ListPublicFiles(c *gin.Context) {
	upDir := filepath.Join(utils.AppConfig.Storage.BaseDir, "public")
	curDir := utils.SafeFileName(c.Query("currentdir"))
	abDir := filepath.Join(upDir, curDir)

	entries, err := os.ReadDir(abDir)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read dir"})
		return
	}

	var fileInfos []FileInfo

	for _, entry := range entries {
		info, err := entry.Info()
		if err != nil {
			log.Println(err)
			continue
		}
		
		relPath := filepath.Join(curDir, entry.Name())
		
		// 添加到切片
		fileInfos = append(fileInfos, FileInfo{
			Filename:  entry.Name(),
			RelPath:   relPath,
			IsDir:     entry.IsDir(),
			IsPublic:  true,
			Size:      info.Size(),
			UpdatedAt: info.ModTime(),
		})
	}
	
	c.JSON(http.StatusOK, gin.H{"files": fileInfos})
}
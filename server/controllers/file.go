package controllers

import (
	"file-server/models"
	"file-server/utils"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func Mkdir(c *gin.Context) {
	username := c.MustGet("username").(string)

	var ddd struct {
		RootDir string `json:"rootDir"`
		CurDir  string `json:"curDir"`
		Name    string `json:"name"`
	}

	if err := c.ShouldBindJSON(&ddd); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	upDir := filepath.Join(utils.AppConfig.Storage.BaseDir, username)
	if ddd.RootDir == "public" {
		upDir = filepath.Join(utils.AppConfig.Storage.BaseDir, "public")
	}

	curDir := utils.SafeFileName(ddd.CurDir)
	full := filepath.Join(upDir, curDir, ddd.Name)
	os.Mkdir(full, 0755)

	c.JSON(http.StatusOK, gin.H{"mkdir": "ok"})
}

func UploadFile(c *gin.Context) {
	username := c.MustGet("username").(string)
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File upload error"})
		return
	}
	defer file.Close()
	
	// 检查是否是公开文件
	rootDir := c.PostForm("rootdir")

	// 获取用户文件路径
	upDir, _ := utils.GetUserStoragePath(username)
	if rootDir == "public" {
		upDir = filepath.Join(utils.AppConfig.Storage.BaseDir, "public")
	}

	curDir := c.PostForm("currentdir")
	relPath := filepath.Join(utils.SafeFileName(curDir), utils.SafeFileName(header.Filename))
	fullPath := filepath.Join(upDir, relPath)

	out, err := os.Create(fullPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}
	defer out.Close()
	
	_, err = io.Copy(out, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}
	
	// 分类保存文件记录到数据库
	if rootDir != "public" {
		ext := filepath.Ext(fullPath)
		fileRecord := models.File{
			Filename:  header.Filename,
			RelPath:   relPath,
			Owner:     username,
			IsPublic:  false,
			Size:      header.Size,
			Type:      utils.GetFileType(ext),
		}
		if err := models.CreateFile(&fileRecord); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file record"})
			return
		}
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully"})
}

func DownloadFile(c *gin.Context) {
	username := c.MustGet("username").(string)
	relPath := c.Query("relpath")
	upDir, _ := utils.GetUserStoragePath(username)
	fullPath := filepath.Join(upDir, relPath)
	c.File(fullPath)
}

func DownloadPublicFile(c *gin.Context) {
	relPath := c.Query("relpath")
	upDir := filepath.Join(utils.AppConfig.Storage.BaseDir, "public")
	fullPath := filepath.Join(upDir, relPath)
	c.File(fullPath)
}

func ListTypeFiles(c *gin.Context) {
	username := c.MustGet("username").(string)
	filetype := c.Query("type")
	
	files, err := models.GetFilesByType(username, filetype)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get files"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"files": files})
}
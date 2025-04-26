package jobs

import (
	"file-server/models"
	"file-server/utils"
	"os"
)


func CleanOrphanedFiles() {
    // 获取数据库中所有文件路径
    var files []models.File
    if err := models.GetDB().Find(&files).Error; err != nil {
        log.Println("Failed to get files list:", err)
        return
    }
    
    // 建立路径映射
    validFiles := make(map[string]bool)
    for _, file := range files {
        validFiles[file.Path] = true
    }
    
    // 遍历存储目录
    filepath.Walk(utils.AppConfig.Storage.BaseDir, func(path string, info os.FileInfo, err error) error {
        if !info.IsDir() && !validFiles[path] {
            os.Remove(path)
            log.Println("Removed orphaned file:", path)
        }
        return nil
    })
}
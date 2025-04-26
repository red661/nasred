package main

import (
	"file-server/controllers"
	"file-server/middlewares"
	"file-server/utils"
	"file-server/models"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	// 初始化配置
	utils.LoadConfig()

	// 初始化数据库
	models.InitDB()

	// 初始化JWT
	utils.InitJWT()
	
	// 初始化Gin
	r := gin.Default()
	
	// 公共路由
	public := r.Group("/api")
	{
		public.POST("/register", controllers.Register)
		public.POST("/login", controllers.Login)
		public.GET("/public/files", controllers.ListPublicFiles)
		public.GET("/public/download", controllers.DownloadPublicFile)
	}
	
	// 受保护路由
	protected := r.Group("/api")
	protected.Use(middlewares.JwtAuthMiddleware())
	{
		protected.GET("/info", controllers.Info)
		protected.POST("/upload", controllers.UploadFile)
		protected.GET("/files", controllers.ListFiles)
		protected.GET("/typefiles", controllers.ListTypeFiles)
		protected.GET("/download", controllers.DownloadFile)
		protected.POST("/mkdir", controllers.Mkdir)
	}
	
	// 启动服务器
	if err := r.Run(":" + utils.AppConfig.Server.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
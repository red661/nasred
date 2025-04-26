package utils

import (
	"github.com/spf13/viper"
	"log"
	"os"
)

type Config struct {
	Server struct {
		Port string `mapstructure:"port"`
	} `mapstructure:"server"`
	
	Database struct {
		DSN string `mapstructure:"dsn"`
	} `mapstructure:"database"`
	
	JWT struct {
		Secret string `mapstructure:"secret"`
	} `mapstructure:"jwt"`
	
	Storage struct {
		BaseDir  string `mapstructure:"basedir_dir"`
	} `mapstructure:"storage"`
}

var AppConfig Config

func LoadConfig() {
	env := os.Getenv("APP_ENV")
	if env != "" {
		viper.SetConfigName("config." + env)
	} else {
		viper.SetConfigName("config") // 配置文件名 (不带扩展名)
	}
	viper.SetConfigType("yaml")   // 配置文件类型
	viper.AddConfigPath(".")      // 查找配置文件的路径
	viper.AddConfigPath("./configs")
	
	// 设置默认值
	viper.SetDefault("server.port", "8080")
	viper.SetDefault("database.dsn", "file_server.db")
	viper.SetDefault("jwt.secret", "default-secret-key")
	viper.SetDefault("storage.basedir_dir", "./storage")
	
	// 读取配置文件
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Println("No config file found, using defaults")
		} else {
			log.Fatalf("Error reading config file: %v", err)
		}
	}
	
	// 将配置解析到结构体
	if err := viper.Unmarshal(&AppConfig); err != nil {
		log.Fatalf("Unable to decode config into struct: %v", err)
	}
	
	log.Println("Configuration loaded successfully")
}
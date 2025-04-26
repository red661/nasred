package utils

import "path/filepath"

func SafeFileName(filename string) string {
    // 防止路径遍历攻击
    return filepath.Base(filename)
}
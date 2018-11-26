package com.cherry.devops.devopsconsole.controller;

import com.cherry.devops.devopsconsole.entity.ResponseEntity;
import com.cherry.devops.devopsconsole.exception.DevopsException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * @ClassName ExceptionRestControllerAdvice
 * @Description 全局异常处理类
 * @Author lixiaolong
 * @Date Created in 2018/11/23 9:00
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/23 9:00
 */
@RestControllerAdvice
public class ExceptionRestControllerAdvice {

    private static final Logger LOGGER = LogManager.getLogger(ExceptionRestControllerAdvice.class);

    /**
     * @return com.cherry.devops.devopsconsole.entity.Result
     * @MethodName errorHandler
     * @Description 全局异常捕捉处理
     * @Param [ex]
     * @Author lixiaolong
     * @Date 2018/11/23 9:10
     * @version 1.0
     */
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity errorHandler(Exception ex) {
        ResponseEntity responseEntity = new ResponseEntity(false, "DEVOPS_999999", ex.getMessage());
        LOGGER.error("【ExceptionRestControllerAdvice.errorHandler】 {} : {}", "DEVOPS_999999", ex.getMessage());
        return responseEntity;
    }

    /**
     * @return com.cherry.devops.devopsconsole.entity.Result
     * @MethodName devopsErrorHandler
     * @Description 拦截捕捉自定义异常
     * @Param [ex]
     * @Author lixiaolong
     * @Date 2018/11/23 9:09
     * @version 1.0
     */
    @ExceptionHandler(value = DevopsException.class)
    public ResponseEntity devopsErrorHandler(DevopsException ex) {
        ResponseEntity responseEntity = new ResponseEntity(false, ex.getErrorCode(), ex.getErrorMsg());
        LOGGER.error("【ExceptionRestControllerAdvice.errorHandler】 {}", ex.getErrorCode() + " -- " + ex.getErrorMsg());
        return responseEntity;
    }
}

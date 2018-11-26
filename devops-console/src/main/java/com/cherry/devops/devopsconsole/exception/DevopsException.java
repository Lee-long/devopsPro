package com.cherry.devops.devopsconsole.exception;

/**
 * @ClassName DevopsException
 * @Description 自定义异常(spring对于RuntimeException异常才会进行事务回滚)
 * @Author lixiaolong
 * @Date Created in 2018/11/23 8:46
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/23 8:46
 */
public class DevopsException extends RuntimeException {

    public DevopsException(String errorCode, String errorMsg) {
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
    }

    public DevopsException(ExceptionEnum exceptionEnum) {
        this.errorCode = exceptionEnum.getErrorCode();
        this.errorMsg = exceptionEnum.getErrorMsg();
    }

    private String errorCode;
    private String errorMsg;

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }
}

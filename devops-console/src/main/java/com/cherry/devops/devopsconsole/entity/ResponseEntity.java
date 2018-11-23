package com.cherry.devops.devopsconsole.entity;

/**
 * @ClassName ResponseEntity
 * @Description 数据返回实体
 * @Author lixiaolong
 * @Date Created in 2018/11/21 14:39
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/21 14:39
 */
public class ResponseEntity<T> {

    /**
     * 是否成功
     */
    private boolean isSuccess;
    /**
     * 状态码
     */
    private String errorCode;
    /**
     * 返回信息
     */
    private String errorMsg;
    /**
     * 返回数据
     */
    private T data;

    /**
     * @return
     * @MethodName Result
     * @Description 无参构造器
     * @Param []
     * @Author lixiaolong
     * @Date 2018/11/21 14:45
     * @version 1.0
     */
    public ResponseEntity() {
        super();
    }

    /**
     * @return
     * @MethodName Result
     * @Description TODO
     * @Param [isSuccess, code,  message]
     * @Author lixiaolong
     * @Date 2018/11/21 14:45
     * @version 1.0
     */
    public ResponseEntity(boolean isSuccess, String errorCode, String errorMsg) {
        super();
        this.isSuccess = isSuccess;
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
    }

    /**
     * @return
     * @MethodName Result
     * @Description TODO
     * @Param [isSuccess, code,  message, data]
     * @Author lixiaolong
     * @Date 2018/11/21 14:45
     * @version 1.0
     */
    public ResponseEntity(boolean isSuccess, String errorCode, String errorMsg, T data) {
        super();
        this.isSuccess = isSuccess;
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
        this.data = data;
    }

    public boolean isSuccess() {
        return isSuccess;
    }

    public void setSuccess(boolean success) {
        isSuccess = success;
    }

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

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}

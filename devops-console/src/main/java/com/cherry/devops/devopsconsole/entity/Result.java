package com.cherry.devops.devopsconsole.entity;

/**
 * @ClassName Result
 * @Description 数据返回实体
 * @Author lixiaolong
 * @Date Created in 2018/11/21 14:39
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/21 14:39
 */
public class Result {

    /**
     * 是否成功
     */
    private boolean isSuccess;
    /**
     * 状态码
     */
    private Integer code;
    /**
     * 返回信息
     */
    private String message;
    /**
     * 返回数据
     */
    private Object data;

    /**
     * @return
     * @MethodName Result
     * @Description 无参构造器
     * @Param []
     * @Author lixiaolong
     * @Date 2018/11/21 14:45
     * @version 1.0
     */
    public Result() {
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
    public Result(boolean isSuccess, int code, String message) {
        super();
        this.isSuccess = isSuccess;
        this.code = code;
        this.message = message;
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
    public Result(boolean isSuccess, int code, String message, Object data) {
        super();
        this.isSuccess = isSuccess;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public boolean isSuccess() {
        return isSuccess;
    }

    public void setSuccess(boolean success) {
        isSuccess = success;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}

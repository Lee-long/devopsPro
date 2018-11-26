package com.cherry.devops.devopsconsole.exception;

/**
 * @ClassName ExceptionEnum
 * @Description TODO
 * @Author lixiaolong
 * @Date Created in 2018/11/23 8:49
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/23 8:49
 */
public enum ExceptionEnum {

    Success("DEVOPS_000000", "success")
    , InvalidUserOrPassword("DEVOPS_000001", "用户名或密码错误")
    , UserNotExists("DEVOPS_000002", "用户不存在")
    , SessionTimeout("DEVOPS_000003", "登录超时")
    , UserAlreadyExists("DEVOPS_000004", "用户已存在")
    , InvalidToken("DEVOPS_000005", "无效的token")
    , TokenExpired("DEVOPS_000006", "token过期")
    , NotAuthorized("DEVOPS_000007", "未授权")
    , EmailNotExists("DEVOPS_000008", "无效的邮件地址")
    , TooMuchFrequency("DEVOPS_000009", "操作频度过高")
    , EmailAlreadyExists("DEVOPS_000010", "邮箱已注册")
    , MobileAlreadyExists("DEVOPS_000011", "手机号已注册")
    , InternalError("500",  "内部错误");

    private String errorCode;
    private String errorMsg;

    ExceptionEnum(String errorCode, String errorMsg) {
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
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
}

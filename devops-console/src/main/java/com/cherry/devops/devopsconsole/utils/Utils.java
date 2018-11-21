package com.cherry.devops.devopsconsole.utils;

import javax.servlet.http.HttpServletRequest;

/**
 * @ClassName Utils
 * @Description TODO
 * @Author lixiaolong
 * @Date Created in 2018/11/21 17:49
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/21 17:49
 */
public class Utils {

    private static final String[] REMOTE_IP_HEADER = {"X-Forwarded-For", "x-forwarded-for"};

    /**
     * @return java.lang.String
     * @MethodName getRemoteIpAddress
     * @Description 获取远程请求ip
     * @Param [request]
     * @Author lixiaolong
     * @Date 2018/11/21 17:51
     * @version 1.0
     */
    public static String getRemoteIpAddress(HttpServletRequest request) {
        String ip = null;

        if (request != null) {
            for (String key : REMOTE_IP_HEADER) {
                ip = request.getHeader(key);
                if (StrUtils.isNull(ip)) {
                    break;
                }
            }
            if (StrUtils.isNull(ip)) {
                ip = request.getRemoteAddr();
            }
        }
        return ip;
    }
}

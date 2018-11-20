package com.cherry.devops.devopsconsole.utils;

/**
 * @ClassName StrUtils
 * @Description TODO
 * @Author lixiaolong
 * @Date Created in 2018/11/20 14:35
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/20 14:35
 */
public class StrUtils {

    /**
     * @return boolean
     * @MethodName isNull
     * @Description 字符串判空
     * @Param [str]
     * @Author lixiaolong
     * @Date 2018/11/20 14:36
     * @version 1.0
     */
    public static boolean isNull(String str) {
        boolean flag = false;
        if (null == str) {
            return true;
        } else {
            str = str.trim();
            if (("").equals(str) || ("null").equals(str.toLowerCase()) || str.length() < 1 || str.isEmpty()) {
                return true;
            }
        }
        return flag;
    }


}

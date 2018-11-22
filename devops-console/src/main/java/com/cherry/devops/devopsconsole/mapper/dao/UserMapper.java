package com.cherry.devops.devopsconsole.mapper.dao;

import com.cherry.devops.devopsconsole.entity.User;

public interface UserMapper {
    int insert(User record);

    int insertSelective(User record);
}
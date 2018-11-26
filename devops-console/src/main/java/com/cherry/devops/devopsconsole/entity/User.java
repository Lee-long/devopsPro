package com.cherry.devops.devopsconsole.entity;

import java.math.BigDecimal;
import java.util.Date;

public class User {
    private Integer id;

    private Integer orgId;

    private String loginName;

    private String password;

    private String mobile;

    private String telephone;

    private String email;

    private String nickName;

    private String fullName;

    private Short gender;

    private Short age;

    private Date birthday;

    private String avatar;

    private String jobNo;

    private String cardId;

    private Integer positionId;

    private Date positionDate;

    private Integer safetyPositionId;

    private Date safetyPositionDate;

    private Short education;

    private String major;

    private Integer roleId;

    private Integer credit;

    private BigDecimal balance;

    private Short checkoutCount;

    private Date lastCheckoutTime;

    private Date lastLoginTime;

    private Short loginCount;

    private String lastLoginIp;

    private Short deleteStatus;

    private String loginToken;

    private Date loginTokenRefreshTime;

    private Date onboardDate;

    private String traceCodeI;

    private String traceCodeU;

    private String hostName;

    private Integer createUserId;

    private String createBy;

    private Date createDate;

    private Integer updateUserId;

    private String updateBy;

    private Date updateDate;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getOrgId() {
        return orgId;
    }

    public void setOrgId(Integer orgId) {
        this.orgId = orgId;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName == null ? null : loginName.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile == null ? null : mobile.trim();
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone == null ? null : telephone.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName == null ? null : nickName.trim();
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName == null ? null : fullName.trim();
    }

    public Short getGender() {
        return gender;
    }

    public void setGender(Short gender) {
        this.gender = gender;
    }

    public Short getAge() {
        return age;
    }

    public void setAge(Short age) {
        this.age = age;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar == null ? null : avatar.trim();
    }

    public String getJobNo() {
        return jobNo;
    }

    public void setJobNo(String jobNo) {
        this.jobNo = jobNo == null ? null : jobNo.trim();
    }

    public String getCardId() {
        return cardId;
    }

    public void setCardId(String cardId) {
        this.cardId = cardId == null ? null : cardId.trim();
    }

    public Integer getPositionId() {
        return positionId;
    }

    public void setPositionId(Integer positionId) {
        this.positionId = positionId;
    }

    public Date getPositionDate() {
        return positionDate;
    }

    public void setPositionDate(Date positionDate) {
        this.positionDate = positionDate;
    }

    public Integer getSafetyPositionId() {
        return safetyPositionId;
    }

    public void setSafetyPositionId(Integer safetyPositionId) {
        this.safetyPositionId = safetyPositionId;
    }

    public Date getSafetyPositionDate() {
        return safetyPositionDate;
    }

    public void setSafetyPositionDate(Date safetyPositionDate) {
        this.safetyPositionDate = safetyPositionDate;
    }

    public Short getEducation() {
        return education;
    }

    public void setEducation(Short education) {
        this.education = education;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major == null ? null : major.trim();
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public Integer getCredit() {
        return credit;
    }

    public void setCredit(Integer credit) {
        this.credit = credit;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Short getCheckoutCount() {
        return checkoutCount;
    }

    public void setCheckoutCount(Short checkoutCount) {
        this.checkoutCount = checkoutCount;
    }

    public Date getLastCheckoutTime() {
        return lastCheckoutTime;
    }

    public void setLastCheckoutTime(Date lastCheckoutTime) {
        this.lastCheckoutTime = lastCheckoutTime;
    }

    public Date getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(Date lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public Short getLoginCount() {
        return loginCount;
    }

    public void setLoginCount(Short loginCount) {
        this.loginCount = loginCount;
    }

    public String getLastLoginIp() {
        return lastLoginIp;
    }

    public void setLastLoginIp(String lastLoginIp) {
        this.lastLoginIp = lastLoginIp == null ? null : lastLoginIp.trim();
    }

    public Short getDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(Short deleteStatus) {
        this.deleteStatus = deleteStatus;
    }

    public String getLoginToken() {
        return loginToken;
    }

    public void setLoginToken(String loginToken) {
        this.loginToken = loginToken == null ? null : loginToken.trim();
    }

    public Date getLoginTokenRefreshTime() {
        return loginTokenRefreshTime;
    }

    public void setLoginTokenRefreshTime(Date loginTokenRefreshTime) {
        this.loginTokenRefreshTime = loginTokenRefreshTime;
    }

    public Date getOnboardDate() {
        return onboardDate;
    }

    public void setOnboardDate(Date onboardDate) {
        this.onboardDate = onboardDate;
    }

    public String getTraceCodeI() {
        return traceCodeI;
    }

    public void setTraceCodeI(String traceCodeI) {
        this.traceCodeI = traceCodeI == null ? null : traceCodeI.trim();
    }

    public String getTraceCodeU() {
        return traceCodeU;
    }

    public void setTraceCodeU(String traceCodeU) {
        this.traceCodeU = traceCodeU == null ? null : traceCodeU.trim();
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName == null ? null : hostName.trim();
    }

    public Integer getCreateUserId() {
        return createUserId;
    }

    public void setCreateUserId(Integer createUserId) {
        this.createUserId = createUserId;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy == null ? null : createBy.trim();
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Integer getUpdateUserId() {
        return updateUserId;
    }

    public void setUpdateUserId(Integer updateUserId) {
        this.updateUserId = updateUserId;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy == null ? null : updateBy.trim();
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}
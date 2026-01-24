package org.xumin.petcare.web.vm;

import java.io.Serializable;

public class KeyAndPasswordVM implements Serializable {
    private String key;
    private String newPassword;

    public KeyAndPasswordVM() {
    }

    public KeyAndPasswordVM(String key, String newPassword) {
        this.key = key;
        this.newPassword = newPassword;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

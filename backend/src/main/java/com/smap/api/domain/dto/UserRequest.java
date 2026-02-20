package com.smap.api.domain.dto;

import com.smap.api.domain.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {

    @NotBlank(message = "Username tidak boleh kosong")
    @Size(min = 3, max = 50, message = "Username harus antara 3 hingga 50 karakter")
    private String username;

    @NotBlank(message = "Email tidak boleh kosong")
    @Email(message = "Format email tidak valid")
    private String email;

    @NotBlank(message = "Nama lengkap tidak boleh kosong")
    private String name;

    @Size(min = 6, message = "Password minimal 6 karakter")
    private String password;

    @NotNull(message = "Role tidak boleh kosong")
    private User.Role role;
}

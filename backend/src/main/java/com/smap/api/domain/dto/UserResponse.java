package com.smap.api.domain.dto;

import com.smap.api.domain.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String name;
    private User.Role role;
    private boolean isActive;
    private String nip;
    private String jabatan;
    private String bidang;
    private List<String> permissions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .isActive(!user.isDeleted())
                .nip(user.getNip())
                .jabatan(user.getJabatan())
                .bidang(user.getBidang())
                .permissions(user.getPermissions() != null
                        ? user.getPermissions().stream().map(p -> p.getMenu() + ":" + p.getSubMenu())
                                .collect(Collectors.toList())
                        : List.of())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

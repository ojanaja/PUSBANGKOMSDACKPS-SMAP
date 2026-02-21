package com.smap.api.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponse {
    private String token;
    private String type;
    private Long id;
    private String username;
    private String name;
    private String role;
    private String nip;
    private String jabatan;
    private String bidang;
}

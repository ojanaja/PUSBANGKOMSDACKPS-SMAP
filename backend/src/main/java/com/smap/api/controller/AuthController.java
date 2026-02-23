package com.smap.api.controller;

import com.smap.api.domain.dto.JwtResponse;
import com.smap.api.domain.dto.LoginRequest;
import com.smap.api.domain.entity.User;
import com.smap.api.repository.UserRepository;
import com.smap.api.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final UserRepository userRepository;
        private final JwtUtils jwtUtils;

        @PostMapping("/login")
        public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                                                loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = jwtUtils.generateJwtToken(authentication);

                org.springframework.security.core.userdetails.User userDetails = (org.springframework.security.core.userdetails.User) authentication
                                .getPrincipal();

                String role = userDetails.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .findFirst().orElse("ROLE_VIEWER")
                                .replace("ROLE_", "");

                User dbUser = userRepository.findByUsernameAndDeletedFalse(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

                return ResponseEntity.ok(JwtResponse.builder()
                                .token(jwt)
                                .type("Bearer")
                                .id(dbUser.getId())
                                .username(dbUser.getUsername())
                                .name(dbUser.getName())
                                .role(role)
                                .nip(dbUser.getNip())
                                .jabatan(dbUser.getJabatan())
                                .bidang(dbUser.getBidang())
                                .permissions(dbUser.getPermissions() != null
                                                ? dbUser.getPermissions().stream()
                                                                .map(p -> p.getMenu() + ":" + p.getSubMenu())
                                                                .collect(java.util.stream.Collectors.toList())
                                                : java.util.List.of())
                                .build());
        }
}

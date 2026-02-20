package com.smap.api.service;

import com.smap.api.domain.dto.PagedResponse;
import com.smap.api.domain.dto.UserRequest;
import com.smap.api.domain.dto.UserResponse;
import com.smap.api.domain.entity.User;
import com.smap.api.exception.ResourceNotFoundException;
import com.smap.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAllUsers(int page, int size, String sortDir, String sortBy) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> userPage = userRepository.findAll(pageable);
        return PagedResponse.of(userPage.map(UserResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User dengan ID " + id + " tidak ditemukan"));
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username sudah terdaftar!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email sudah terdaftar!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setRole(request.getRole());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        } else {
            user.setPassword(passwordEncoder.encode("password123")); 
        }

        User saved = userRepository.save(user);
        return UserResponse.fromEntity(saved);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username sudah terdaftar!");
        }
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email sudah terdaftar!");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setRole(request.getRole());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updated = userRepository.save(user);
        return UserResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));
        user.setDeleted(true);
        userRepository.save(user);
    }
}

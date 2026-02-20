package com.smap.api.repository;

import com.smap.api.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndDeletedFalse(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}

package com.smap.api.repository;

import com.smap.api.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = { "permissions" })
    Optional<User> findByUsernameAndDeletedFalse(String username);

    @EntityGraph(attributePaths = { "permissions" })
    Page<User> findAll(org.springframework.data.domain.Pageable pageable);

    @EntityGraph(attributePaths = { "permissions" })
    Optional<User> findById(Long id);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}

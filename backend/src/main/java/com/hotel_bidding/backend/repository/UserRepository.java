package com.hotel_bidding.backend.repository;

import com.hotel_bidding.backend.constants.AccountType;
import com.hotel_bidding.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByUsername(String username);
    
    // Staff management methods
    List<User> findByParentUserIdAndAccountType(String parentUserId, AccountType accountType);
    
    List<User> findByParentUserId(String parentUserId);
    
    Long countByParentUserId(String parentUserId);
}

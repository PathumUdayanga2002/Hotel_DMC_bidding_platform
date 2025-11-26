package com.hotel_bidding.backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface CloudinaryService {
    
    /**
     * Upload file to Cloudinary
     * @param file MultipartFile to upload
     * @param folder Folder path in Cloudinary
     * @return Map containing url and public_id
     */
    Map<String, String> uploadFile(MultipartFile file, String folder) throws IOException;
    
    /**
     * Delete file from Cloudinary
     * @param publicId Public ID of the file to delete
     * @return true if deletion successful
     */
    boolean deleteFile(String publicId) throws IOException;
}

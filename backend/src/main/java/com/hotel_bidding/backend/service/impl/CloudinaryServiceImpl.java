package com.hotel_bidding.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hotel_bidding.backend.exception.BadRequestException;
import com.hotel_bidding.backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnBean(Cloudinary.class)
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;
    
    private static final List<String> ALLOWED_FORMATS = Arrays.asList("pdf", "jpg", "jpeg", "png");
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    @Override
    public Map<String, String> uploadFile(MultipartFile file, String folder) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum limit of 50MB");
        }

        // Check file format
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BadRequestException("Invalid file name");
        }

        String fileExtension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_FORMATS.contains(fileExtension)) {
            throw new BadRequestException("File format not allowed. Allowed formats: PDF, JPG, JPEG, PNG");
        }

        try {
            // Upload options
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "auto",
                "use_filename", true,
                "unique_filename", true
            );

            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            // Extract and return URL and public ID
            Map<String, String> result = new HashMap<>();
            result.put("url", (String) uploadResult.get("secure_url"));
            result.put("publicId", (String) uploadResult.get("public_id"));
            result.put("fileName", originalFilename);

            log.info("File uploaded successfully to Cloudinary: {}", result.get("publicId"));
            return result;

        } catch (IOException e) {
            log.error("Error uploading file to Cloudinary: {}", e.getMessage());
            throw new IOException("Failed to upload file to cloud storage", e);
        }
    }

    @Override
    public boolean deleteFile(String publicId) throws IOException {
        if (publicId == null || publicId.isEmpty()) {
            return false;
        }

        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String resultStatus = (String) result.get("result");
            
            log.info("File deletion result for {}: {}", publicId, resultStatus);
            return "ok".equals(resultStatus);

        } catch (IOException e) {
            log.error("Error deleting file from Cloudinary: {}", e.getMessage());
            throw new IOException("Failed to delete file from cloud storage", e);
        }
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }
}

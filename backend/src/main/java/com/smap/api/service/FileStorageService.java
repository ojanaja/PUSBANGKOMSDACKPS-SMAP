package com.smap.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${smap.minio.bucket}")
    private String bucket;

    @Value("${smap.minio.public-url}")
    private String publicUrl;

    private final S3Client s3Client;

    public FileStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            String fileExtension = "";
            int dotIndex = originalFileName.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFileName.substring(dotIndex);
            }

            String newFileName = UUID.randomUUID().toString() + fileExtension;

            Path tempFile = Files.createTempFile("upload-", newFileName);
            try {
                file.transferTo(tempFile.toFile());
                String mimeType = Files.probeContentType(tempFile);

                if (mimeType == null || (!mimeType.equals("image/jpeg") && !mimeType.equals("image/png")
                        && !mimeType.equals("image/webp"))) {
                    throw new RuntimeException(
                            "Invalid or unsupported file type for security reasons. Found: " + mimeType);
                }

                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(newFileName)
                        .contentType(mimeType)
                        .build();

                s3Client.putObject(putObjectRequest, RequestBody.fromFile(tempFile));

            } finally {
                Files.deleteIfExists(tempFile);
            }

            return publicUrl + "/" + bucket + "/" + newFileName;

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }
}

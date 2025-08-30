package com.kirana.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@RestController
public class ImageProxyController {

    private static final Logger log = LoggerFactory.getLogger(ImageProxyController.class);
    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    @GetMapping("/image-proxy")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String url) {
        try {
            if (url == null || url.isBlank()) {
                return ResponseEntity.badRequest().build();
            }
            // Only allow http/https
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                log.warn("Rejected non-http url for proxy: {}", url);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .header("User-Agent", "E-Kirana-Image-Proxy/1.0")
                    .build();

            HttpResponse<byte[]> resp = client.send(req, HttpResponse.BodyHandlers.ofByteArray());

            int status = resp.statusCode();
            if (status >= 400) {
                log.warn("Image proxy received status {} for url {}", status, url);
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
            }

            String contentType = resp.headers().firstValue("content-type").orElse("application/octet-stream");
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.CONTENT_TYPE, contentType);
            headers.setCacheControl("max-age=3600, public");

            return new ResponseEntity<>(resp.body(), headers, HttpStatus.OK);
        } catch (IOException | InterruptedException ex) {
            log.error("Error proxying image: {}", url, ex);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        } catch (Exception ex) {
            log.error("Unexpected error in image proxy for url {}", url, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

package com.example.DraftBox;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody Article article,
                                                 @AuthenticationPrincipal User author) {
        return ResponseEntity.status(201).body(articleService.createArticle(article, author));
    }

    @PatchMapping("/{id}/submit")
    public ResponseEntity<Article> submitForReview(@PathVariable Integer id,
                                                   @AuthenticationPrincipal User author) {
        return ResponseEntity.ok(articleService.submitForReview(id, author));
    }

    @GetMapping
    public ResponseEntity<List<Article>> getPublishedArticles() {
        return ResponseEntity.ok(articleService.getPublishedArticles());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Article>> getMyArticles(@AuthenticationPrincipal User author) {
        return ResponseEntity.ok(articleService.getMyArticles(author));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Article>> getPendingArticles() {
        return ResponseEntity.ok(articleService.getPendingArticles());
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Article> publishArticle(@PathVariable Integer id) {
        return ResponseEntity.ok(articleService.publishArticle(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Article> rejectArticle(@PathVariable Integer id) {
        return ResponseEntity.ok(articleService.rejectArticle(id));
    }
}
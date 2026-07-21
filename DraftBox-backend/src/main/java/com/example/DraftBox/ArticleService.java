package com.example.DraftBox;


import org.springframework.stereotype.Service;

import org.springframework.security.access.AccessDeniedException;
import java.util.List;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public Article createArticle(Article article, User author){
        article.setStatus(ArticleStatus.DRAFT);
        article.setAuthor(author);
        return articleRepository.save(article);
    }

    public Article submitForReview(Integer articleId, User author) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        if (!article.getAuthor().getId().equals(author.getId())) {
            throw new AccessDeniedException("You can only submit your own articles");
        }
        if (article.getStatus() != ArticleStatus.DRAFT) {
            throw new IllegalStateException("Only draft articles can be submitted for review");
        }

        article.setStatus(ArticleStatus.PENDING_REVIEW);
        return articleRepository.save(article);
    }

    public List<Article> getPublishedArticles(){
        return articleRepository.findByStatus(ArticleStatus.PUBLISHED);
    }

    public List<Article> getMyArticles(User author){
        return articleRepository.findByAuthor(author);
    }


    public List<Article> getPendingArticles(){
        return articleRepository.findByStatus(ArticleStatus.PENDING_REVIEW);
    }

    public Article publishArticle(Integer articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        if (article.getStatus() != ArticleStatus.PENDING_REVIEW) {
            throw new IllegalStateException("Only articles pending review can be published");
        }

        article.setStatus(ArticleStatus.PUBLISHED);
        return articleRepository.save(article);
    }

    public Article rejectArticle(Integer articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        if (article.getStatus() != ArticleStatus.PENDING_REVIEW) {
            throw new IllegalStateException("Only articles pending review can be rejected");
        }

        article.setStatus(ArticleStatus.REJECTED);
        return articleRepository.save(article);
    }
}

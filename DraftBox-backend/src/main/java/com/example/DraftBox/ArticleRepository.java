package com.example.DraftBox;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article,Integer> {

    List<Article> findByAuthor(User author);
    List<Article> findByStatus(ArticleStatus status);

}

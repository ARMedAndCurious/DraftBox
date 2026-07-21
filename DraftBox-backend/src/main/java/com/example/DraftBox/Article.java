package com.example.DraftBox;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Article {

    @Id
    @GeneratedValue
    private Integer id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private ArticleStatus status;

    @ManyToOne
    @JoinColumn(name="author_id")
    @JsonBackReference
    private User author;

}

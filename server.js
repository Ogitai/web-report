"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let posts = [];

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// 新規投稿
app.post('/posts', (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }
    const post = {
        id: generateId(),
        content,
        replies: [],
        likes: 0
    };
    posts.push(post);
    console.log('新規投稿追加:', post);
    res.status(201).json(post);
});

// 返信投稿（コメント追加）
app.post('/posts/:id/reply', (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }
    const post = posts.find(p => p.id === id);
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }
    const reply = {
        id: generateId(),
        content
    };
    post.replies.push(reply);
    console.log(`投稿ID ${id} へのコメント追加:`, reply);
    res.status(201).json(reply);
});

// いいね
app.post('/posts/:id/like', (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }
    post.likes++;
    console.log(`投稿ID ${id} にいいね。合計いいね数: ${post.likes}`);
    res.status(200).json({ id: post.id, likes: post.likes });
});

// 投稿一覧取得
app.get('/posts', (req, res) => {
    res.json(posts);
});

app.listen(PORT, () => {
    console.log(`サーバーはポート ${PORT} で稼働中`);
});

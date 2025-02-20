"use strict";

// 新規投稿作成
async function createPost(content) {
    try {
        const response = await fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        if (!response.ok) throw new Error('投稿の作成に失敗しました');
        const post = await response.json();
        console.log('投稿が作成されました:', post);
        return post;
    } catch (error) {
        console.error(error);
    }
}

// コメント作成
async function replyToPost(postId, content) {
    try {
        const response = await fetch(`/posts/${postId}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        if (!response.ok) throw new Error('コメントの追加に失敗しました');
        const reply = await response.json();
        console.log('コメントが追加されました:', reply);
        return reply;
    } catch (error) {
        console.error(error);
    }
}

// いいね追加
async function likePost(postId) {
    try {
        const response = await fetch(`/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('いいねに失敗しました');
        const data = await response.json();
        console.log('いいねが追加されました:', data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

// 投稿一覧を取得して表示
async function loadPosts() {
    try {
        const response = await fetch('/posts');
        if (!response.ok) throw new Error('投稿の取得に失敗しました');
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error(error);
    }
}

// 投稿のレンダリング
function renderPosts(posts) {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        let repliesHtml = '';
        if (post.replies && post.replies.length > 0) {
            repliesHtml = post.replies.map(reply => `<p>- ${reply.content}</p>`).join('');
        }
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <p><strong>投稿:</strong> ${post.content}</p>
            <p>いいね: <span id="likes-${post.id}">${post.likes}</span>
            <button onclick="handleLike('${post.id}')">いいね</button></p>
            <div>
                <h4>コメント:</h4>
                <div id="replies-${post.id}">${repliesHtml}</div>
                <input type="text" id="replyInput-${post.id}" placeholder="コメントを入力">
                <button onclick="handleReply('${post.id}')">コメント</button>
            </div>
            <hr>
        `;
        postsContainer.appendChild(postDiv);
    });
}

// 新規投稿処理
async function handleNewPost() {
    const postInput = document.getElementById('postInput');
    const content = postInput.value.trim();
    if (!content) {
        alert('投稿内容を入力してください');
        return;
    }
    await createPost(content);
    postInput.value = '';
    loadPosts();
}

// コメント処理
async function handleReply(postId) {
    const replyInput = document.getElementById(`replyInput-${postId}`);
    const content = replyInput.value.trim();
    if (!content) {
        alert('コメント内容を入力してください');
        return;
    }
    await replyToPost(postId, content);
    replyInput.value = '';
    loadPosts();
}

// いいね処理
async function handleLike(postId) {
    await likePost(postId);
    loadPosts();
}

// DOM読み込み後にイベントを登録
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('postForm').addEventListener('submit', (event) => {
        event.preventDefault();
        handleNewPost();
    });
    loadPosts();
});

// HTMLから呼び出すためにグローバルに登録
window.handleReply = handleReply;
window.handleLike = handleLike;

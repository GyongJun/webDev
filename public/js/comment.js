$('#commentForm').on('submit', async function(e) {
    e.preventDefault();

    const postId = $(this).data('post-id');

    const formData = {
        text: $(this).find('textarea').val().trim()
    };

    try {
        const response = await fetch(`/forum/comment/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();


        if (data.success) {
            alert('답변이 등록되였습니다.');
            addCommentToUI(data.comment);
            $("#commentForm textarea").val('');
        } else {
            alert(data.message);
        }
    }
    catch(error) {
        alert(error);
    }
});

function addCommentToUI(comment) {
    const commentHTML = `
        <div class="commentContainer">
            <div class="commentWriter">
                ${comment.user}
            </div>
            <div class="commentMain">
                <div class="commentText">${comment.text}</div>
                <button class="cancelBtn">X</button>
            </div>
        </div>
    `;
    
    $('.commentsContainer').append(commentHTML);
}
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
            addCommentToUI(data.comment, data.name);
            $("#commentForm textarea").val('');
        } else {
            alert(data.message);
        }
    }
    catch(error) {
        alert(error);
    }
});

function addCommentToUI(comment, name) {
    const commentHTML = `
        <div class="commentContainer">
            <div class="commentWriter">
                ${name}
            </div>
            <div class="commentMain">
                <div class="commentText">${comment.text}</div>
                <button class="cancelBtn">X</button>
            </div>
        </div>
    `;
    
    $('.commentsContainer').append(commentHTML);
}

$('.commentMain').on('submit', async function(e){
    e.preventDefault();

    const commentId = $(this).data('comment-id');
    const postId = $(this).data('post-id');
    
    const $container = $(this).closest('.commentContainer');

    if(!confirm('정말 삭제하겠습니까')) return;

    try {
        const response = await fetch(`/forum/comment/${postId}/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if(data.success)
            deleteCommentFromUI($container);

    } catch(error) {
        alert(error);
    }
});

function deleteCommentFromUI($commentContainer) {
    $commentContainer.remove();
}
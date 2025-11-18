
const fn_update = id => {
    let params = {text: $('#' + id).val()};

    $.ajax({
        url: '/forum/' + id,
        type: 'PUT',
        data: params,
        success: (data) => {
            if(data.status) {
                alert('기사를 수정하였습니다.');
                updatePostInUI(data.post);
            }
        },
        error: function(xhr) {
            console.log('오유가 발생하였습니다.');
        }
    });
}

const updatePostInUi = updatedPost => {
    let id = updatedPost._id;
    $('#' + id).text(updatedPost.text);
}

const fn_delete = id => {
    alert('12');
    $.ajax ({
        url: '/forum/' + id,
        type: 'DELETE',
        success: (data) => {
            if(data.status) {
                $('#' + id).parent().parent().remove();
                alert('기사를 삭제하였습니다.')
            } else {
                alert(data.msg);
            }
        },
        error: function(xhr) {
            alert('알수없는 오유입니다.');
        }
    });
}

$('.like-btn').on('click', async function() {
    const $btn = $(this);
    const $dislikeBtn = $btn.siblings('.dislike-btn');
    const postId = $(this).data('post-id');

    try {
        const response = await fetch(`/forum/${postId}/like`, {
            method: 'POST'
        });

        const data = await response.json();
        if (data.success) {
            $btn.addClass('active');
            $btn.find('.like-count').text(data.likesCount);

            $dislikeBtn.removeClass('active');
            $dislikeBtn.find('.dislike-count').text(data.dislikesCount);
        } else {
            alert(data.message);
        }
    } catch(error) {
        console.error('Error', error);
        alert('오유가 발생하였습니다.');
    }
});

$('.dislike-btn').on('click', async function() {
    const $btn = $(this);
    const $likeBtn = $btn.siblings('.like-btn');
    const postId = $btn.data('post-id');

    try {
        const response = await fetch(`/forum/${postId}/dislike`, {
            method: 'POST'
        });

        const data = await response.json();


        if(data.success) {
            $btn.find('.dislike-count').text(data.dislikesCount);
            $btn.addClass('active');

            $likeBtn.find('.like-count').text(data.likesCount);
            $likeBtn.removeClass('active');
        } else {
            alert(data.message);
        }
    } catch(error) {
        console.error('Error', error);
        alert('오유가 발생하였습니다.');
    }
});
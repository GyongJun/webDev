const fn_update = id => {
    let params = {text: $('#' + id).val()};

    $.ajax({
        url: '/forum/' + id,
        type: 'PUT',
        data: params,
        success: (data) => {
            if(data.status) {
                alert('success');
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
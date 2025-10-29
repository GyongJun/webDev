
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
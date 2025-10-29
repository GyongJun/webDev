const Post = require('../models/Post');

exports.create  = async (req, res) => {

    const originalRefer = req.get('Referer');
    const newPost = new Post({
        text: req.body.text,
        user: req.session.user._id
    });

    try {
        await newPost.save();
        if(originalRefer) {
            req.flash('success', '조작이 성공하였습니다.');
            return res.redirect(originalRefer);
        }
        else {
            req.flash('success', '조작이 성공하였습니다.');
            return res.redirect('/forum');
        }
    }
    catch {
        console.log(err);
    }
}

exports.articleView = async(req, res) => {
    Post.find()
        .populate('user')
        .sort({date : -1})
        .then(posts => {
            if(!posts) {
                req.flash('nopost', '투고된 기사가 없습니다.');
                return res.render('forum');
            }

            res.render('forum', {posts : posts});
        })
        .catch(err => console.log(err));
}

exports.updatePost = function(req, res) {
    Post.findById(req.params.id)
        .then(post => {
            post.text = req.body.text;
            
            post.save()
                .then(updatedPost => {
                    const result = {status: true, msg:'조작이 성공하였습니다.', post: updatedPost};
                    return res.json(result);
                })
                .catch(err => {
                    const result = {status: false, msg: '자료기지조작이 실패하였습니다.'};
                    return res.json(result);
                });
        });
};
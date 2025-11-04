const Post = require('../models/Post');
const { post } = require('../router/post');

exports.createPost  = async (req, res) => {

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

exports.postView = async(req, res) => {
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

exports.deletePost = function(req, res) {
    Post.findById(req.params.id)
        .then(post => {
            if(post.user.toString() !== req.session.user._id.toString()) {
                const result = {status: false, msg: '사용자권한이 없습니다'};
                return res.json(result);
            }

            post.deleteOne()
                .then(() => {
                    const result = {status: true, msg: '조작이 성공하였습니다.'};
                    return res.json(result);
                })
                .catch(err => {
                    const result = {status: false, msg: '자료기지조작이 실패하였습니다'};
                    return res.json(result);
                });
        })
        .catch (err => {
            const result = {status: false, msg : '자료기지조작이 실패하였습니다.'};
            return res.json(result);
        })
}

exports.commentView = function(req, res) {
    Post.findById(req.params.id)
        .populate('user')
        .then(post => res.render('comment', {post: post}))
        .catch(err => res.json(err));
}

exports.commentSend = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if(!post) {
            return res.status(404).json({
                success: false,
                message: '게시글을 찾을수 없습니다.'
            });
        }

        const newComment = {
            text: req.body.text,
            user: req.session.user._id
        };
        
        await post.comments.unshift(newComment);
        
        console.log('2');
        await post.save();

        console.log('3');
        res.json({
            success: true,
            message: '답변이 등록되였습니다',
            comment: newComment
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: 'Sever 오유'
        });
    }
};
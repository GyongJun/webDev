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
    try{
        const posts = await Post.find()
            .populate('user')
            .sort({date : -1});

        const postsWithLikeStatus = posts.map(post=> {
            const userLiked = req.session.user?
                post.likes.includes(req.session.user._id) : false;
            const userDisliked = req.session.user?
                post.dislikes.includes(req.session.user._id) : false;

            return {
                ...post.toObject(),
                userLiked: userLiked,
                userDisliked: userDisliked
            };
        });
        
        res.render('forum', { posts: postsWithLikeStatus});
    } catch(error) {
        console.error('Error:', error);
        res.status(500).render('error');
    }
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
        .populate('comments.user')
        .then(post => res.render('comment', {post: post}))
        .catch(err => res.json(err));
}

exports.commentSend = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId)
                                .populate('comments.user');

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
            comment: newComment,
            name: req.session.user.name
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: 'Sever 오유'
        });
    }
};

exports.commentDelete = async(req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if(!post) {
            return res.status(404).json({
                success: false,
                message: '게시글을 찾을수 없습니다.'
            });
        }

        const comment = post.comments.id(req.params.commentId);

        if(!comment) {
            return res.status(404).josn({
                success: false,
                message: '답변글을 찾을수 없습니다.'
            });
        }

        if(comment.user.toString() !== req.session.user._id.toString()) {
            const result = {
                success: false,
                message: '사용자권한이 존재하지 않습니다.'
            }
            return res.json(result);
        }

        comment.deleteOne();
        await post.save();

        const result = {
            success: true,
            message: '삭제조작이 성공하였습니다.'
        }
        res.json(result);
    } catch(error) {
        res.status(500).json({
            success: false,
            message: 'Sever 오유'
        })
    }
};

exports.addLike = async(req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.session.user._id;

        const post = await Post.findById(postId);

        if(post.likes.includes(userId)) {
            return res.json({
                success: false,
                message: '이미 찬성단추 누른상태'
            });
        }

        if(post.dislikes.includes(userId)) {
            post.dislikes.pull(userId);
            post.dislikesCount--;
        }

        post.likes.push(userId);
        post.likesCount++;

        await post.save();

        res.json({
            success: true,
            likesCount: post.likesCount,
            dislikesCount: post.dislikesCount
        });
    } catch(error) {
        console.error('좋아요 오유', error);
        res.status(500).json({
            success: false,
            message: 'Sever 오유'
        });
    }
};

exports.addDislike = async(req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.session.user._id;

        const post = await Post.findById(postId);

        if(post.dislikes.includes(userId)) {
            return res.json({
                success: false,
                message: '이미 반대단추 누른 상태'
            });
        }

        if(post.likes.includes(userId)) {
            post.likes.pull(userId);
            post.likesCount--;
        }

        post.dislikes.push(userId);
        post.dislikesCount++;

        await post.save();

        res.json({
            success: true,
            likesCount: post.likesCount,
            dislikesCount: post.dislikesCount
        });
    } catch(error) {
        console.error('좋아요 오유', error);
        res.status(500).json({
            success: false,
            message: 'Sever 오유'
        });
    }
}
module.exports = (req, res, next) => {
    if(!req.session.user) {
        req.flash('noUser', '기사투고기능을 사용하시려면 먼저 가입을 진행하여야 합니다.');
        return res.redirect('/login');
    }
    next();
}
module.exports = (req, res, next) => {
    if(!req.session.user) {
        // ✅ AJAX/fetch 요청인지 확인
        const isAjaxRequest = req.xhr || 
                             req.headers['content-type'] === 'application/json' ||
                             req.originalUrl.startsWith('/api/');

        if (isAjaxRequest) {
            // AJAX 요청에는 JSON 응답
            return res.status(401).json({
                success: false,
                message: '로그인이 필요합니다',
            });
            console.log('auth.js')
        } else {
            // 일반 요청에는 리다이렉트
            req.flash('noUser', '기사투고기능을 사용하시려면 먼저 가입을 진행하여야 합니다.');
            return res.redirect('/login');
        }
    }
    next();
};
// 최종 완성형 미들웨어
const completePostValidation = (req, res, next) => {
    const { text } = req.body;
    
    // 1. Validation
    if (!text || text.trim() === '') {
        return res.status(400).json({
            success: false,
            message: '내용을 입력해주세요'
        });
    }
    
    const cleanText = text.trim();
    if (cleanText.length < 10) {
        return res.status(400).json({
            success: false,
            message: '10자 이상 입력해주세요'
        });
    }
    
    // 2. Sanitization
    req.body.text = cleanText
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    next();
};

// 사용
router.post('/', completePostValidation, postController.create);
exports.completePostValidation = (req, res, next) => {
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({
            success: false,
            message: '내용을 입력하시오'
        });
    }

    const cleanText = text.trim();
    if (cleanText.length < 10) {
        return res.status(400).json ({
            success: false,
            message: '10자 이상 입력하시오'
        });
    }

    req.body.text = cleanText
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    next();
}